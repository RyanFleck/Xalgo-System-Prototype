from django.contrib.postgres.fields import JSONField
from django.db.models import SET_NULL, ForeignKey, ManyToManyField, Model

from xalgo_system.users.models import User


class Rule(Model):
    """Stores a rule's content and associated permissions."""

    # The rule creator is the first user to POST the rule to the system.
    rule_creator = ForeignKey(
        to=User, on_delete=SET_NULL, null=True, blank=True, related_name="created_rules"
    )

    # The set of editors can be modified by the creator.
    editors = ManyToManyField(to=User, related_name="editable_rules")

    # If a rule is forked, this will store a reference to the original rule
    forked_from = ForeignKey("Rule", on_delete=SET_NULL, null=True, blank=True)

    # Stores the JSON body of the rule.
    content = JSONField(default=dict)
