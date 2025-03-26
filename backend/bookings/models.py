from bson import ObjectId
from django.conf import settings
from datetime import datetime

from pymongo import MongoClient

client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]

class Booking:
    collection = db["bookings"]

    @staticmethod
    def create(data):
        booking = Booking.collection.insert_one(data)
        return Booking.get_one(booking.inserted_id)

    @staticmethod
    def get_all():
        return list(Booking.collection.find({}))

    @staticmethod
    def get_all_by_constraint(field_type, field_value):
        return list(Booking.collection.find({field_type: field_value}))

    @staticmethod
    def get_one(field_type, field_value):
        if(field_type == "_id"):
            return Booking.collection.find_one({field_type: ObjectId(field_type)})
        else:
            return Booking.collection.find_one({field_type: field_value})
            
    @staticmethod
    def update(booking_id, data, type, user_id):
        booking = Booking.collection.find_one({"_id": ObjectId(booking_id)})
        if not booking:
            raise ValueError("Booking not found")

        if type == "cancel" and user_id:
            # Promote next user from waitlist
            waitlist = booking.get("waitlist", {})
            if len(waitlist) >= 1:
                # Get first user in waitlist (position "0")
                next_user_id = waitlist.get("0")
                if next_user_id:
                    # Update booking with new user
                    updated_data = {
                        "user_id": ObjectId(next_user_id),
                        "waitlist": {str(int(k)-1): v for k, v in waitlist.items() 
                                    if int(k) > 0}  # Shift all users up
                    }
                    
                    booking = Booking.collection.find_one_and_update(
                        {"_id": ObjectId(booking_id)},
                        {"$set": updated_data},
                        return_document=True
                    )
                    return booking
            
            # If no waitlist, just update with cancel data
            booking = Booking.collection.find_one_and_update(
                {"_id": ObjectId(booking_id)},
                {"$set": data},
                return_document=True
            )
            return booking

        elif type == "check-in":
            # Verify admin and clear waitlist
            if booking.get("admin_id") != ObjectId(user_id):
                raise ValueError("Need to be an admin to check in users")
                
            booking = Booking.collection.find_one_and_update(
                {"_id": ObjectId(booking_id)},
                {"$set": {"expired": True, "waitlist": {}}},  # Clear waitlist
                return_document=True
            )
            return booking
        
        # elif type == "penalty":
        #     yet to implement

        elif type == "validate":
            booking = Booking.collection.find_one_and_update(
                {"_id": ObjectId(booking_id)},
                {"$set": {"validated": True}},
                return_document=True
            )
            return booking

        elif type == "deny":
            if "reason" not in data:
                raise ValueError("Reason required for denial")
                
            booking = Booking.collection.find_one_and_update(
                {"_id": ObjectId(booking_id)},
                {"$set": {
                    "cancel_status": {
                        "cancelled": True,
                        "reason": data["reason"]
                    },
                    "expired": True
                }},
                return_document=True
            )
            return booking

        elif type == "waitlist":
            waitlist = booking.get("waitlist", {})
            if len(waitlist) >= 4:  # Assuming max 4 waitlist spots
                raise IndexError("Waitlist is full")
                
            booking = Booking.collection.find_one_and_update(
                {"_id": ObjectId(booking_id)},
                {"$set": {f"waitlist.{len(waitlist)}": ObjectId(user_id)}},
                return_document=True
            )
            return booking

        raise ValueError("Invalid operation type")
                
    @staticmethod
    def delete(booking_id):
        return Booking.collection.delete_one({"_id": ObjectId(booking_id)})
