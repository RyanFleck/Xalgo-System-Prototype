import os

from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import View
from rest_framework.response import Response
from rest_framework.views import APIView


class XalgoRMView(View, LoginRequiredMixin):
    """Serves the compiled frontend entry point (only works if you have run
    `yarn build`)."""

    login_url = "/accounts/login/"
    index_file_path = os.path.join(settings.RM_REACT_APP_DIR, "build", "index.html")
    redirect_field_name = "next"

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        """Redirects users to the login page if they are not authenticated."""
        if not request.user.is_authenticated:
            return self.handle_no_permission()

        try:

            with open(self.index_file_path) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            raise Exception(
                "The production build of this react app could not be found."
            )


rm_view = XalgoRMView.as_view()


class FetchAccessToken(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({})
        else:
            token = get_token(request)
            return Response({"token": str(token)})


token_view = FetchAccessToken.as_view()
