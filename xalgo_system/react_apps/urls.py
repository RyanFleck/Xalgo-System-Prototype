from django.urls import re_path

from xalgo_system.react_apps.views import XalgoRMView

app_name = "react_apps"
urlpatterns = [re_path("^rm/(?:.*)/?$", view=XalgoRMView.as_view(), name="xalgo-rm")]
