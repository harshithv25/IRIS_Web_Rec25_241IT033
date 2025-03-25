# from django.urls import path
# from .views import register, login, get_csrf_token

# urlpatterns = [
#     path("auth/login/", login, name="login-user"),
#     path("auth/register/", register, name="register-user"),
#     path("csrf/", get_csrf_token, name="csrf-token"),
# ]

from django.urls import path
from .views import GetCSRFToken, LoginView, RegisterView

urlpatterns = [
    path("csrf/", GetCSRFToken.as_view(), name="csrf-token"),
    path("auth/login/", LoginView.as_view(), name="login-user"),
    path("auth/register/", RegisterView.as_view(), name="register-user"),
]