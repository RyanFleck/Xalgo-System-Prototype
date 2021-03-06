from django.urls import include, path
from rest_framework.routers import DefaultRouter

from xalgo_system.rules.views import (
    RuleContentViewSet,
    RuleViewSet,
    single_rule_json_view,
)

app_name = "rules"

router = DefaultRouter()
router.register(r"rule", RuleViewSet, basename="rule")
router.register(r"content", RuleContentViewSet, basename="content")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "json/<uuid:rule_id>/",
        single_rule_json_view,
        name="json",
    ),
]
