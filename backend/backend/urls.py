from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("users/", include("users.urls")),  # User routes
    path("bookings/", include("bookings.urls")),  # Bookings routes
    path("courts/", include("courts.urls")),  # Courts routes
    path("equipment/", include("equipment.urls")),  # Equipment routes
]
