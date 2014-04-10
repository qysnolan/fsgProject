var rentalApp = angular.module('rentalApp', [
    'ngRoute',
    'ngCookies',
    'rentalControllers',
    'rentalFilters',
    'rentalServices',
    'filters'
]);

rentalApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/static/js/app/views/rental_list.html',
                controller: 'RentalListCtrl'
            }).
            when('/detail/:rentalId', {
                templateUrl: '/static/js/app/views/rental_detail.html',
                controller: 'RentalDetailCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);


var inventoryApp = angular.module('inventoryApp', [
    'ngRoute',
    'ngCookies',
    'inventoryControllers',
    'inventoryFilters',
    'inventoryServices',
    'filters'
]);

inventoryApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/static/js/app/views/inventory_list.html',
                controller: 'InventoryListCtrl'
            }).
            when('/detail/:inventoryId', {
                templateUrl: '/static/js/app/views/inventory_detail.html',
                controller: 'InventoryDetailCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);


var movieApp = angular.module('movieApp', [
    'ngRoute',
    'ngCookies',
    'movieControllers',
    'movieFilters',
    'movieServices',
    'filters'
]);

movieApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/static/js/app/views/movie_list.html',
                controller: 'MovieListCtrl'
            }).
            when('/detail/:movieId', {
                templateUrl: '/static/js/app/views/movie_detail.html',
                controller: 'MovieDetailCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);


var customerApp = angular.module('customerApp', [
    'ngRoute',
    'ngCookies',
    'customerControllers',
    'customerFilters',
    'customerServices',
    'filters'
]);

customerApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/static/js/app/views/customer_list.html',
                controller: 'CustomerListCtrl'
            }).
            when('/detail/:customerId', {
                templateUrl: '/static/js/app/views/customer_detail.html',
                controller: 'CustomerDetailCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);