from django.conf import settings
from bson import ObjectId
from django.contrib.auth.hashers import make_password, check_password

from pymongo import MongoClient

client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]

class User:
    collection = db["users"]

    @staticmethod
    def create(data):        
        if "password" in data:
            data["password"] = make_password(data["password"])
        
        result = User.collection.insert_one(data)
        return User.get_one("_id", result.__inserted_id)
            
    @staticmethod
    def get_all():
        return list(User.collection.find({}, {"_id": 0}))

    @staticmethod
    def get_one(field_type, field_value):
        return User.collection.find_one({field_type: field_value})

    @staticmethod
    def update(user_id, data):
        if "password" in data:
            data["password"] = make_password(data["password"])  # Hash new password

        user = User.collection.find_one_and_update(
            {"_id": ObjectId(user_id)}, 
            {"$set": data}, 
            return_document=True
        )
        return user
    
    @staticmethod
    def delete(user_id):
        return User.collection.delete_one({"_id": ObjectId(user_id)})

    def __str__(self):
        return self.name