from django.urls import path

from xalgo_system.react_apps.views import XalgoRMView

app_name = "camera"
urlpatterns = [
    #    path("", view=CameraView.as_view(), name="update"),
    path("rm", view=XalgoRMView.as_view(), name="xalgo-rm")
]
