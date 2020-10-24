from typing import Any, Dict

from django.views.generic import TemplateView
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from xalgo_system.rules.models import Rule, RuleContent
from xalgo_system.rules.serializers import RuleContentSerializer, RuleSerializer


class RuleViewSet(ModelViewSet):

    serializer_class = RuleSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Rule.objects.filter(rule_creator=self.request.user)

    def perform_create(self, serializer):
        rule = serializer.save()

        # Add references to the rule creator.
        rule.rule_creator = self.request.user
        rule.editors.add(self.request.user)

        # Add the first rule body.
        first_content = RuleContent(parent_rule=rule)
        first_content.save()
        rule.primary_content = first_content

        rule.save()


class RuleContentViewSet(ModelViewSet):

    serializer_class = RuleContentSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RuleContent.objects.filter(parent_rule__rule_creator=self.request.user)

    def perform_create(self, serializer):
        serializer.save()


class SingleRuleView(TemplateView):
    """Displays the rule info and primary content of a single rule."""

    template_name = "pages/rule.html"

    def get_context_data(self, rule_id: str, **kwargs: Any) -> Dict[str, Any]:
        context = super(SingleRuleView, self).get_context_data()
        rule = Rule.objects.get(id=rule_id)
        context["rule"] = rule
        context["creator"] = rule.rule_creator
        context["content"] = rule.primary_content
        return context


single_rule_view = SingleRuleView.as_view()
