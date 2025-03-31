from django.urls import path
from .views import GetCSRFToken, LoginView, RegisterView

urlpatterns = [
    path("csrf/", GetCSRFToken.as_view(), name="csrf-token"),
    path("login/", LoginView.as_view(), name="login-user"),
    path("register/", RegisterView.as_view(), name="register-user"),
]