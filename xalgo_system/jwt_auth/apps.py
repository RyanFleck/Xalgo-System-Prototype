from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class JWTAuthConfig(AppConfig):
    name = "xalgo_system.jwt_auth"
    verbose_name = _("JSON Web Token Authentication")
