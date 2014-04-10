from rest_framework import serializers
from fsg.models import *


# Sell related
class RentalSerializer(serializers.HyperlinkedModelSerializer):

    inventory_url = serializers.\
        HyperlinkedRelatedField(source="inventory",
                                view_name="inventory-detail")
    inventory_id = serializers.RelatedField(source="inventory")

    customer_url = serializers.\
        HyperlinkedRelatedField(source="customer",
                                view_name="customer-detail")
    customer_name = serializers.RelatedField(source="customer")

    staff_name = serializers.RelatedField(source="staff")

    payment_rental = serializers.RelatedField(many=True)

    class Meta:
        model = Rental
        fields = ('url', 'rental_id', 'inventory_url', 'inventory_id',
                  'customer_url', 'customer_name', 'rental_date',
                  'return_date', 'last_update', 'staff_name', 'payment_rental')


class InventorySerializer(serializers.HyperlinkedModelSerializer):

    movie_url = serializers.HyperlinkedRelatedField(source="film",
                                                    view_name="film-detail")
    movie_name = serializers.RelatedField(source="film")

    store_id = serializers.RelatedField(source="store")

    rental_inventory = serializers.RelatedField(many=True)

    class Meta:
        model = Inventory
        fields = ('url', 'inventory_id', 'last_update', 'movie_url',
                  'movie_name', 'store_id', 'rental_inventory')


# Customer related
class CustomerSerializer(serializers.HyperlinkedModelSerializer):

    address_name = serializers.RelatedField(source="address")
    store_id = serializers.RelatedField(source="store")

    class Meta:
        model = Customer
        fields = ('url', 'customer_id', 'first_name', 'last_name', 'email',
                  'active', 'create_date', 'last_update', 'address_name',
                  'store_id')


# Movie related
class MovieSerializer(serializers.HyperlinkedModelSerializer):

    language_name = serializers.RelatedField(source="language")
    original_language_name = serializers.RelatedField(source="language")
    inventory_movie = serializers.RelatedField(many=True)

    class Meta:
        model = Film
        fields = ('url', 'film_id', 'title', 'description', 'release_year',
                  'rental_duration', 'rental_rate', 'length',
                  'replacement_cost', 'rating', 'special_features',
                  'last_update', 'language_name', 'original_language_name',
                  'inventory_movie')