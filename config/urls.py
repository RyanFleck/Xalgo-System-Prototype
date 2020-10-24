from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views import defaults as default_views
from django.views.generic import TemplateView
from rest_framework.authtoken.views import obtain_auth_token

from xalgo_system.rules.views import single_rule_view
from xalgo_system.users.views import system_stats_view

urlpatterns = [
    path("", TemplateView.as_view(template_name="pages/home.html"), name="home"),
    path(
        "about/", TemplateView.as_view(template_name="pages/about.html"), name="about"
    ),
    path(
        "privacy-policy/",
        TemplateView.as_view(template_name="pages/privacy.html"),
        name="privacy-policy",
    ),
    path(
        "terms-of-service/",
        TemplateView.as_view(template_name="pages/terms_of_service.html"),
        name="terms-of-service",
    ),
    path(
        "statistics/",
        system_stats_view,
        name="statistics",
    ),
    path(
        "rule/<uuid:rule_id>/",
        single_rule_view,
        name="view-rule",
    ),
    # Django Admin, use {% url 'admin:index' %}
    path(settings.ADMIN_URL, admin.site.urls),
    # User management
    url(r"^rest-auth/", include("rest_auth.urls")),
    url(r"^rest-auth/registration/", include("rest_auth.registration.urls")),
    path("users/", include("xalgo_system.users.urls", namespace="users")),
    path("accounts/", include("allauth.urls")),
    # Your stuff: custom urls includes go here
    path("apps/", include("xalgo_system.react_apps.urls", namespace="apps")),
    path("api/", include("xalgo_system.jwt_auth.urls", namespace="jwt_auth")),
    path("rules/", include("xalgo_system.rules.urls", namespace="rules")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# API URLS
urlpatterns += [
    # API base url
    path("api/", include("config.api_router")),
    # DRF auth token
    path("auth-token/", obtain_auth_token),
]

if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    urlpatterns += [
        path("", include("xalgo_system.swagger.urls", namespace="swagger")),
        path(
            "400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),
        path(
            "403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),
        path(
            "404/",
            default_views.page_not_found,
            kwargs={"exception": Exception("Page not Found")},
        ),
        path("500/", default_views.server_error),
    ]
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
