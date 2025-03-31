from rest_framework import serializers
from bson import ObjectId

class NotificationSerializer(serializers.Serializer):
    user_id = serializers.CharField()
    text = serializers.CharField()
    read = serializers.BooleanField(default=False)

    def create(self, validated_data):
        """Converts user_id to ObjectId before saving."""
        validated_data["user_id"] = ObjectId(validated_data["user_id"])
        return validated_data
