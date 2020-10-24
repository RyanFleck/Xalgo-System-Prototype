from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from xalgo_system.rules.models import Rule, RuleContent
from xalgo_system.rules.serializers import RuleSerializer


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
        first_content = RuleContent(parent_rule=rule, content=dict)
        first_content.save()
        rule.primary_content = first_content

        rule.save()


# class QueryRulesViewSet(Mo)
