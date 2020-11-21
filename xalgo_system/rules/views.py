import json
from typing import Any, Dict

from django.views.generic import TemplateView
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
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

    def update(self, request, *args, **kwargs):

        # Get required parameters to update the model.
        pk = kwargs.pop("pk")
        inst = self.get_queryset().get(pk=pk)
        parent = getattr(inst, "parent_rule")
        partial = kwargs.pop("partial", False)

        # Get serializer and ensure incoming data is valid.
        serializer = self.serializer_class(inst, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Check incoming data and update parent rule if needed.
        print(f"Updating rule content for rule {pk}\nNew data:\n")
        print(data)

        body = data.get("body", dict)
        metadata = body.get("metadata", dict)
        rule = metadata.get("rule", dict)
        title = rule.get("title", None)
        description = rule.get("description", None)

        # Update rule title if one is provided.
        # In the future, we'll need to check if this is the latest content version.
        modified_parent = False

        if title and title != parent.name:
            modified_parent = True
            parent.name = title

        if description and description != parent.description:
            modified_parent = True
            parent.description = description

        if modified_parent:
            parent.save()

        # Return the updated data blob to be persisted to the db.
        updated = serializer.update(inst, data)
        return Response(serializer.to_representation(updated))


class SingleRuleView(TemplateView):
    """Displays the rule info and primary content of a single rule."""

    template_name = "pages/rule.html"

    def get_context_data(self, rule_id: str, **kwargs: Any) -> Dict[str, Any]:
        context = super(SingleRuleView, self).get_context_data()
        rule = Rule.objects.get(id=rule_id)
        context["rule"] = rule
        context["creator"] = rule.rule_creator
        context["content"] = json.dumps(rule.primary_content.body, indent=2)
        return context


single_rule_view = SingleRuleView.as_view()
