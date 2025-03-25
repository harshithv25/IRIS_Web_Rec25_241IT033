from django.conf import settings
from pymongo import ReturnDocument
from bson import ObjectId

from pymongo import MongoClient

client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]

class Equipment:
    collection = db["equipment"]

    @staticmethod
    def create(data):
        equipment = Equipment.collection.insert_one(data) 
        return Equipment.collection.find_one({"_id": equipment.inserted_id})

    @staticmethod
    def get_all():
        return list(Equipment.collection.find({}, {"_id": 0}))

    @staticmethod
    def get_one(equipment_id):
        return Equipment.collection.find_one({"id": equipment_id}, {"_id": 0})

    @staticmethod
    def update(equipment_id, data):
        return Equipment.collection.find_one_and_update(
            {"_id": ObjectId(equipment_id)}, 
            {"$set": data}, 
            return_document=ReturnDocument.AFTER
        )

    @staticmethod
    def delete(equipment_id):
        return Equipment.collection.delete_one({"_id": ObjectId(equipment_id)})
