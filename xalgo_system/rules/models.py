import uuid

from django.contrib.postgres.fields import JSONField
from django.db.models import (
    CASCADE,
    SET_NULL,
    DateTimeField,
    ForeignKey,
    ManyToManyField,
    Model,
    UUIDField,
)

from xalgo_system.users.models import User


class Rule(Model):
    """Stores a rule's content and associated permissions."""

    id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = DateTimeField(auto_now_add=True, editable=False)
    modified = DateTimeField(auto_now=True, editable=False)

    # The rule creator is the first user to POST the rule to the system.
    rule_creator = ForeignKey(
        to=User, on_delete=SET_NULL, null=True, blank=True, related_name="created_rules"
    )

    # The set of editors can be modified by the creator.
    editors = ManyToManyField(to=User, related_name="editable_rules")

    # If a rule is forked, this will store a reference to the original rule
    forked_from = ForeignKey("Rule", on_delete=SET_NULL, null=True, blank=True)

    primary_content = ForeignKey(
        "RuleContent", null=True, blank=True, on_delete=SET_NULL
    )


class RuleContent(Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = DateTimeField(auto_now_add=True, editable=False)
    modified = DateTimeField(auto_now=True, editable=False)

    parent_rule = ForeignKey(Rule, related_name="content", on_delete=CASCADE)

    # Stores the JSON body of the rule.
    body = JSONField(default=dict)
