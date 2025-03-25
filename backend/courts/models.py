from bson import ObjectId
from django.conf import settings

from pymongo import MongoClient

client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]

class Court:
    collection = db["courts"]
    
    @staticmethod
    def create(data):
        court = Court.collection.insert_one(court)
        return Court.collection.find_one({"_id": court.inserted_id})

    @staticmethod
    def get_all():
        return list(Court.collection.find({}, {"_id": 0}))

    @staticmethod
    def get_one(court_id):
        return Court.collection.find_one({"_id": ObjectId(court_id)}, {"_id": 0})

    @staticmethod
    def update(court_id, data):
        court = courts_collection.find_one_and_update(
            {"_id": ObjectId(court_id)},
            {"$set": data},
            return_document=True
        )
        return court

    @staticmethod
    def delete(court_id):
        return Court.collection.delete_one({"_id": ObjectId(court_id)})
