from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("properties", views.PropertyViewSet)
router.register("rooms", views.RoomViewSet)
router.register("booking-sources", views.BookingSourceViewSet)
router.register("expense-categories", views.ExpenseCategoryViewSet)
router.register("bookings", views.BookingViewSet)
router.register("expenses", views.ExpenseViewSet)
router.register("tasks", views.TaskViewSet)
router.register("payments", views.PaymentRecordViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("reports/monthly/", views.monthly_report, name="monthly-report"),
    path("reports/by-property/", views.by_property_report, name="by-property-report"),
    path("reports/booking-profitability/", views.booking_profitability_report, name="booking-profitability-report"),
]
