from users.models import User
from equipment.models import Equipment
from bson import ObjectId
from django.conf import settings
from datetime import datetime, timedelta
from pymongo import MongoClient
import math, random


# function to generate OTP
def generatePassword() :
	string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	PASSWORD = ""
	length = len(string)
	for i in range(4) :
		PASSWORD += string[math.floor(random.random() * length)]

	return PASSWORD

client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]

class Booking:
    collection = db["bookings"]

    @staticmethod
    def create(data):
        user_id = ObjectId(data['user_id'])
        start_time = datetime.strptime(data['start_time'], "%Y-%m-%d %H:%M:%S")
        start_date = start_time.date()
        
        existing_booking = Booking.collection.find_one({
            'user_id': user_id,
            'start_time': {
                '$gte': datetime.combine(start_date, datetime.min.time()),
                '$lt': datetime.combine(start_date + timedelta(days=1), datetime.min.time())
            }
        })
        
        if existing_booking:
            raise ValueError("User already has a booking for this date")
        
        data = {**data, "waitlist": {}}
        
        booking = Booking.collection.insert_one(data)
        return Booking.get_one("_id", booking.inserted_id)

    @staticmethod
    def get_all():
        return list(Booking.collection.find({}))

    @staticmethod
    def get_all_by_constraint(field_type, field_value):
        return list(Booking.collection.find({
            "$or": [
                {field_type: field_value},  # Direct match for user_id
                {f"waitlist.{'$exists'}": True, f"waitlist": {"$in": [field_value]}}  # Check if user_id is in waitlist
            ]
        }))


    @staticmethod
    def get_one(field_type, field_value):
        if(field_type == "_id"):
            return Booking.collection.find_one({field_type: ObjectId(field_type)})
        else:
            return Booking.collection.find_one({field_type: field_value})
            
    @staticmethod
    def update(booking_id, data, type):
        booking = Booking.collection.find_one({"_id": ObjectId(booking_id)})
        if not booking:
            raise ValueError("Booking not found")

        if type == "cancel" and data.user_id:
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
            if booking.get("admin_id") != ObjectId(data.admin_id):
                raise ValueError("Need to be an admin to check in users")
            
            if booking.get("password") != data.password:
                raise ValueError("Invalid password")
            
            if data.get("booking_type") == "Equipment":
                equipment_id = ObjectId(data["infrastructure_id"])
                equipment = Equipment.get_one("_id", equipment_id)

                if not equipment or equipment["quantity"] < 1:
                    raise ValueError("Equipment not available")

                data["quantity"] = equipment["quantity"] + 1
                Equipment.update(equipment_id, data, {"$inc": {"quantity": 1}})
                
            booking = Booking.collection.find_one_and_update(
                {"_id": ObjectId(booking_id)},
                {"$set": {"expired": True, "waitlist": {}}},  # Clear waitlist
                return_document=True
            )
            return booking
        
        elif type == "penalty":
            if booking.get("admin_id") != ObjectId(data.admin_id):
                raise ValueError("Need to be an admin to add penalty to users")
            
            if not data.get("penalty_reason"):
                raise ValueError("Penalty reason is required")
            
            penalized_user_id = booking.get("user_id")
            if not penalized_user_id:
                raise ValueError("No user associated with this booking")
            
            # Calculate expiry time (24 hours from now)
            expires_at = datetime.utcnow() + timedelta(hours=24)
            
            penalty_data = {
                "booking_id": ObjectId(booking_id),
                "reason": data["penalty_reason"],
                "issued_by": ObjectId(data.admin_id),
                "expires_at": expires_at,
                "is_active": True
            }
            
            user_update = User.update(penalized_user_id, penalty_data, {"$push": {"penalties": penalty_data}})
            
            if user_update.modified_count == 0:
                raise ValueError("Failed to add penalty to user")
            
            penalty_invoice = {
                "message": "Penalty successfully added to user",
                "penalty": {
                    **penalty_data,
                    "booking_id": str(penalty_data["booking_id"]),
                    "issued_by": str(penalty_data["issued_by"]),
                    "expires_at": expires_at.isoformat()
                }
            }
            
            return penalty_invoice

        elif type == "validate":
            if booking.get("admin_id") != ObjectId(data.admin_id):
                raise ValueError("Need to be an admin to validate bookings")
            
            if data.get("booking_type") == "Equipment":
                equipment_id = ObjectId(data["infrastructure_id"])
                equipment = Equipment.get_one("_id", equipment_id)

                if not equipment or equipment["quantity"] < 1:
                    raise ValueError("Equipment not available")

                data["quantity"] = equipment["quantity"] + 1
                Equipment.update(equipment_id, data, {"$inc": {"quantity": -1}})

            booking = Booking.collection.find_one_and_update(
                {"_id": ObjectId(booking_id)},
                {"$set": {"validated": True, "password": generatePassword()}},
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
                {"$set": {f"waitlist.{len(waitlist)}": ObjectId(data.user_id)}},
                return_document=True
            )
            return booking

        raise ValueError("Invalid operation type")
                
    @staticmethod
    def delete(booking_id):
        return Booking.collection.delete_one({"_id": ObjectId(booking_id)})
