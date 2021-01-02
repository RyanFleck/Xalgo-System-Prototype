from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

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


@api_view()
@permission_classes([IsAuthenticatedOrReadOnly])
def awake(req=None):
    return Response({"success": "Service is awake!"})
