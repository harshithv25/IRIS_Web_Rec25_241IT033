from users.models import User
from equipment.models import Equipment
from courts.models import Court
from analytics.models import Analytics
from notifications.models import Notification
from bson import ObjectId
from django.conf import settings
from datetime import datetime, timedelta
from dateutil.parser import isoparse
from pymongo import MongoClient
import math, random
from .utils.email import send_booking_confirmation, notify_admin, notify_waitlist_promotion, notify_admin_cancellation
from .tasks import send_reminder_email

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
        today = datetime.utcnow().date()
        tomorrow = today + timedelta(days=1)
        today_start = datetime.combine(today, datetime.min.time()).isoformat() + "Z"
        tomorrow_end = datetime.combine(tomorrow, datetime.max.time()).isoformat() + "Z"
        booking_time = isoparse(data["start_time"])  # Convert ISO string to datetime
        reminder_time = booking_time - timedelta(minutes=30)  # Schedule 30 minutes before

        # Convert UTC now to timezone-aware
        now = datetime.utcnow().replace(tzinfo=reminder_time.tzinfo)

        # Calculate delay in seconds
        delay_seconds = (reminder_time - now).total_seconds()  
        
        user = User.get_one("_id", data["user_id"])
        admin = User.get_one("_id", data["admin_id"])
        
        existing_bookings = Booking.get_all_by_constraint("user_id", ObjectId(data["user_id"]))
        if data["booking_type"] == "Equipment": 
            equipment = Equipment.get_one(data["infrastructure_id"])
            if not equipment["available"] or equipment["quantity"] - 1  < 1:
                raise ValueError("Equipment is unavailable")
        else:
            court = Court.get_one(data["infrastructure_id"])
            if not court["available"]:
                raise ValueError("Court is unavailable")
        
        for booking in existing_bookings:
            start_time_str = booking["start_time"]
            start_time = isoparse(start_time_str)  # Convert to datetime

            if (today_start <= start_time.isoformat() <= tomorrow_end) and (booking["expired"] == False):
                raise ValueError("You can only make one booking per day")

        data = {**data, "waitlist": {}}
        data["admin_id"] = ObjectId(data["admin_id"])
        data["infrastructure_id"] = ObjectId(data["infrastructure_id"])
        
        # === Update Analytics ===
        admin_id = data["admin_id"]
        infrastructure_name = data["name"]  # Convert ObjectId to string

        analytics = Analytics.get_by_admin(admin_id)

        if analytics:
            # if infrastructure exists in `x`, increment the corresponding `y` value
            if infrastructure_name in analytics["bookingCount"]["x"]:
                index = analytics["bookingCount"]["x"].index(infrastructure_name)
                analytics["bookingCount"]["y"][index] += 1

                Analytics.update(analytics["_id"], {
                            "$inc": {
                            f"bookingCount.y.{infrastructure_name}": 1 
                        }
                    })  

            else:
                # add new infrastructure entry
                analytics["bookingCount"]["x"].append(infrastructure_name)
                analytics["bookingCount"]["y"].append(1)
                Analytics.update(analytics["_id"], {
                    "$push": {
                        "bookingCount.x": infrastructure_name,  # Append new infra name
                        "bookingCount.y": 1  # Start with count 1
                    }
                })  # save
        else:
            # if no analytics entry exist, create new one
            new_analytics_data = {
                "admin_id": admin_id,
                "bookingCount": {
                    "x": [infrastructure_name],
                    "y": [1]
                }
            }
            Analytics.create(new_analytics_data)
        
        booking = Booking.collection.insert_one(data)
        
    # Schedule Celery task
        msg = str(booking.inserted_id)
        # Ensure the delay is positive (avoid scheduling past times)
        if delay_seconds > 0:
            send_reminder_email.apply_async(args=(msg,), countdown=int(delay_seconds))    
            
        notification = Notification.create_notification(data["admin_id"], f"A new {data["booking_type"]} was booked. Log in to validate the booking")
        notify_admin(admin["email"], data)
        return Booking.get_one("_id", ObjectId(booking.inserted_id))

    @staticmethod
    def get_all():
        return list(Booking.collection.find({}))

    @staticmethod
    def get_all_by_constraint(field_type, field_value):
        return list(Booking.collection.find({
            "$or": [
                {field_type: field_value},  # Direct match (user_id, admin_id, etc.)
                {"waitlist": {"$elemMatch": {"$eq": field_value}}},  # For array waitlists
                # For object waitlists with numeric keys:
                {"$expr": {"$in": [field_value, {"$map": {
                    "input": {"$objectToArray": "$waitlist"},
                    "in": "$$this.v"
                }}]}}
            ]
        }))


    @staticmethod
    def get_one(field_type, field_value):
        if(field_type == "_id"):
            return Booking.collection.find_one({field_type: field_value})
        else:
            return Booking.collection.find_one({field_type: field_value})
            
    @staticmethod
    def update(booking_id, data, type):
        booking = Booking.collection.find_one({"_id": ObjectId(booking_id)})
        if not booking:
            raise ValueError("Booking not found")

        if type == "cancel" and data["user_id"]:
            # Promote next user from waitlist
            waitlist = booking.get("waitlist", {})
            admin_email = User.get_one("_id", booking["admin_id"])["email"]
            notify_admin_cancellation(admin_email, booking)
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
                    notification = Notification.create_notification(next_user_id, f"Booking confirmed iD: {str(booking_id)} (the user infront of you cancelled!)")
                    next_user_email = User.get_one("_id", next_user_id)["email"]
                    notify_waitlist_promotion(next_user_email, booking)
                    return booking
            
            # If no waitlist, just update with cancel data
            
            updated_data = {
                "expired": True
            }
            
            booking = Booking.collection.find_one_and_update(
                {"_id": ObjectId(booking_id)},
                {"$set": updated_data},
                return_document=True
            )
            notification = Notification.create_notification(data["user_id"], f"Booking cancelled iD: {str(booking_id)}")
            return booking

        elif type == "check-in":
            # Verify admin and clear waitlist
            if booking["admin_id"] != ObjectId(data["admin_id"]):
                raise ValueError("Need to be an admin to check in users")
            
            if booking["password"] != data["password"]:
                raise ValueError("Invalid password")
            
            if data["booking_type"] == "Equipment":
                equipment_id = ObjectId(data["infrastructure_id"])
                equipment = Equipment.get_one(equipment_id)

                if not equipment or equipment["quantity"] < 1:
                    raise ValueError("Equipment not available")

                data["quantity"] = equipment["quantity"] + 1
                Equipment.update(equipment_id, data, {"$inc": {"quantity": 1}})
                
            booking = Booking.collection.find_one_and_update(
                {"_id": ObjectId(booking_id)},
                {"$set": {"expired": True, "waitlist": {}}},  # Clear waitlist
                return_document=True
            )
            notification = Notification.create_notification(booking["user_id"], f"successfully checked in: {str(booking_id)}")
            return booking
        
        elif type == "penalty":
            if booking["admin_id"] != ObjectId(data.admin_id):
                raise ValueError("Need to be an admin to add penalty to users")
            
            if not data.get("penalty_reason"):
                raise ValueError("Penalty reason is required")
            
            penalized_user_id = booking["user_id"]
            if not penalized_user_id:
                raise ValueError("No user associated with this booking")
            
            # Calculate expiry time (24 hours from now)
            expires_at = datetime.utcnow() + timedelta(hours=24)
            
            penalty_data = {
                "booking_id": ObjectId(booking_id),
                "reason": data["penalty_reason"],
                "issued_by": ObjectId(data.admin_id),
                "expires_at": expires_at.isoformat(),
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
            
            notification = Notification.create_notification(booking["user_id"], f"You receive a penalty by {str(data.admin_id)}")
            
            return penalty_invoice

        elif type == "validate":
            if booking["admin_id"] != ObjectId(data["admin_id"]):
                raise ValueError("Need to be an admin to validate bookings")
            
            if data.get("booking_type") == "Equipment":
                equipment_id = ObjectId(data["infrastructure_id"])
                equipment = Equipment.get_one(equipment_id)

                if not equipment or equipment["quantity"] < 1:
                    raise ValueError("Equipment not available")

                data["quantity"] = equipment["quantity"] + 1
                Equipment.update(equipment_id, data, {"$inc": {"quantity": -1}})

            booking = Booking.collection.find_one_and_update(
                {"_id": ObjectId(booking_id)},
                {"$set": {"validated": True, "password": generatePassword()}},
                return_document=True
                
            )
            user_email = User.get_one("_id", booking["user_id"])["email"]
            send_booking_confirmation(user_email, booking)
            notification = Notification.create_notification(booking["user_id"], f"Your booking {booking["name"]} has just been validated")
            
            return booking

        elif type == "deny":
            if "reason" not in data["cancel_status"]:
                raise ValueError("Reason required for denial")
                
            booking = Booking.collection.find_one_and_update(
                {"_id": ObjectId(booking_id)},
                {"$set": {
                    "cancel_status": {
                        "cancelled": True,
                        "reason": data["cancel_status"]["reason"]
                    },
                    "expired": True
                }},
                return_document=True
            )
            notification = Notification.create_notification(booking["user_id"], f"Your booking {booking["name"]} has has been cancelled")
            
            return booking

        elif type == "waitlist":
            today = datetime.utcnow().date()
            tomorrow = today + timedelta(days=1)
            today_start = datetime.combine(today, datetime.min.time()).isoformat() + "Z"
            tomorrow_end = datetime.combine(tomorrow, datetime.max.time()).isoformat() + "Z"
            
            existing_bookings = Booking.get_all_by_constraint("user_id", ObjectId(data.get("user_id")))
            
            for booking in existing_bookings:
                start_time_str = booking["start_time"]
                start_time = isoparse(start_time_str)  # Convert to datetime

                if today_start <= start_time.isoformat() <= tomorrow_end:
                    raise ValueError("You can only make one booking per day")
            
            waitlist = booking.get("waitlist", {})
            if len(waitlist) >= 4:  # Assuming max 4 waitlist spots
                raise IndexError("Waitlist is full")
                
            booking = Booking.collection.find_one_and_update(
                {"_id": ObjectId(booking_id)},
                {"$set": {f"waitlist.{len(waitlist)}": ObjectId(data.get("user_id"))}},
                return_document=True
            )
            notification = Notification.create_notification(data["user_id"], f"Joined the waiting list of the booking {booking["name"]}")
            
            return booking

        raise ValueError("Invalid operation type")
                
    @staticmethod
    def delete(booking_id):
        return Booking.collection.delete_one({"_id": ObjectId(booking_id)})
