from rest_framework.serializers import ModelSerializer

from xalgo_system.rules.models import Rule


class RuleSerializer(ModelSerializer):
    class Meta:
        model = Rule
