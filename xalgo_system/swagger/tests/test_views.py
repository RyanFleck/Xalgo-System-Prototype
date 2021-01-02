import pytest
from django.test import RequestFactory

from xalgo_system.swagger.views import awake

pytestmark = pytest.mark.django_db


def test_awake_view(rf: RequestFactory):
    request = rf.get("/fake-url")
    response = awake(request)
    assert response.status_code == 200
