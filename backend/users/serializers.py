from rest_framework import serializers
import re

class PenaltySerializer(serializers.Serializer):
    isPenalty = serializers.BooleanField()
    endTimeStamp = serializers.CharField()

class UserSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    branch = serializers.CharField()
    roll_number = serializers.CharField()
    password = serializers.CharField()
    role = serializers.ChoiceField(choices=["admin", "user"])
    penalty = PenaltySerializer(required=False)  

    def validate_email(self, value):
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Invalid email format.")
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long.")
        return value