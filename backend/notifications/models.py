from django.conf import settings
from pymongo import MongoClient
from bson import ObjectId

# Connect to MongoDB
client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]

class Notification:
    collection = db["notifications"]
    
    @staticmethod
    def get_notifications(user_id):
        """Fetch all notifications for a given user."""
        notifications = Notification.collection.find({"user_id": ObjectId(user_id)})
        return list(notifications)

    @staticmethod
    def update_seen(user_id):
        """Mark all notifications as read and return updated notifications."""
        Notification.collection.update_many(
            {"user_id": ObjectId(user_id)},
            {"$set": {"read": True}}
        )
        return list(Notification.collection.find({"user_id": ObjectId(user_id)}))

    @staticmethod
    def create_notification(user_id, text):
        """Create a new notification."""
        notification = {
            "user_id": ObjectId(user_id),
            "text": text,
            "read": False
        }
        result = Notification.collection.insert_one(notification)
        return str(result.inserted_id)  # Return inserted notification ID
