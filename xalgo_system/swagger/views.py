from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly

swagger_view = get_schema_view(
    openapi.Info(
        title="Xalgo System Swagger Autodocs",
        default_version="v1",
    ),
    public=True,
    authentication_classes=(
        TokenAuthentication,
        SessionAuthentication,
    ),
    permission_classes=(IsAuthenticatedOrReadOnly,),
)
