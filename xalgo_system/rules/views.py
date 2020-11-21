import json
from typing import Any, Dict

from django.http import JsonResponse
from django.views.generic import TemplateView
from rest_framework import mixins
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from xalgo_system.rules.models import Rule, RuleContent
from xalgo_system.rules.serializers import RuleContentSerializer, RuleSerializer


class RuleViewSet(ModelViewSet):

    serializer_class = RuleSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, JSONParser)

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


class RuleContentViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):

    serializer_class = RuleContentSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, JSONParser)

    def get_queryset(self):
        return RuleContent.objects.filter(parent_rule__rule_creator=self.request.user)

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

        # Update rule title if one is provided.
        self.update_parent_name_and_description(data, parent)
        data_enforced = self.enforce_uuids(data, inst, parent)

        # Return the updated data blob to be persisted to the db.
        updated = serializer.update(inst, data_enforced)
        return Response(serializer.to_representation(updated))

    @staticmethod
    def enforce_uuids(data: dict, inst: RuleContent, parent: Rule):
        body = data.get("body", {})
        metadata = body.get("metadata", {})
        rule = metadata.get("rule", {})

        uuid = body.get("uuid", None)
        stored_uuid = str(parent.id)
        content_uuid = rule.get("content_uuid", None)
        stored_conent_uuid = str(inst.id)

        if uuid != stored_uuid and uuid is not None:
            data["body"]["uuid"] = stored_uuid

        if content_uuid != stored_conent_uuid and content_uuid is not None:
            data["body"]["metadata"]["rule"]["content_uuid"] = stored_conent_uuid

        return data

    @staticmethod
    def update_parent_name_and_description(data: dict, parent: Rule):
        """If the name or description have changed, update the parent rule."""
        body = data.get("body", {})
        metadata = body.get("metadata", {})
        rule = metadata.get("rule", {})
        title = rule.get("title", None)
        description = rule.get("description", None)
        modified_parent = False

        if title and title != parent.name:
            modified_parent = True
            parent.name = title

        if description and description != parent.description:
            modified_parent = True
            parent.description = description

        # In the future, we'll need to check if this is the latest content version.
        if modified_parent:
            parent.save()


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


class SingleRuleJSONView(APIView):
    """Displays the rule info and primary content of a single rule."""

    def get(self, request, rule_id: str, *args, **kwargs) -> JsonResponse:
        rule = Rule.objects.get(id=rule_id)
        return JsonResponse(data=rule.primary_content.body)


single_rule_json_view = SingleRuleJSONView.as_view()
