"""Core domain models for the guesthouse management app.

Design notes:
- Multi-property from day one: everything hangs off Property.
- Bookings are room-level. A booking can span multiple rooms via BookingRoom.
- Expenses can be attributed to property, room, and/or a specific booking.
- Tasks tie to bookings but can also be standalone (maintenance, etc).
- Profitability is computed per booking by subtracting commission and linked expenses.
"""
from __future__ import annotations

from datetime import timedelta
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q, Sum


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Property(TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"
        UPCOMING = "upcoming", "Upcoming"

    name = models.CharField(max_length=120, unique=True)
    address = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.ACTIVE)
    default_cleaning_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    default_linen_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    currency = models.CharField(max_length=3, default="EUR")

    class Meta:
        verbose_name_plural = "properties"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

    @property
    def room_count(self) -> int:
        return self.rooms.filter(active=True).count()


class Room(TimeStampedModel):
    class RoomType(models.TextChoices):
        STANDARD = "standard", "Standard"
        DOUBLE = "double", "Double"
        TWIN = "twin", "Twin"
        FAMILY = "family", "Family"
        SUITE = "suite", "Suite"
        DORM = "dorm", "Dorm"

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="rooms")
    name = models.CharField(max_length=80)
    room_type = models.CharField(max_length=16, choices=RoomType.choices, default=RoomType.STANDARD)
    capacity = models.PositiveSmallIntegerField(default=2)
    notes = models.TextField(blank=True)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ["property__name", "name"]
        unique_together = [("property", "name")]

    def __str__(self) -> str:
        return f"{self.property.name} · {self.name}"


class BookingSource(TimeStampedModel):
    """Reference table so new channels (Expedia, Hostelworld) can be added without migrations."""

    code = models.SlugField(max_length=32, unique=True)
    label = models.CharField(max_length=64)
    default_commission_pct = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0"))

    def __str__(self) -> str:
        return self.label


class ExpenseCategory(TimeStampedModel):
    code = models.SlugField(max_length=32, unique=True)
    label = models.CharField(max_length=64)
    # Categories that are direct booking costs flow into booking profitability.
    is_direct_booking_cost = models.BooleanField(
        default=False,
        help_text="If true, expenses in this category are subtracted from booking profit when linked to a booking.",
    )

    class Meta:
        verbose_name_plural = "expense categories"
        ordering = ["label"]

    def __str__(self) -> str:
        return self.label


class Booking(TimeStampedModel):
    class PaymentStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        PARTIAL = "partial", "Partial"
        PAID = "paid", "Paid"
        REFUNDED = "refunded", "Refunded"

    property = models.ForeignKey(Property, on_delete=models.PROTECT, related_name="bookings")
    source = models.ForeignKey(BookingSource, on_delete=models.PROTECT, related_name="bookings")
    external_ref = models.CharField(max_length=120, blank=True, help_text="Airbnb/Booking reservation id, for future sync")

    guest_name = models.CharField(max_length=120)
    guest_email = models.EmailField(blank=True)
    guest_phone = models.CharField(max_length=40, blank=True)

    check_in = models.DateField()
    check_out = models.DateField()
    num_guests = models.PositiveSmallIntegerField(default=1)

    gross_value = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    cleaning_fee_charged = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    extra_charges = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    commission = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    payout_received = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    currency = models.CharField(max_length=3, default="EUR")

    payment_status = models.CharField(max_length=16, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    notes = models.TextField(blank=True)

    cancelled = models.BooleanField(default=False)

    class Meta:
        ordering = ["-check_in"]
        indexes = [
            models.Index(fields=["property", "check_in"]),
            models.Index(fields=["check_in", "check_out"]),
        ]

    def __str__(self) -> str:
        return f"{self.guest_name} · {self.property.name} · {self.check_in}"

    @property
    def nights(self) -> int:
        return max((self.check_out - self.check_in).days, 0)

    def clean(self) -> None:
        if self.check_in and self.check_out and self.check_out <= self.check_in:
            raise ValidationError({"check_out": "Check-out must be after check-in."})

    def booked_room_ids(self) -> list[int]:
        return list(self.rooms.values_list("room_id", flat=True))

    def linked_expenses_total(self) -> Decimal:
        total = Expense.objects.filter(
            booking=self, category__is_direct_booking_cost=True
        ).aggregate(s=Sum("amount"))["s"]
        return total or Decimal("0")

    @property
    def estimated_profit(self) -> Decimal:
        """Booking-level profit = gross - commission - linked direct costs."""
        return (
            (self.gross_value or Decimal("0"))
            - (self.commission or Decimal("0"))
            - self.linked_expenses_total()
        )


class BookingRoom(models.Model):
    """Link table so a booking can cover one or multiple rooms."""

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="rooms")
    room = models.ForeignKey(Room, on_delete=models.PROTECT, related_name="booking_rooms")

    class Meta:
        unique_together = [("booking", "room")]

    def __str__(self) -> str:
        return f"{self.booking_id} · {self.room}"

    def clean(self) -> None:
        """Reject overlaps for the same room. Treats check_out as exclusive (industry standard)."""
        if not self.room_id or not self.booking_id:
            return
        b = self.booking
        overlapping = (
            BookingRoom.objects
            .filter(room_id=self.room_id)
            .exclude(pk=self.pk)
            .exclude(booking__cancelled=True)
            .filter(booking__check_in__lt=b.check_out, booking__check_out__gt=b.check_in)
        )
        if overlapping.exists():
            raise ValidationError(
                f"Room {self.room} is already booked between {b.check_in} and {b.check_out}."
            )


class Expense(TimeStampedModel):
    class Recurrence(models.TextChoices):
        ONE_TIME = "one_time", "One-time"
        MONTHLY = "monthly", "Monthly"
        WEEKLY = "weekly", "Weekly"
        YEARLY = "yearly", "Yearly"

    property = models.ForeignKey(Property, on_delete=models.PROTECT, related_name="expenses")
    room = models.ForeignKey(Room, null=True, blank=True, on_delete=models.SET_NULL, related_name="expenses")
    booking = models.ForeignKey(Booking, null=True, blank=True, on_delete=models.SET_NULL, related_name="expenses")
    category = models.ForeignKey(ExpenseCategory, on_delete=models.PROTECT, related_name="expenses")

    description = models.CharField(max_length=255, blank=True)
    supplier = models.CharField(max_length=120, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="EUR")
    date = models.DateField()

    recurrence = models.CharField(max_length=16, choices=Recurrence.choices, default=Recurrence.ONE_TIME)
    attachment = models.FileField(upload_to="expenses/%Y/%m/", null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-date", "-id"]
        indexes = [
            models.Index(fields=["property", "date"]),
            models.Index(fields=["category", "date"]),
        ]

    def __str__(self) -> str:
        return f"{self.date} · {self.category.label} · {self.amount} {self.currency}"


class Task(TimeStampedModel):
    class TaskType(models.TextChoices):
        CLEANING = "cleaning", "Cleaning"
        LINEN = "linen", "Linen wash"
        MINIBAR = "minibar", "Minibar restock"
        PREP = "prep", "Room prep"
        SUPPLIES = "supplies", "Check supplies"
        MAINTENANCE = "maintenance", "Maintenance"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        IN_PROGRESS = "in_progress", "In progress"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="tasks")
    room = models.ForeignKey(Room, null=True, blank=True, on_delete=models.SET_NULL, related_name="tasks")
    booking = models.ForeignKey(Booking, null=True, blank=True, on_delete=models.SET_NULL, related_name="tasks")

    task_type = models.CharField(max_length=16, choices=TaskType.choices, default=TaskType.OTHER)
    title = models.CharField(max_length=160, blank=True)
    assigned_to = models.CharField(max_length=80, blank=True)
    due_date = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["status", "due_date", "-id"]

    def __str__(self) -> str:
        return f"{self.get_task_type_display()} · {self.property.name} · {self.due_date or 'no date'}"


class PaymentRecord(TimeStampedModel):
    """Optional payout tracker — useful when a booking is paid out in installments (Airbnb, Booking)."""

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="payments")
    received_on = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="EUR")
    reference = models.CharField(max_length=120, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-received_on"]


# ---------------------------------------------------------------------------
# Task suggestion helper — called on booking create/update.
# ---------------------------------------------------------------------------

def suggest_tasks_for_booking(booking: Booking) -> list[Task]:
    """Create default operational tasks for a new booking if they don't already exist."""
    created: list[Task] = []
    defaults = [
        (Task.TaskType.PREP, booking.check_in, "Room prep before arrival"),
        (Task.TaskType.MINIBAR, booking.check_in, "Minibar restock"),
        (Task.TaskType.CLEANING, booking.check_out, "Cleaning after checkout"),
        (Task.TaskType.LINEN, booking.check_out, "Linen wash"),
    ]
    for task_type, due, title in defaults:
        exists = Task.objects.filter(booking=booking, task_type=task_type).exists()
        if exists:
            continue
        task = Task.objects.create(
            property=booking.property,
            booking=booking,
            task_type=task_type,
            title=title,
            due_date=due,
        )
        created.append(task)
    return created
