from bson import ObjectId
from django.conf import settings
from pymongo import MongoClient

client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]

class Analytics:
    collection = db["analytics"]

    @staticmethod
    def create(data):
        analytics = Analytics.collection.insert_one(data)
        return Analytics.get_one(ObjectId(analytics.inserted_id))

    @staticmethod
    def get_all():
        return list(Analytics.collection.find({}))
    
    def get_one(analytics_id):
        return Analytics.collection.find_one({"_id": ObjectId(analytics_id)})

    @staticmethod
    def get_by_admin(admin_id):
        return Analytics.collection.find_one({"admin_id": ObjectId(admin_id)})

    @staticmethod
    def update(admin_id, data):
        analytics = Analytics.collection.find_one_and_update(
            {"admin_id": admin_id},
            data,
            return_document=True
        )
        return analytics

    @staticmethod
    def delete(admin_id):
        return Analytics.collection.delete_one({"admin_id": ObjectId(admin_id)})
