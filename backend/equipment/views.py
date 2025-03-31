from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from .models import Equipment
from .serializers import EquipmentSerializer
from rest_framework.permissions import AllowAny

class EquipmentView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            get_by = request.query_params.get('getBy')
            value = request.query_params.get('value')
            
            if (get_by == "admin_id" or get_by == "_id" or get_by=="category" or get_by=="condition") and value:
                try:
                    if get_by == '_id':
                        equipment = Equipment.get_one(value)
                        equipment_list = [equipment] if equipment else []
                    else:
                        equipment_list = Equipment.get_all_by_constraint(get_by, value)
                except:
                    return Response(
                        {"error": "Invalid query parameters"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                equipment_list = Equipment.get_all()
            
            # Convert ObjectId to string
            result = []
            for item in equipment_list:
                if item:
                    item['_id'] = str(item['_id'])
                    result.append(item)
            
            return Response({"message": "Successfully retrieved all data!", "equipment": result}, status=status.HTTP_200_OK)
        
        except ValueError or NameError or Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            serializer = EquipmentSerializer(data=request.data)
            if serializer.is_valid():
                equipment = Equipment.create(serializer.validated_data)
                equipment['_id'] = str(equipment['_id'])
                return Response(
                    {"message": "Equipment added", "equipment": equipment},
                    status=status.HTTP_201_CREATED
                )
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        except ValueError or NameError or Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            equipment_id = request.data.get("_id")
            serializer = EquipmentSerializer(data=request.data)
            if serializer.is_valid():
                updated_equipment = Equipment.update(equipment_id, serializer.validated_data, {"$set": serializer.validated_data})
                updated_equipment['_id'] = str(updated_equipment['_id'])
                return Response({"message": "Updated Eqipment successfully!", "equipment": updated_equipment}, status=status.HTTP_200_OK)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError or NameError or Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            equipment_id = request.data.get("equipment_id")
            
            if Equipment.delete(equipment_id):
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "Equipment not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except ValueError or NameError or Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)