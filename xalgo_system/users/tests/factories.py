from typing import Any, Sequence

from django.contrib.auth import get_user_model
from factory import Faker, post_generation
from factory.django import DjangoModelFactory


class UserFactory(DjangoModelFactory):

    username = Faker("user_name")
    email = Faker("email")
    name = Faker("name")

    @post_generation
    def password(self, create: bool, extracted: Sequence[Any], **kwargs):
        locale = "en_US"
        faked_password = Faker(
            "password",
            length=42,
            special_chars=True,
            digits=True,
            upper_case=True,
            lower_case=True,
            locale=locale,
        ).generate({"locale": locale})

        self.set_password(extracted if extracted else faked_password)

    class Meta:
        model = get_user_model()
        django_get_or_create = ["username"]
