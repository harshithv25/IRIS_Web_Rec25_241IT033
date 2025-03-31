from rest_framework import serializers
from bson import ObjectId
from dateutil.parser import isoparse

class CancelSerializer(serializers.Serializer):
    cancelled = serializers.BooleanField()
    reason = serializers.CharField()
class BookingSerializer(serializers.Serializer):
    user_id = serializers.CharField()
    admin_id = serializers.CharField()
    booking_type = serializers.ChoiceField(choices=["Equipment", "Courts"])
    name=serializers.CharField()
    infrastructure_id = serializers.CharField()
    start_time = serializers.CharField()
    end_time = serializers.CharField()
    validated = serializers.BooleanField(required=False, allow_null=True)
    password = serializers.CharField(required=False, allow_null=True)
    cancel_status = CancelSerializer(required=False)
    expired = serializers.BooleanField(required=False, default=False)
    type = serializers.CharField(required=False)
    waitlist = serializers.DictField(
        child=serializers.CharField(),
        required=False,
        default={}
    )

    def validate_user_id(self, value):
        try:
            return ObjectId(value)
        except:
            raise serializers.ValidationError("Invalid user_id format")

    # def validate_start_time(self, value):
    #     try:
    #         return isoparse(value)  # Correctly parses ISO 8601 format
    #     except ValueError:
    #         raise serializers.ValidationError("start_time must be in ISO 8601 format (e.g., 'YYYY-MM-DDTHH:MM:SSZ')")

    # def validate_end_time(self, value):
    #     try:
    #         return isoparse(value)  # Correctly parses ISO 8601 format
    #     except ValueError:
    #         raise serializers.ValidationError("end_time must be in ISO 8601 format (e.g., 'YYYY-MM-DDTHH:MM:SSZ')")