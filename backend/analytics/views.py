from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from .models import Analytics
from .serializers import AnalyticsSerializer
from rest_framework.permissions import AllowAny

class AnalyticsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            admin_id = request.query_params.get('admin_id')

            if not admin_id:
                analytics = Analytics.get_all()
                result = [{**doc, "_id": str(doc["_id"]), "admin_id": str(doc["admin_id"])} for doc in analytics]
                return Response({"message": "Successfully retrieved analytics", "analytics": result}, status=status.HTTP_200_OK)

            analytics = Analytics.get_by_admin(admin_id)
            if analytics:
                analytics["_id"] = str(analytics["_id"])
                analytics["admin_id"] = str(analytics["admin_id"])
                return Response({"message": "Successfully retrieved analytics", "analytics": analytics}, status=status.HTTP_200_OK)
            return Response({"error": "Analytics data not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            serializer = AnalyticsSerializer(data=request.data)
            if serializer.is_valid():
                analytics = Analytics.create(serializer.validated_data)
                analytics["_id"] = str(analytics["_id"])
                analytics["admin_id"] = str(analytics["admin_id"])
                return Response({"message": "Analytics data created", "analytics": analytics}, status=status.HTTP_201_CREATED)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            admin_id = request.data.get("admin_id")
            if not admin_id:
                return Response({"error": "admin_id is required"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = AnalyticsSerializer(data=request.data)
            if serializer.is_valid():
                updated_analytics = Analytics.update(admin_id, serializer.validated_data)
                if updated_analytics:
                    updated_analytics["_id"] = str(updated_analytics["_id"])
                    updated_analytics["admin_id"] = str(updated_analytics["admin_id"])
                    return Response({"message": "Successfully updated analytics", "analytics": updated_analytics}, status=status.HTTP_200_OK)
                return Response({"error": "Analytics data not found"}, status=status.HTTP_404_NOT_FOUND)

            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            admin_id = request.data.get("admin_id")
            if not admin_id:
                return Response({"error": "admin_id is required"}, status=status.HTTP_400_BAD_REQUEST)

            if Analytics.delete(admin_id).deleted_count > 0:
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "Analytics data not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
