from django.urls import include, path
from rest_framework.routers import DefaultRouter

from xalgo_system.rules.views import RuleViewSet

app_name = "rules"

router = DefaultRouter()
router.register(r"rule", RuleViewSet, basename="rule")

urlpatterns = [
    path("", include(router.urls)),
]
