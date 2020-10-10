import os

from django.conf import settings
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import View


class XalgoRMView(View):
    """Serves the compiled frontend entry point (only works if you have run
    `yarn build`)."""

    index_file_path = os.path.join(settings.RM_REACT_APP_DIR, "build", "index.html")

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        try:
            with open(self.index_file_path) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            raise Exception(
                "The production build of this react app could not be found."
            )
