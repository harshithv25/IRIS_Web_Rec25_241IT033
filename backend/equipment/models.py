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
        return Equipment.get_one(equipment.inserted_id)

    @staticmethod
    def get_all():
        return list(Equipment.collection.find({}))
    
    @staticmethod
    def get_all_by_constraint(field_name, field_type):
        return list(Equipment.collection.find({field_type: field_name}))

    @staticmethod
    def get_one(equipment_id):
        return Equipment.collection.find_one({"_id": ObjectId(equipment_id)})

    @staticmethod
    def update(equipment_id, data, query):
        return Equipment.collection.find_one_and_update(
            {"_id": ObjectId(equipment_id)}, 
            query, 
            return_document=ReturnDocument.AFTER
        )

    @staticmethod
    def delete(equipment_id):
        return Equipment.collection.delete_one({"_id": ObjectId(equipment_id)})
