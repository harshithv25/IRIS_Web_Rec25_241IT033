from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from .models import Court
from .serializers import CourtSerializer
from rest_framework.permissions import AllowAny
class CourtView(APIView):
    permission_classes = [AllowAny]
        
    def get(self, request):
        try:
            get_by = request.query_params.get('getBy')
            value = request.query_params.get('value')
            
            if (get_by == "admin_id" or get_by == "_id" or get_by=="category" or get_by=="condition") and value:
                try:
                    if get_by == '_id':
                        court = Court.get_one(value)
                        courts = [court] if court else []
                    else:
                        courts = Court.get_all_by_constraint(get_by, value)
                except:
                    return Response(
                        {"error": "Invalid query parameters"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                courts = Court.get_all()
            
            # Convert ObjectId to string
            result = []
            for court in courts:
                if court:
                    court['_id'] = str(court['_id'])
                    result.append(court)
            
            return Response({"message": "Successfully retrieved all data", "courts": result}, status=status.HTTP_200_OK)
        
        except ValueError or NameError or Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        try:
            serializer = CourtSerializer(data=request.data)
            if serializer.is_valid():
                court = Court.create(serializer.validated_data)
                court["_id"] = str(court["_id"])
                return Response(
                    {"message": "Court created", "courts": court},
                    status=status.HTTP_201_CREATED
                )
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        except ValueError or NameError or Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) 

    def put(self, request):
        try:
            court_id = request.data.get("_id")
            serializer = CourtSerializer(data=request.data)
            if serializer.is_valid():
                updated_court = Court.update(court_id, serializer.validated_data)
                updated_court['_id'] = str(updated_court['_id'])
                return Response({"message": "Successfully updated the court", "courts": updated_court}, status=status.HTTP_200_OK)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError or NameError or Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            court_id = request.data.get("_id")
            
            if Court.delete(court_id):
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "Court not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except ValueError or NameError or Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
