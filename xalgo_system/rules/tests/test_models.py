import pytest

from xalgo_system.rules.models import Rule, RuleContent

pytestmark = pytest.mark.django_db


class TestRule:
    def test_save(self):
        rule = Rule()
        rule.save()


class TestRuleContent:
    def test_save(self):
        # A parent rule must exist to save a chunk of content.
        rule = Rule()
        rule.save()

        # Save the content.
        rule_content = RuleContent(parent_rule=rule)
        rule_content.save()
