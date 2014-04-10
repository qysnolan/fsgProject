from fsg.models import *
from serializers import *
from rest_framework import mixins, viewsets
from .filters import *


# Sell related
class RentalViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                    mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Rental.objects.none()

    serializer_class = RentalSerializer
    search_fields = ('rental_id', 'inventory_id')
    filter_class = RentalFilter

    def get_queryset(self):
        rentals = Rental.objects.all()

        return rentals.order_by('-rental_date')

    def filter_queryset(self, queryset):
        queryset = super(RentalViewSet, self).filter_queryset(queryset)

        params = self.request.GET

        if 'ordering' in params:
            column = params['ordering']
            if column == 'rental_date':
                queryset = queryset.order_by('rental_date')
            if column == '-rental_date':
                queryset = queryset.order_by('-rental_date')

        return queryset


class InventoryViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                       mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Inventory.objects.none()

    serializer_class = InventorySerializer
    search_fields = ('rental_id', 'movie_name')
    filter_class = InventoryFilter

    def get_queryset(self):
        rentals = Inventory.objects.all()

        return rentals.order_by('inventory_id')

    def filter_queryset(self, queryset):
        queryset = super(InventoryViewSet, self).filter_queryset(queryset)

        params = self.request.GET

        if 'ordering' in params:
            column = params['ordering']
            if column == 'last_update':
                queryset = queryset.order_by('last_update')
            if column == '-last_update':
                queryset = queryset.order_by('-last_update')

        return queryset


# Customer related
class CustomerViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                      mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Customer.objects.none()

    serializer_class = CustomerSerializer
    search_fields = ('last_name', 'first_name')
    filter_class = CustomerFilter

    def get_queryset(self):
        customers = Customer.objects.all()

        return customers.order_by('last_name')

    def filter_queryset(self, queryset):
        queryset = super(CustomerViewSet, self).filter_queryset(queryset)

        params = self.request.GET

        if 'ordering' in params:
            column = params['ordering']
            if column == 'last_name':
                queryset = queryset.order_by('last_name')
            if column == '-first_name':
                queryset = queryset.order_by('-first_name')

        return queryset


# Movie related
class MovieViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                   mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Film.objects.none()

    serializer_class = MovieSerializer
    search_fields = ('title', 'description')
    filter_class = MovieFilter

    def get_queryset(self):
        movies = Film.objects.all()

        return movies.order_by('title')

    def filter_queryset(self, queryset):
        queryset = super(MovieViewSet, self).filter_queryset(queryset)

        params = self.request.GET

        if 'ordering' in params:
            column = params['ordering']
            if column == 'title':
                queryset = queryset.order_by('title')
            if column == '-description':
                queryset = queryset.order_by('-description')

        return queryset