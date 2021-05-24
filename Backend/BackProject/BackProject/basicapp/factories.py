import string
from random import randint
from pytz import timezone
from django.conf import settings
from factory import Iterator
from factory import LazyAttribute
from factory import SubFactory
from factory import Sequence
from factory import lazy_attribute
from factory.django import DjangoModelFactory, FileField
from factory.fuzzy import FuzzyText, FuzzyInteger
from faker import Factory as FakerFactory
from .models import *

faker = FakerFactory.create()


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    password = LazyAttribute(lambda x: faker.text(max_nb_chars=128))
    last_login = LazyAttribute(lambda x: faker.date_time_between(start_date="-1y", end_date="now",
                                                                 tzinfo=timezone(settings.TIME_ZONE)))
    username = Sequence(lambda n: "user_%03d" % n)
    first_name = LazyAttribute(lambda x: faker.text(max_nb_chars=50))
    last_name = LazyAttribute(lambda x: faker.text(max_nb_chars=100))
    email = Sequence(lambda n: 'person{}@example.com'.format(n))
    is_staff = Iterator([True, False])
    is_verified = Iterator([True, False])
    created = LazyAttribute(lambda x: faker.date_time_between(start_date="-1y", end_date="now",
                                                                  tzinfo=timezone(settings.TIME_ZONE)))


class DialogsModelFactory(DjangoModelFactory):
    class Meta:
        model = DialogsModel

    user1 = SubFactory(UserFactory)
    user2 = SubFactory(UserFactory)


class MessageModelFactory(DjangoModelFactory):
    class Meta:
        model = MessageModel

    # is_removed = Iterator([True, False])
    sender = Iterator(User.objects.all())
    recipient = Iterator(User.objects.all())
    text = LazyAttribute(lambda x: faker.paragraph(nb_sentences=3, variable_nb_sentences=True))
    read = Iterator([True, False])
