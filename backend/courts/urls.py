from django.urls import path
from .views import CourtView

urlpatterns = [
    path('', CourtView.as_view()),
]