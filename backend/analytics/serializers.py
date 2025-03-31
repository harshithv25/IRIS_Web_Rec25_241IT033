from rest_framework import serializers

class AnalyticsSerializer(serializers.Serializer):
    admin_id = serializers.CharField()
    bookingCount = serializers.DictField()

    def validate_bookingCount(self, value):
        if not isinstance(value, dict) or "x" not in value or "y" not in value:
            raise serializers.ValidationError("bookingCount must contain 'x' and 'y' lists.")
        if not isinstance(value["x"], list) or not isinstance(value["y"], list):
            raise serializers.ValidationError("'x' and 'y' must be lists.")
        if len(value["x"]) != len(value["y"]):
            raise serializers.ValidationError("'x' and 'y' lists must have the same length.")
        return value
