from __future__ import unicode_literals

from django.db import models


# Movie related models
class Film(models.Model):
    film_id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    release_year = models.TextField(blank=True, max_length=4)
    language = models.ForeignKey('Language', related_name='film_language')
    original_language = models.ForeignKey('Language', blank=True, null=True,
                                          related_name='film_origin_language')
    rental_duration = models.IntegerField()
    rental_rate = models.DecimalField(max_digits=4, decimal_places=2)
    length = models.IntegerField(blank=True, null=True)
    replacement_cost = models.DecimalField(max_digits=5, decimal_places=2)
    rating = models.CharField(max_length=5, blank=True)
    special_features = models.CharField(max_length=54, blank=True)
    last_update = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'film'

    def __unicode__(self):
        return u'%s' % self.title


class FilmText(models.Model):
    film_id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    class Meta:
        managed = False
        db_table = 'film_text'


class Language(models.Model):
    language_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=20)
    last_update = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'language'

    def __unicode__(self):
        return u'%s' % self.name


class Actor(models.Model):
    actor_id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    last_update = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'actor'

    def __unicode__(self):
        return u'%s, %s' % (self.last_name, self.first_name)


class FilmActor(models.Model):
    actor = models.ForeignKey(Actor)
    film = models.ForeignKey(Film)
    last_update = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'film_actor'


class Category(models.Model):
    category_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=25)
    last_update = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'category'


class FilmCategory(models.Model):
    film = models.ForeignKey(Film)
    category = models.ForeignKey(Category)
    last_update = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'film_category'


# Address related models
class Address(models.Model):
    address_id = models.IntegerField(primary_key=True)
    address = models.CharField(max_length=50)
    address2 = models.CharField(max_length=50, blank=True)
    district = models.CharField(max_length=20)
    city = models.ForeignKey('City')
    postal_code = models.CharField(max_length=10, blank=True)
    phone = models.CharField(max_length=20)
    last_update = models.DateTimeField()

    class Meta:
        db_table = 'address'

    def __unicode__(self):
        return u'%s, %s, %s, %s' % (self.address, self.address2, self.district,
                                    self.postal_code)


class City(models.Model):
    city_id = models.IntegerField(primary_key=True)
    city = models.CharField(max_length=50)
    country = models.ForeignKey('Country')
    last_update = models.DateTimeField()

    class Meta:
        db_table = 'city'


class Country(models.Model):
    country_id = models.IntegerField(primary_key=True)
    country = models.CharField(max_length=50)
    last_update = models.DateTimeField()

    class Meta:
        db_table = 'country'


# Customer related models
class Customer(models.Model):
    customer_id = models.IntegerField(primary_key=True)
    store = models.ForeignKey('Store')
    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    email = models.CharField(max_length=50, blank=True)
    address = models.ForeignKey(Address)
    active = models.IntegerField()
    create_date = models.DateTimeField()
    last_update = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'customer'

    def __unicode__(self):
        return u'%s, %s' % (self.last_name, self.first_name)


# Sell related models
class Inventory(models.Model):
    inventory_id = models.IntegerField(primary_key=True)
    film = models.ForeignKey(Film, related_name='inventory_movie')
    store = models.ForeignKey('Store')
    last_update = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'inventory'

    def __unicode__(self):
        return u'%s' % self.inventory_id


class Payment(models.Model):
    payment_id = models.IntegerField(primary_key=True)
    customer = models.ForeignKey(Customer)
    staff = models.ForeignKey('Staff')
    rental = models.ForeignKey('Rental', blank=True, null=True,
                               related_name='payment_rental')
    amount = models.DecimalField(max_digits=5, decimal_places=2)
    payment_date = models.DateTimeField()
    last_update = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'payment'

    def __unicode__(self):
        return u'%s' % self.amount


class Rental(models.Model):
    rental_id = models.IntegerField(primary_key=True)
    rental_date = models.DateTimeField()
    inventory = models.ForeignKey(Inventory, related_name='rental_inventory')
    customer = models.ForeignKey(Customer)
    return_date = models.DateTimeField(blank=True, null=True)
    staff = models.ForeignKey('Staff')
    last_update = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'rental'

    def __unicode__(self):
        return u'%s' % self.rental_id


# Staff related models
class Staff(models.Model):
    staff_id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    address = models.ForeignKey(Address)
    picture = models.TextField(blank=True)
    email = models.CharField(max_length=50, blank=True)
    store = models.ForeignKey('Store')
    active = models.IntegerField()
    username = models.CharField(max_length=16)
    password = models.CharField(max_length=40, blank=True)
    last_update = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'staff'

    def __unicode__(self):
        return u'%s, %s' % (self.last_name, self.first_name)


# Store related models
class Store(models.Model):
    store_id = models.IntegerField(primary_key=True)
    manager_staff = models.ForeignKey(Staff, unique=True,
                                      related_name='store_staff')
    address = models.ForeignKey(Address)
    last_update = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'store'

    def __unicode__(self):
        return u'%s' % self.store_id


# MySQL views
# class ActorInfo(models.Model):
#     actor_id = models.IntegerField()
#     first_name = models.CharField(max_length=45)
#     last_name = models.CharField(max_length=45)
#     film_info = models.TextField(blank=True)
#
#     class Meta:
#         managed = False
#         db_table = 'actor_info'


# class FilmList(models.Model):
#     fid = models.IntegerField(db_column='FID', blank=True, null=True)
#     title = models.CharField(max_length=255, blank=True)
#     description = models.TextField(blank=True)
#     category = models.CharField(max_length=25)
#     price = models.DecimalField(max_digits=4, decimal_places=2, blank=True,
#                                 null=True)
#     length = models.IntegerField(blank=True, null=True)
#     rating = models.CharField(max_length=5, blank=True)
#     actors = models.TextField(blank=True)
#
#     class Meta:
#         managed = False
#         db_table = 'film_list'


# class NicerButSlowerFilmList(models.Model):
#     fid = models.IntegerField(db_column='FID', blank=True, null=True)
#     title = models.CharField(max_length=255, blank=True)
#     description = models.TextField(blank=True)
#     category = models.CharField(max_length=25)
#     price = models.DecimalField(max_digits=4, decimal_places=2, blank=True,
#                                 null=True)
#     length = models.IntegerField(blank=True, null=True)
#     rating = models.CharField(max_length=5, blank=True)
#     actors = models.TextField(blank=True)
#
#     class Meta:
#         managed = False
#         db_table = 'nicer_but_slower_film_list'


# class CustomerList(models.Model):
#     id = models.IntegerField(db_column='ID')
#     name = models.CharField(max_length=91, blank=True)
#     address = models.CharField(max_length=50)
#     zip_code = models.CharField(db_column='zip code', max_length=10,
#                                 blank=True)
#     phone = models.CharField(max_length=20)
#     city = models.CharField(max_length=50)
#     country = models.CharField(max_length=50)
#     notes = models.CharField(max_length=6)
#     sid = models.IntegerField(db_column='SID')
#
#     class Meta:
#         managed = False
#         db_table = 'customer_list'


# class SalesByFilmCategory(models.Model):
#     category = models.CharField(max_length=25)
#     total_sales = models.DecimalField(max_digits=27, decimal_places=2,
#                                       blank=True, null=True)
#
#     class Meta:
#         managed = False
#         db_table = 'sales_by_film_category'


# class SalesByStore(models.Model):
#     store = models.CharField(max_length=101, blank=True)
#     manager = models.CharField(max_length=91, blank=True)
#     total_sales = models.DecimalField(max_digits=27, decimal_places=2,
#                                       blank=True, null=True)
#
#     class Meta:
#         managed = False
#         db_table = 'sales_by_store'


# class StaffList(models.Model):
#     id = models.IntegerField(db_column='ID')
#     name = models.CharField(max_length=91, blank=True)
#     address = models.CharField(max_length=50)
#     zip_code = models.CharField(db_column='zip code', max_length=10,
#                                 blank=True)
#     phone = models.CharField(max_length=20)
#     city = models.CharField(max_length=50)
#     country = models.CharField(max_length=50)
#     sid = models.IntegerField(db_column='SID')
#
#     class Meta:
#         managed = False
#         db_table = 'staff_list'