from django.contrib import admin

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


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "currency")
    search_fields = ("name", "address")


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("name", "property", "room_type", "capacity", "active")
    list_filter = ("property", "room_type", "active")


class BookingRoomInline(admin.TabularInline):
    model = BookingRoom
    extra = 1


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("guest_name", "property", "check_in", "check_out", "gross_value", "payment_status")
    list_filter = ("property", "source", "payment_status", "cancelled")
    search_fields = ("guest_name", "guest_email", "external_ref")
    date_hierarchy = "check_in"
    inlines = [BookingRoomInline]


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ("date", "property", "category", "amount", "currency")
    list_filter = ("property", "category", "recurrence")
    date_hierarchy = "date"


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("task_type", "property", "due_date", "status")
    list_filter = ("property", "status", "task_type")


admin.site.register(BookingSource)
admin.site.register(ExpenseCategory)
admin.site.register(PaymentRecord)
