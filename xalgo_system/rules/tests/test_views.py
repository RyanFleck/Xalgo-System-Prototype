import pytest
from rest_framework.test import APIRequestFactory

from xalgo_system.rules.models import Rule, RuleContent
from xalgo_system.rules.views import (
    RuleContentViewSet,
    RuleViewSet,
    single_rule_json_view,
)
from xalgo_system.users.models import User

pytestmark = pytest.mark.django_db


class TestRuleViewSet:
    view_set = RuleViewSet

    def test_get_queryset(self, user):
        requests = APIRequestFactory()
        view = self.view_set()
        view.request = requests.get("/")
        view.request.user = user
        view.get_queryset()

    def test_perform_create(self, user):
        requests = APIRequestFactory()
        url = reversed("rules_rule_create")
        view = self.view_set.as_view({"post": "create"})
        data = {"name": "Test Rule", "description": "Some random description."}

        # A regular request should work.
        request = requests.post(url, data=data)
        request.user = user
        view.request = request
        res = view(request)
        assert res.status_code == 201  # Created

        # with pytest.raises(Exception):
        # A request without data should fail.
        request = requests.post(url, data={})
        request.user = user
        view = self.view_set.as_view({"post": "create"})
        view.request = request
        res = view(request)
        assert res.status_code == 400


class TestRuleContentViewSet:
    view_set = RuleContentViewSet

    def test_get_queryset(self, user):
        requests = APIRequestFactory()
        view = self.view_set()
        view.request = requests.get("/")
        view.request.user = user
        view.get_queryset()

    def test_update(self, user):

        # Create test content object.
        # TODO: Replace with a factory.
        rule = Rule(rule_creator=user)
        content = RuleContent(parent_rule=rule)
        rule.save()
        content.save()
        rule.primary_content = content
        rule.save()

        # Set up request.
        requests = APIRequestFactory()
        url = reversed("rules_content_update")
        view = self.view_set.as_view({"put": "update", "patch": "partial_update"})
        data = {"body": {"metadata": None}}

        # A regular request should work.
        request = requests.put(url, format="json")
        request.user = user
        view.request = request
        res = view(request, pk=str(rule.primary_content.id), data=data)
        assert res.status_code == 200


class TestSingleRuleJSONView:
    def test_get(self, user: User):
        # Create test content object.
        # TODO: Replace with a factory.
        rule = Rule(rule_creator=user)
        content = RuleContent(parent_rule=rule)
        rule.save()
        content.save()
        rule.primary_content = content
        rule.save()

        requests = APIRequestFactory()
        url = reversed("rules_json")

        # A regular request should work.
        request = requests.get(url)
        res = single_rule_json_view(request, rule_id=str(rule.id))
        assert res.status_code == 200
