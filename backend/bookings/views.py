from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from bson import ObjectId
from .models import Booking
from .serializers import BookingSerializer

class BookingView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            get_by = request.query_params.get('getBy')
            get_all = request.query_params.get('getAll', 'false').lower() == 'true'
            
            if get_by == 'user_id' or get_by == "admin_id" or get_by == "infrastructure_id":
                value = request.query_params.get('value')
                if not value:
                    return Response(
                        {"error": "user_id value is required"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if get_all:
                    bookings = Booking.get_all_by_constraint(get_by, ObjectId(value))
                else:
                    booking = Booking.get_one(get_by, ObjectId(value))
                    bookings = [booking] if booking else []
                
            else:
                bookings = Booking.get_all()
            
            # Convert ObjectId to string for JSON serialization
            result = []
            for booking in bookings:
                if booking:  # Skip None values
                    booking['_id'] = str(booking['_id'])
                    booking['user_id'] = str(booking['user_id'])
                    booking['admin_id'] = str(booking['admin_id'])
                    booking['infrastructure_id'] = str(booking['infrastructure_id'])
                    if 'waitlist' in booking and isinstance(booking['waitlist'], dict):
                        for key in booking['waitlist']:
                            if isinstance(booking['waitlist'][key], ObjectId):
                                booking['waitlist'][key] = str(booking['waitlist'][key])
                                
                    result.append(booking)
            
            return Response({"message": "Successfully retrieved all data!", "bookings": result}, status=status.HTTP_200_OK)
        
        except ValueError or Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            serializer = BookingSerializer(data=request.data)
            if serializer.is_valid():
                booking = Booking.create(serializer.validated_data)
                booking['_id'] = str(booking['_id'])
                booking['user_id'] = str(booking['user_id'])
                booking['admin_id'] = str(booking['admin_id'])
                booking['infrastructure_id'] = str(booking['infrastructure_id'])
                if 'waitlist' in booking and isinstance(booking['waitlist'], dict):
                    for key in booking['waitlist']:
                        if isinstance(booking['waitlist'][key], ObjectId):
                            booking['waitlist'][key] = str(booking['waitlist'][key])
                            
                return Response(
                    {"message": "Booking created", "bookings": booking},
                    status=status.HTTP_201_CREATED
                )
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        except ValueError or NameError or Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request):
        try:
            action_type = request.data.get('type')
            booking_id = request.data.get('_id')
            updated_booking = Booking.update(
                booking_id=booking_id,
                data=request.data,
                type=action_type
            )
            updated_booking['_id'] = str(updated_booking['_id'])
            updated_booking['user_id'] = str(updated_booking['user_id'])
            updated_booking['admin_id'] = str(updated_booking['admin_id'])
            updated_booking['infrastructure_id'] = str(updated_booking['infrastructure_id'])
            if 'waitlist' in updated_booking and isinstance(updated_booking['waitlist'], dict):
                for key in updated_booking['waitlist']:
                    if isinstance(updated_booking['waitlist'][key], ObjectId):
                        updated_booking['waitlist'][key] = str(updated_booking['waitlist'][key]) 
                            
            return Response({"message": "Updated successfully", "booking": updated_booking}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        try:
            booking_id = request.data.get('_id')

            if Booking.delete(booking_id):
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except ValueError or NameError or Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)