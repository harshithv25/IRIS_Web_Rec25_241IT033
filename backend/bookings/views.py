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
        get_by = request.query_params.get('getBy')
        get_all = request.query_params.get('getAll', 'false').lower() == 'true'
        
        if get_by == 'user_id':
            user_id = request.query_params.get('value')
            if not user_id:
                return Response(
                    {"error": "user_id value is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if get_all:
                bookings = Booking.get_all_by_constraint("user_id", ObjectId(user_id))
            else:
                booking = Booking.get_one("user_id", ObjectId(user_id))
                bookings = [booking] if booking else []
            
        elif get_by == 'admin_id':
            admin_id = request.query_params.get('value')
            if not admin_id:
                return Response(
                    {"error": "admin_id value is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if get_all:
                bookings = Booking.get_all_by_constraint("admin_id", ObjectId(admin_id))
            else:
                booking = Booking.get_one("admin_id", ObjectId(admin_id))
                bookings = [booking] if booking else []
            
        else:
            bookings = Booking.get_all()
        
        # Convert ObjectId to string for JSON serialization
        result = []
        for booking in bookings:
            if booking:  # Skip None values
                booking['_id'] = str(booking['_id'])
                result.append(booking)
        
        return Response({"message": "Successfully retrieved all data!", "bookings": result}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            booking = Booking.create(serializer.validated_data)
            booking['_id'] = str(booking['_id'])
            return Response(
                {"message": "Booking created", "bookings": booking},
                status=status.HTTP_201_CREATED
            )
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        try:
            action_type = request.data.get('type')
            booking_id = request.data.get('_id')
            updated_booking = Booking.update(
                booking_id=booking_id,
                data=request.data,
                type=action_type
            )
            updated_booking['_id'] = str(updated_booking['_id'])
            return Response({"message": "Updated successfully", "booking": updated_booking}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        booking_id = request.data.get('_id')

        if Booking.delete(booking_id):
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)