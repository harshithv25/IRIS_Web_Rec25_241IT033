from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.permissions import AllowAny
from bson import ObjectId

class NotificationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Fetch notifications for a specific user."""
        try:
            user_id = request.query_params.get('user_id')

            notifications = Notification.get_notifications(user_id)
            for notification in notifications:
                notification["_id"] = str(notification["_id"])  # Convert ObjectId to string
                notification["user_id"] = str(notification["user_id"])

            return Response({"message": "Successfull retireved data", "notifications": notifications}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        """Create a new notification."""
        serializer = NotificationSerializer(data=request.data)

        if serializer.is_valid():
            user_id = serializer.validated_data["user_id"]
            text = serializer.validated_data["text"]

            try:
                notification_id = Notification.create_notification(user_id, text)
                return Response({"message": "Notification created", "notification_id": str(notification_id)}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        user_id = request.query_params.get('user_id')
        try:
            updated_notifications = Notification.update_seen(user_id)
            for notification in updated_notifications:
                notification["_id"] = str(notification["_id"])  # Convert ObjectId to string
                notification["user_id"] = str(notification["user_id"]) 

                
            return Response(
                {"message": "notifications marked as read", "notifications": updated_notifications},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                            
