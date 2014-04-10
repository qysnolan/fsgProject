'use strict';

/* Services */

var rentalServices = angular.module('rentalServices', ['ngResource']);

rentalServices.factory('Rental', ['$resource',
    function($resource){
        return $resource('/api/rentals/:rentalId', {}, {
            query: {method:'GET', params:{rentalId:'rentals'}, isArray:true}
        });
    }]);

angular.module('filters', []).
    filter('truncate', function () {
        return function (text, length) {
            if(text==undefined)
                return text;
            var end = "...";
            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }
        };
    });




