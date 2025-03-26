from rest_framework import serializers
import re

class EquipmentSerializer(serializers.Serializer):
    admin_id = serializers.CharField()
    name = serializers.CharField()
    category = serializers.ChoiceField(choices=["football", "cricket", "basketball", "chess", "billiards", "throwball", "kho-kho", "table-tennis", "tennis","swimming", "hockey", "badminton", "kabaddi", "volleyball", "carrom", "misc"])
    media = serializers.CharField()
    quantity = serializers.IntegerField(min_value=0)
    condition = serializers.ChoiceField(choices=["new", "used", "damaged"])
    available = serializers.BooleanField(default=True)

    def validate_media(self, value):
        if not re.match(r"^(http|https):\/\/", value):
            raise serializers.ValidationError("Media must be a valid URL")
        return value