from django.urls import path
from .views import EquipmentView

urlpatterns = [
    path('', EquipmentView.as_view()),
]