from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

app_name = "jwt_auth"
urlpatterns = [
    path("token/obtain/", TokenObtainPairView.as_view(), name="token_create"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
