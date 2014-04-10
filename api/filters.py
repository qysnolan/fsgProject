from fsg.models import *
from rest_framework import filters
import django_filters


# Sell related
class RentalFilter(django_filters.FilterSet):

    class Meta:
        model = Rental
        fields = ['rental_id' ]


class InventoryFilter(django_filters.FilterSet):

    class Meta:
        model = Inventory
        fields = ['inventory_id']


# Customer related
class CustomerFilter(django_filters.FilterSet):

    class Meta:
        model = Customer
        fields = ['last_name', 'first_name']


# Film related
class MovieFilter(django_filters.FilterSet):

    class Meta:
        model = Film
        fields = ['title']