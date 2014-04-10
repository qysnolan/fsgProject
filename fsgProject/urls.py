from django.conf.urls import patterns, include, url

from django.contrib import admin

from fsg.views import *

admin.autodiscover()

handler401 = 'choiceNet.views.error_401'
handler403 = 'choiceNet.views.error_403'
handler404 = 'choiceNet.views.error_404'
handler500 = 'choiceNet.views.error_500'
handler502 = 'choiceNet.views.error_502'
handler504 = 'choiceNet.views.error_504'

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'fsgProject.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),

    url(r'^home/', Home, name='home'),
    url(r'^$', Home, name="welcome"),

    # Staff
    url(r'^settings/', Home, name='settings'),
    url(r'^login/', Home, name='login'),
    url(r'^create_account/', Home, name='create_account'),
    url(r'^sign_out/', Home, name='sign_out'),

    # Rental
    url(r'^rental/', RentalList, name='rental'),
    url(r'^rent_movie/', Home, name='rent_movie'),
    url(r'^return_movie/', Home, name='return_movie'),

    # Customer
    url(r'^customer/', CustomerList, name='customer'),
    url(r'^add_balance/', Home, name='add_balance'),

    # Inventory
    url(r'^inventory/', InventoryList, name='inventory'),
    url(r'^add_inventory/', Home, name='add_inventory'),
    url(r'^check_stock/movie/(?P<movieID>\d+)/$',
        CheckMovieStock, name="check_stock"),

    # Movie
    url(r'^movie/', MovieList, name='movie'),

    # Json data
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
    url(r"^api/", include("api.urls"), name="api_base"),
    # url(r'^json/rental_list', JsonRental, name='json_rental_list'),

    #Error pages
    url(r'^401/$', error_401, name="error_401"),
    url(r'^403/$', error_403, name="error_403"),
    url(r'^404/$', error_404, name="error_404"),
    url(r'^500/$', error_500, name="error_500"),
    url(r"^502/$", error_502, name="error_502"),
    url(r"^504/$", error_504, name="error_504"),
    url(r"^maintenance/$", maintenance, name="maintenance"),
)
