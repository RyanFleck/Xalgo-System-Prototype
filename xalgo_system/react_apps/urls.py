from django.urls import path, re_path

from xalgo_system.react_apps.views import rm_view, token_view

app_name = "react_apps"

urlpatterns = [
    re_path("^rm/(?:.*)/?$", view=rm_view, name="xalgo-rm"),
    path("token/", view=token_view, name="rm-token"),
]
