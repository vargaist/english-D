"""Seed the database with realistic demo data for the two current houses."""
from datetime import date, timedelta
from decimal import Decimal
from random import Random

from django.core.management.base import BaseCommand
from django.db import transaction

from core.models import (
    Booking,
    BookingRoom,
    BookingSource,
    Expense,
    ExpenseCategory,
    Property,
    Room,
    Task,
    suggest_tasks_for_booking,
)


class Command(BaseCommand):
    help = "Seed demo data: one 3-room house and one 8-room house with bookings and expenses."

    def add_arguments(self, parser):
        parser.add_argument("--wipe", action="store_true", help="Clear existing data first")

    @transaction.atomic
    def handle(self, *args, **opts):
        rng = Random(42)

        if opts["wipe"]:
            self.stdout.write("Wiping existing data...")
            Task.objects.all().delete()
            Expense.objects.all().delete()
            BookingRoom.objects.all().delete()
            Booking.objects.all().delete()
            Room.objects.all().delete()
            Property.objects.all().delete()
            ExpenseCategory.objects.all().delete()
            BookingSource.objects.all().delete()

        # --- reference tables ---
        sources = {}
        for code, label, pct in [
            ("airbnb", "Airbnb", Decimal("14.00")),
            ("booking", "Booking.com", Decimal("15.00")),
            ("direct", "Direct", Decimal("0.00")),
            ("phone", "Phone", Decimal("0.00")),
            ("other", "Other", Decimal("0.00")),
        ]:
            sources[code], _ = BookingSource.objects.get_or_create(
                code=code, defaults={"label": label, "default_commission_pct": pct}
            )

        categories = {}
        for code, label, direct in [
            ("gas", "Gas", False),
            ("electricity", "Electricity", False),
            ("cleaning", "Cleaning", True),
            ("linen", "Linen washing", True),
            ("minibar", "Minibar stocking", True),
            ("goods", "Other goods", False),
            ("maintenance", "Maintenance", False),
        ]:
            categories[code], _ = ExpenseCategory.objects.get_or_create(
                code=code, defaults={"label": label, "is_direct_booking_cost": direct}
            )

        # --- properties ---
        house3, _ = Property.objects.get_or_create(
            name="Riverside House (3BR)",
            defaults=dict(
                address="Str. Malului 12, Brașov",
                status=Property.Status.ACTIVE,
                default_cleaning_cost=Decimal("80"),
                default_linen_cost=Decimal("25"),
                currency="EUR",
                notes="Small 3-bedroom house, currently off-market.",
            ),
        )
        house8, _ = Property.objects.get_or_create(
            name="Old Town House (8BR)",
            defaults=dict(
                address="Str. Republicii 45, Brașov",
                status=Property.Status.ACTIVE,
                default_cleaning_cost=Decimal("150"),
                default_linen_cost=Decimal("60"),
                currency="EUR",
                notes="8-bedroom house listed on Airbnb.",
            ),
        )

        # --- rooms ---
        rooms_3 = []
        for i, (name, rt, cap) in enumerate([
            ("Bedroom 1", Room.RoomType.DOUBLE, 2),
            ("Bedroom 2", Room.RoomType.TWIN, 2),
            ("Bedroom 3", Room.RoomType.FAMILY, 4),
        ]):
            room, _ = Room.objects.get_or_create(
                property=house3, name=name,
                defaults=dict(room_type=rt, capacity=cap),
            )
            rooms_3.append(room)

        rooms_8 = []
        for i in range(1, 9):
            rt = Room.RoomType.DOUBLE if i <= 5 else Room.RoomType.FAMILY
            cap = 2 if i <= 5 else 4
            room, _ = Room.objects.get_or_create(
                property=house8, name=f"Room {i}",
                defaults=dict(room_type=rt, capacity=cap),
            )
            rooms_8.append(room)

        # --- bookings: spread across last 90 days and next 30 days ---
        today = date.today()
        guest_names = [
            "Anna Müller", "John Smith", "Elena Popescu", "Luca Rossi",
            "Sophie Dubois", "Mikael Olsen", "David Cohen", "Priya Shah",
            "Tomasz Nowak", "Hiroshi Tanaka", "Maria Garcia", "Ben Wright",
        ]

        all_rooms = [(house3, rooms_3), (house8, rooms_8)]
        created_bookings = 0
        for prop, rooms in all_rooms:
            for room in rooms:
                # 2-4 bookings per room over the window
                cursor = today - timedelta(days=85)
                for _ in range(rng.randint(2, 4)):
                    gap = rng.randint(1, 12)
                    nights = rng.randint(2, 6)
                    ci = cursor + timedelta(days=gap)
                    co = ci + timedelta(days=nights)
                    if co > today + timedelta(days=30):
                        break
                    src_code = rng.choice(
                        ["airbnb"] * 5 + ["direct", "booking", "phone"]
                    ) if prop == house8 else rng.choice(["direct", "phone", "airbnb"])
                    src = sources[src_code]
                    nightly = Decimal(rng.randint(45, 110))
                    gross = nightly * nights
                    commission = (gross * src.default_commission_pct / Decimal("100")).quantize(Decimal("0.01"))
                    paid = co < today
                    b = Booking.objects.create(
                        property=prop,
                        source=src,
                        guest_name=rng.choice(guest_names),
                        check_in=ci,
                        check_out=co,
                        num_guests=rng.randint(1, room.capacity),
                        gross_value=gross,
                        cleaning_fee_charged=prop.default_cleaning_cost,
                        commission=commission,
                        payout_received=gross - commission if paid else Decimal("0"),
                        payment_status=(
                            Booking.PaymentStatus.PAID if paid
                            else Booking.PaymentStatus.PENDING
                        ),
                        currency=prop.currency,
                    )
                    # attach room (check overlap via model clean)
                    try:
                        br = BookingRoom(booking=b, room=room)
                        br.full_clean()
                        br.save()
                        created_bookings += 1
                        # auto tasks
                        suggest_tasks_for_booking(b)
                        # linked cleaning + linen expense for past bookings
                        if paid:
                            Expense.objects.create(
                                property=prop, room=room, booking=b,
                                category=categories["cleaning"],
                                description="Post-checkout cleaning",
                                amount=prop.default_cleaning_cost,
                                currency=prop.currency,
                                date=co,
                            )
                            Expense.objects.create(
                                property=prop, room=room, booking=b,
                                category=categories["linen"],
                                description="Linen washing",
                                amount=prop.default_linen_cost,
                                currency=prop.currency,
                                date=co,
                            )
                    except Exception:
                        b.delete()
                    cursor = co

        # --- recurring/utility expenses per property ---
        for prop in [house3, house8]:
            for m in range(3, 0, -1):
                ref_date = (today.replace(day=1) - timedelta(days=30 * m))
                Expense.objects.get_or_create(
                    property=prop, category=categories["gas"],
                    date=ref_date,
                    defaults=dict(
                        description="Monthly gas bill",
                        amount=Decimal("90") if prop == house8 else Decimal("45"),
                        recurrence=Expense.Recurrence.MONTHLY,
                        currency=prop.currency,
                    ),
                )
                Expense.objects.get_or_create(
                    property=prop, category=categories["electricity"],
                    date=ref_date,
                    defaults=dict(
                        description="Monthly electricity bill",
                        amount=Decimal("140") if prop == house8 else Decimal("70"),
                        recurrence=Expense.Recurrence.MONTHLY,
                        currency=prop.currency,
                    ),
                )

        self.stdout.write(self.style.SUCCESS(
            f"Seed complete. Properties=2, rooms={len(rooms_3) + len(rooms_8)}, bookings={created_bookings}."
        ))
