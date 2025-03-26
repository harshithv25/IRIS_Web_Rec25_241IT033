from django.conf import settings
from pymongo import MongoClient       
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import check_password
from django.conf import settings
from .models import User
from .serializers import UserSerializer
import jwt
import datetime

client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]

collection = db["users"]

class GetCSRFToken(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from django.middleware.csrf import get_token
        return Response({'csrfToken': get_token(request)})

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")

            if not email or not password:
                return Response(
                    {"error": "Email and password are required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.get_one("email", email)
            
            
            if not user:
                return Response(
                    {"error": "Email does not exist in our records."},
                    status=status.HTTP_404_NOT_FOUND,
                )
                
            if not check_password(password, user["password"]):
                return Response(
                    {"error": "Invalid password."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            user["_id"] = str(user["_id"])
            token_payload = {
                "_id": str(user["_id"]),
                "email": user["email"],
                "name": user["name"],
                "branch": user["branch"],
                "roll_number": user["roll_number"],
                "role": user["role"],
                "exp": datetime.datetime.now() + datetime.timedelta(days=7),
                "iat": datetime.datetime.now(),
            }
            token = jwt.encode(token_payload, settings.SECRET_KEY, algorithm="HS256")
            
            return Response(
                {"token": token, "user": user},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": "An unexpected error occurred. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            
            if not serializer.is_valid():
                return Response(
                    {"error": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            email = User.get_one("email", request.data.get("email"))
            
            if email:
                return Response(
                    {"error": "Email already exists."},
                    status=status.HTTP_409_CONFLICT,
                )

            user = User.create(serializer.validated_data)
            
            return Response(
                {"message": "User created successfully!", "uid": str(user["_id"])},
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"error": "An unexpected error occurred. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )