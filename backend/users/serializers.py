from rest_framework import serializers
import re
from datetime import datetime, timedelta

class PenaltySerializer(serializers.Serializer):
    booking_id = serializers.CharField()
    reason = serializers.CharField()
    issued_by = serializers.CharField()
    expires_at = serializers.DateTimeField()  # 24 hours from issuance
    is_active = serializers.BooleanField(default=True)

    def validate_booking_id(self, value):
        from bson import ObjectId
        try:
            ObjectId(value)
            return value
        except:
            raise serializers.ValidationError("Invalid booking ID format")

class UserSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    branch = serializers.CharField()
    roll_number = serializers.CharField()
    password = serializers.CharField()
    role = serializers.ChoiceField(choices=["Admin", "User"])
    penalties = serializers.ListField(
        child=PenaltySerializer(),
        required=False,
        default=[]
    )
    
    def validate_email(self, value):
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Invalid email format.")
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long.")
        return value