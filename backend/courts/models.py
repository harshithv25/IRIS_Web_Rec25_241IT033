from bson import ObjectId
from django.conf import settings

from pymongo import MongoClient

client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]

class Court:
    collection = db["courts"]
    
    @staticmethod
    def create(data):
        court = Court.collection.insert_one(data)
        return Court.get_one(court.inserted_id)

    @staticmethod
    def get_all():
        return list(Court.collection.find({}))
    
    @staticmethod
    def get_all_by_constraint(field_type, field_value):
        return list(Court.collection.find({field_type: field_value}))

    @staticmethod
    def get_one(court_id):
        return Court.collection.find_one({"_id": court_id})

    @staticmethod
    def update(court_id, data):
        court = Court.collection.find_one_and_update(
            {"_id": ObjectId(court_id)},
            {"$set": data},
            return_document=True
        )
        return court

    @staticmethod
    def delete(court_id):
        return Court.collection.delete_one({"_id": ObjectId(court_id)})
