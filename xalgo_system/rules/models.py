from django.db.models import SET_NULL, ForeignKey, Model

from xalgo_system.users.models import User


class Rule(Model):
    rule_creator = ForeignKey(User, on_delete=SET_NULL, null=True, blank=True)
