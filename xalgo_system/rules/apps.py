from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class RulesConfig(AppConfig):
    name = "xalgo_system.rules"
    verbose_name = _("Rules")
