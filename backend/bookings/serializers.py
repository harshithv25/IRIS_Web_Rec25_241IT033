from rest_framework import serializers
from datetime import datetime
from bson import ObjectId
import re

class CancelSerializer(serializers.Serializer):
    cancelled = serializers.BooleanField()
    reason = serializers.CharField()
class BookingSerializer(serializers.Serializer):
    user_id = serializers.CharField()
    admin_id = serializers.CharField()
    booking_type = serializers.ChoiceField(choices=["Equipment", "Court"])
    infrastructure_id = serializers.CharField()
    start_time = serializers.CharField()
    end_time = serializers.CharField()
    validated = serializers.BooleanField(required=False, allow_null=True)
    cancel_status = CancelSerializer(required=False)
    expired = serializers.BooleanField(required=False, default=False)
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

    def validate_start_time(self, value):
        try:
            return datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            raise serializers.ValidationError("start_time must be in 'YYYY-MM-DD HH:MM:SS' format")

    def validate_end_time(self, value):
        try:
            return datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            raise serializers.ValidationError("end_time must be in 'YYYY-MM-DD HH:MM:SS' format")

    def validate(self, data):
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("end_time must be after start_time")
        return data
    
    
# alright now when the user decides to cancel the booking, the user id of the next user in line should be updated to the user_id field in booking. and then the users should be promoted up the waitlist (their positions should be updated since the user cancelled). this should happen if the type is cancel. when the type is check-in, we should remove the waitlist (remove all the users) and set the `expired` field to true. when the type is validate, we should change the `validated` field to true. when the type is deny we should update `cancel_status` (which is a )

#         if type == "cancel" and user_id:
#             booking = Booking.collection.find_one_and_update(
#                 {"_id": ObjectId(booking_id)},
#                 {"$set": data},
#                 return_document=True
#             )
#             return booking
        
#         if type == "waitlist" and user_id:
#             waitlist = Booking.get_one("_id", booking_id).get("waitlist", {})
#             if(len(waitlist) > 4):
#                 booking = Booking.collection.find_one_and_update(
#                     {"_id": ObjectId(booking_id)},
#                     {"$set": {f"waitlist.{len(waitlist)}": ObjectId(user_id)}},
#                     return_document=True
#                 )
#                 return booking
#             else:
#                 raise IndexError("Waitlist is too long")
                
#         if type == "check-in" and booking_id and user_id:
#             admin = Booking.get_one("_id", booking_id).get("admin_id", {})
            
#             if admin == user_id:
#                 booking = Booking.collection.find_one_and_update(
#                     {"_id": ObjectId(booking_id)},
#                     {"$set": data},
#                     return_document=True
#                 )
#                 return booking
#             else:
#                 raise ValueError("Need to be an admin to check in users") 