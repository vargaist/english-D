from decimal import Decimal

from rest_framework import serializers

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


class PropertySerializer(serializers.ModelSerializer):
    room_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Property
        fields = [
            "id", "name", "address", "notes", "status",
            "default_cleaning_cost", "default_linen_cost",
            "currency", "room_count", "created_at", "updated_at",
        ]


class RoomSerializer(serializers.ModelSerializer):
    property_name = serializers.CharField(source="property.name", read_only=True)

    class Meta:
        model = Room
        fields = [
            "id", "property", "property_name", "name", "room_type",
            "capacity", "notes", "active", "created_at", "updated_at",
        ]


class BookingSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingSource
        fields = ["id", "code", "label", "default_commission_pct"]


class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = ["id", "code", "label", "is_direct_booking_cost"]


class BookingRoomSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(source="room.name", read_only=True)

    class Meta:
        model = BookingRoom
        fields = ["id", "room", "room_name"]


class BookingSerializer(serializers.ModelSerializer):
    rooms = BookingRoomSerializer(many=True, required=False)
    room_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    property_name = serializers.CharField(source="property.name", read_only=True)
    source_label = serializers.CharField(source="source.label", read_only=True)
    nights = serializers.IntegerField(read_only=True)
    estimated_profit = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id", "property", "property_name",
            "source", "source_label", "external_ref",
            "guest_name", "guest_email", "guest_phone",
            "check_in", "check_out", "nights", "num_guests",
            "gross_value", "cleaning_fee_charged", "extra_charges",
            "commission", "payout_received", "currency",
            "payment_status", "notes", "cancelled",
            "rooms", "room_ids",
            "estimated_profit",
            "created_at", "updated_at",
        ]

    def validate(self, data):
        check_in = data.get("check_in", getattr(self.instance, "check_in", None))
        check_out = data.get("check_out", getattr(self.instance, "check_out", None))
        if check_in and check_out and check_out <= check_in:
            raise serializers.ValidationError({"check_out": "Must be after check_in."})
        return data

    def _apply_rooms(self, booking: Booking, room_ids: list[int]) -> None:
        booking.rooms.all().delete()
        for rid in room_ids:
            br = BookingRoom(booking=booking, room_id=rid)
            br.full_clean()  # triggers overlap check
            br.save()

    def create(self, validated_data):
        room_ids = validated_data.pop("room_ids", [])
        validated_data.pop("rooms", None)
        booking = Booking.objects.create(**validated_data)
        if room_ids:
            self._apply_rooms(booking, room_ids)
        # auto-suggest operational tasks
        from .models import suggest_tasks_for_booking
        suggest_tasks_for_booking(booking)
        return booking

    def update(self, instance, validated_data):
        room_ids = validated_data.pop("room_ids", None)
        validated_data.pop("rooms", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if room_ids is not None:
            self._apply_rooms(instance, room_ids)
        return instance


class ExpenseSerializer(serializers.ModelSerializer):
    category_label = serializers.CharField(source="category.label", read_only=True)
    property_name = serializers.CharField(source="property.name", read_only=True)

    class Meta:
        model = Expense
        fields = [
            "id", "property", "property_name", "room", "booking",
            "category", "category_label",
            "description", "supplier", "amount", "currency", "date",
            "recurrence", "attachment", "notes",
            "created_at", "updated_at",
        ]


class TaskSerializer(serializers.ModelSerializer):
    property_name = serializers.CharField(source="property.name", read_only=True)

    class Meta:
        model = Task
        fields = [
            "id", "property", "property_name", "room", "booking",
            "task_type", "title", "assigned_to",
            "due_date", "completed_date", "status", "notes",
            "created_at", "updated_at",
        ]


class PaymentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentRecord
        fields = ["id", "booking", "received_on", "amount", "currency", "reference", "notes"]
