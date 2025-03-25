import jwt
from django.http import JsonResponse
from django.conf import settings
from .models import Equipment
from .serializers import EquipmentSerializer
import json

def create_and_update(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            serializer = EquipmentSerializer(data=data)
            if(serializer.is_valid):
                equipment = Equipment.create(serializer.validated_data)
                return JsonResponse({"equipment": equipment}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            serializer = EquipmentSerializer(data=data)
            if(serializer.is_valid):
                equipment = Equipment.update(data._id, serializer.validated_data)
                return JsonResponse({"equipment": equipment}, status=200)
             
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
  