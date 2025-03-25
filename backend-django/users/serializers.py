from rest_framework import serializers
import re

class UserSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    branch = serializers.CharField()
    roll_number = serializers.CharField()
    password = serializers.CharField()
    role = serializers.CharField()

    def validate_email(self, value):
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Invalid email format.")
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long.")
        return value
    
    
# import re
# from django.contrib.auth.hashers import make_password, check_password

# class UserSerializer:
#     errors = False
#     data = {}
#     validated_data={}
    
#     def __init__(self, data):
#         self.data = data
#         self.errors = {}
#         self.validated_data = {}

#     def is_valid(self):
#         required_fields = ["name", "email", "branch", "roll_number", "password" , "role"]
        
#         for field in required_fields:
#             if field not in self.data:
#                 self.errors[field] = f"{field} is required."

#         if "email" in self.data:
#             email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
#             if not re.match(email_regex, self.data["email"]):
#                 self.errors["email"] = "Invalid email format."

#         if "password" in self.data and len(self.data["password"]) < 6:
#             self.errors["password"] = "Password must be at least 6 characters long."

#         if self.errors:
#             return False

#         self.validated_data = {
#             "name": self.data["name"],
#             "email": self.data["email"],
#             "branch": self.data["branch"],
#             "password": make_password(self.data["password"]),  # Hash password before saving
#             "roll_number": self.data["roll_number"],
#             "role": self.data["role"]
#         }
#         return True