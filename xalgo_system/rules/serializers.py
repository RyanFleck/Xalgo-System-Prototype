from rest_framework.serializers import ModelSerializer

from xalgo_system.rules.models import Rule, RuleContent


class RuleSerializer(ModelSerializer):
    class Meta:
        model = Rule
        fields = "__all__"
        read_only_fields = ["rule_creator", "forked_from", "editors", "primary_content"]


class RuleContentSerializer(ModelSerializer):
    class Meta:
        model = RuleContent
        fields = "__all__"
        read_only_fields = ["parent_rule"]
