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
        return Booking.collection.find_one({"_id": booking.inserted_id})

    @staticmethod
    def get_all():
        return list(Booking.collection.find({}, {"_id": 0}))

    @staticmethod
    def get_one(user_id):
        return Booking.collection.find_one({"id": user_id}, {"_id": 0})

    @staticmethod
    def update(booking_id, data):
        bookking = bookings_collection.find_one_and_update(
            {"_id": ObjectId(booking_id)},
            {"$set": data},
            return_document=True
        )
        return booking

    @staticmethod
    def delete(booking_id):
        """Delete a booking"""
        return bookings_collection.delete_one({"_id": ObjectId(booking_id)})
