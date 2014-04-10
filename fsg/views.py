from django.shortcuts import render
from django.db import connection
from django.http import HttpResponse
from django.core import serializers

import json

from models import *


# Error pages
def error_401(request):
    return render(request, "error_pages/401.html")


def error_403(request):
    return render(request, "error_pages/403.html")


def error_404(request):
    return render(request, "error_pages/404.html")


def error_500(request):
    return render(request, "error_pages/500.html")


def error_502(request):
    return render(request, "error_pages/502.html")


def error_504(request):
    return render(request, "error_pages/504.html")


def maintenance(request):
    return render(request, "error_pages/maintenance.html")


# Home page
def Home(request):

    from random import shuffle

    cursor = connection.cursor()
    cursor.execute("SELECT * FROM sales_by_film_category")
    salesCategory = cursor.fetchall()
    salesCategory = list(salesCategory)
    shuffle(salesCategory)

    cursor.execute("SELECT * FROM sales_by_store")
    salesStore = cursor.fetchall()
    salesStore = list(salesStore)
    shuffle(salesStore)

    salesCategoryNumber = []
    salesCategoryName = []

    for sales in salesCategory:
        salesCategoryNumber.append(str(sales[1]))
        salesCategoryName.append(str(sales[0]))

    salesStoreName = []
    salesStoreNumber = []

    for sales in salesStore:
        salesStoreNumber.append(str(sales[2]))
        salesStoreName.append(str(sales[0]) + "(" + str(sales[1]) + ")")

    return render(request, 'home.html',
                  {'salesCategoryNumber': salesCategoryNumber,
                   'salesCategoryName': salesCategoryName,
                   'salesStoreNumber': salesStoreNumber,
                   'salesStoreName': salesStoreName, })


# Rental
def RentalList(request):

    url = '/api/rentals'

    return render(request, 'rental/rental_list.html', {'url': url})


# Inventory
def InventoryList(request):

    url = '/api/inventories'

    return render(request, 'inventory/inventory_list.html', {'url': url})


def CheckMovieStock(request, movieID):

    stores = Store.objects.all()
    storeData = []

    for s in stores:
        city = s.address.city
        country = city.country
        # address = Address.objects.all().get(address_id=s.address_id)
        # city = City.objects.all().get(city_id=address.city_id)
        # country = Country.objects.all().get(country_id=city.country_id)
        storeData.append({"id": s.store_id,
                          "city": city.city + ', ' + country.country})

    data = []
    for s in storeData:
        cursor = connection.cursor()
        cursor.execute("CALL film_in_stock(" + movieID + ","
                       + str(s["id"]) + ",@count);")
        stock = cursor.fetchall()
        stock = list(stock)
        stockList = []
        for r in stock:
            stockList.append(str(r[0]))
        stockData = {"count": len(stock),
                     "inventory_id": stockList}

        cursor = connection.cursor()
        cursor.execute("CALL film_not_in_stock(" + movieID + ","
                       + str(s["id"]) + ",@count);")
        rented = cursor.fetchall()
        rented = list(rented)
        rentedList = []
        for r in rented:
            rentedList.append(str(r[0]))
        rentedData = {"count": len(rented),
                      "inventory_id": rentedList}

        data.append({"id": s["id"],
                     "city": s["city"],
                     "stock": stockData,
                     "not_stock": rentedData})

    import json
    jsonData = json.dumps(data)

    return HttpResponse(jsonData)


# Movie
def MovieList(request):

    post = request.POST

    try:
        searchValue = post["searchValue"]
    except:
        searchValue = " "

    searchValue = searchValue.strip()
    url = '/api/movies?search=' + searchValue

    return render(request, 'movie/movie_list.html',
                  {'url': url, 'searchValue': searchValue})


# Customer
def CustomerList(request):

    url = '/api/customers'

    return render(request, 'customer/customer_list.html', {'url': url})


# Json data
def JsonRental(request):

    jsonData = serializers.serialize("json", Rental.objects.all())

    return HttpResponse(jsonData)