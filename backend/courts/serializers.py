from rest_framework import serializers

class CourtSerializer(serializers.Serializer):
    admin_id = serializers.CharField()
    name = serializers.CharField()
    location = serializers.CharField()
    media = serializers.CharField()
    capacity = serializers.IntegerField(min_value=1)
    operating_hours = serializers.DictField()
    available = serializers.BooleanField(default=True)

    def validate_media(self, value):
        if not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Media must be a valid URL")
        return value

    def validate_operating_hours(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Operating hours must be a JSON object")
        # Add additional validation for operating hours structure if needed
        return value