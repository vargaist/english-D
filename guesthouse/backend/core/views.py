"""REST views for the guesthouse app.

Also exposes:
- /api/dashboard/ : owner dashboard summary
- /api/reports/monthly/ : revenue/expense/profit by month
- /api/reports/by-property/ : profitability per property
- /api/reports/booking-profitability/ : per-booking breakdown
"""
from __future__ import annotations

from collections import defaultdict
from datetime import date, timedelta
from decimal import Decimal

from django.db.models import Count, Q, Sum
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    Booking,
    BookingRoom,
    BookingSource,
    Expense,
    ExpenseCategory,
    PaymentRecord,
    Property,
    Room,
    Task,
)
from .serializers import (
    BookingSerializer,
    BookingSourceSerializer,
    ExpenseCategorySerializer,
    ExpenseSerializer,
    PaymentRecordSerializer,
    PropertySerializer,
    RoomSerializer,
    TaskSerializer,
)


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    filterset_fields = ["status"]
    search_fields = ["name", "address"]


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.select_related("property").all()
    serializer_class = RoomSerializer
    filterset_fields = ["property", "active", "room_type"]
    search_fields = ["name"]


class BookingSourceViewSet(viewsets.ModelViewSet):
    queryset = BookingSource.objects.all()
    serializer_class = BookingSourceSerializer


class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = (
        Booking.objects.select_related("property", "source")
        .prefetch_related("rooms__room")
        .all()
    )
    serializer_class = BookingSerializer
    filterset_fields = ["property", "source", "payment_status", "cancelled"]
    search_fields = ["guest_name", "external_ref", "guest_email"]
    ordering_fields = ["check_in", "check_out", "gross_value"]

    def get_queryset(self):
        qs = super().get_queryset()
        start = self.request.query_params.get("start")
        end = self.request.query_params.get("end")
        if start and end:
            qs = qs.filter(check_in__lt=end, check_out__gt=start)
        return qs


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.select_related("property", "room", "booking", "category").all()
    serializer_class = ExpenseSerializer
    filterset_fields = ["property", "room", "booking", "category", "recurrence"]
    search_fields = ["description", "supplier"]
    ordering_fields = ["date", "amount"]


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.select_related("property", "room", "booking").all()
    serializer_class = TaskSerializer
    filterset_fields = ["property", "status", "task_type", "booking"]
    ordering_fields = ["due_date", "status"]


class PaymentRecordViewSet(viewsets.ModelViewSet):
    queryset = PaymentRecord.objects.select_related("booking").all()
    serializer_class = PaymentRecordSerializer
    filterset_fields = ["booking"]


# ---------------------------------------------------------------------------
# Dashboard + reports
# ---------------------------------------------------------------------------

def _month_range(d: date) -> tuple[date, date]:
    start = d.replace(day=1)
    if start.month == 12:
        end = start.replace(year=start.year + 1, month=1)
    else:
        end = start.replace(month=start.month + 1)
    return start, end


@api_view(["GET"])
def dashboard(request):
    today = timezone.localdate()
    month_start, month_end = _month_range(today)

    arrivals = Booking.objects.filter(check_in=today, cancelled=False)
    departures = Booking.objects.filter(check_out=today, cancelled=False)

    occupied_room_ids = BookingRoom.objects.filter(
        booking__check_in__lte=today,
        booking__check_out__gt=today,
        booking__cancelled=False,
    ).values_list("room_id", flat=True)
    occupied_by_property = (
        Room.objects.filter(id__in=occupied_room_ids)
        .values("property_id", "property__name")
        .annotate(rooms_occupied=Count("id"))
    )

    occupancy = []
    for prop in Property.objects.filter(status=Property.Status.ACTIVE):
        total_rooms = prop.rooms.filter(active=True).count()
        occupied = sum(
            r["rooms_occupied"] for r in occupied_by_property if r["property_id"] == prop.id
        )
        occupancy.append({
            "property_id": prop.id,
            "property_name": prop.name,
            "total_rooms": total_rooms,
            "occupied_rooms": occupied,
            "occupancy_pct": round((occupied / total_rooms * 100), 1) if total_rooms else 0,
        })

    month_bookings = Booking.objects.filter(
        check_in__gte=month_start, check_in__lt=month_end, cancelled=False,
    )
    gross_revenue = month_bookings.aggregate(s=Sum("gross_value"))["s"] or Decimal("0")
    commission_total = month_bookings.aggregate(s=Sum("commission"))["s"] or Decimal("0")
    month_expenses = Expense.objects.filter(date__gte=month_start, date__lt=month_end)
    expense_total = month_expenses.aggregate(s=Sum("amount"))["s"] or Decimal("0")
    estimated_profit = gross_revenue - commission_total - expense_total

    alerts = []
    # missing payouts: bookings fully checked-out but payment_status != paid
    missing_payouts = Booking.objects.filter(
        check_out__lt=today, cancelled=False
    ).exclude(payment_status=Booking.PaymentStatus.PAID).count()
    if missing_payouts:
        alerts.append({"type": "missing_payout", "count": missing_payouts})
    overdue_tasks = Task.objects.filter(
        due_date__lt=today,
        status__in=[Task.Status.PENDING, Task.Status.IN_PROGRESS],
    ).count()
    if overdue_tasks:
        alerts.append({"type": "overdue_task", "count": overdue_tasks})

    return Response({
        "today": today,
        "arrivals": BookingSerializer(arrivals, many=True).data,
        "departures": BookingSerializer(departures, many=True).data,
        "occupied_tonight": len(occupied_room_ids),
        "occupancy_by_property": occupancy,
        "bookings_this_month": month_bookings.count(),
        "gross_revenue_month": gross_revenue,
        "expense_total_month": expense_total,
        "estimated_profit_month": estimated_profit,
        "recent_expenses": ExpenseSerializer(
            Expense.objects.order_by("-date")[:8], many=True
        ).data,
        "pending_tasks": TaskSerializer(
            Task.objects.filter(
                status__in=[Task.Status.PENDING, Task.Status.IN_PROGRESS]
            ).order_by("due_date")[:10],
            many=True,
        ).data,
        "alerts": alerts,
    })


@api_view(["GET"])
def monthly_report(request):
    """Revenue/expenses/profit grouped by month for the last N months."""
    months_back = int(request.query_params.get("months", 12))
    today = timezone.localdate()
    start_month = (today.replace(day=1) - timedelta(days=30 * months_back)).replace(day=1)

    rows: dict[str, dict] = defaultdict(lambda: {"revenue": Decimal("0"), "commission": Decimal("0"), "expenses": Decimal("0")})

    for b in Booking.objects.filter(check_in__gte=start_month, cancelled=False):
        key = b.check_in.strftime("%Y-%m")
        rows[key]["revenue"] += b.gross_value or Decimal("0")
        rows[key]["commission"] += b.commission or Decimal("0")
    for e in Expense.objects.filter(date__gte=start_month):
        key = e.date.strftime("%Y-%m")
        rows[key]["expenses"] += e.amount or Decimal("0")

    result = []
    for key in sorted(rows.keys()):
        r = rows[key]
        result.append({
            "month": key,
            "revenue": r["revenue"],
            "commission": r["commission"],
            "expenses": r["expenses"],
            "profit": r["revenue"] - r["commission"] - r["expenses"],
        })
    return Response(result)


@api_view(["GET"])
def by_property_report(request):
    result = []
    for prop in Property.objects.all():
        bookings = Booking.objects.filter(property=prop, cancelled=False)
        revenue = bookings.aggregate(s=Sum("gross_value"))["s"] or Decimal("0")
        commission = bookings.aggregate(s=Sum("commission"))["s"] or Decimal("0")
        expenses = Expense.objects.filter(property=prop).aggregate(s=Sum("amount"))["s"] or Decimal("0")
        result.append({
            "property_id": prop.id,
            "property_name": prop.name,
            "bookings": bookings.count(),
            "revenue": revenue,
            "commission": commission,
            "expenses": expenses,
            "profit": revenue - commission - expenses,
        })
    return Response(result)


@api_view(["GET"])
def booking_profitability_report(request):
    result = []
    qs = Booking.objects.filter(cancelled=False).select_related("property")
    prop_id = request.query_params.get("property")
    if prop_id:
        qs = qs.filter(property_id=prop_id)
    for b in qs:
        linked = b.linked_expenses_total()
        result.append({
            "id": b.id,
            "guest_name": b.guest_name,
            "property_name": b.property.name,
            "check_in": b.check_in,
            "check_out": b.check_out,
            "nights": b.nights,
            "gross_value": b.gross_value,
            "commission": b.commission,
            "linked_costs": linked,
            "estimated_profit": b.gross_value - b.commission - linked,
        })
    return Response(result)
