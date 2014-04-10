'use strict';

/* Services */

var customerServices = angular.module('customerServices', ['ngResource']);

customerServices.factory('Customer', ['$resource',
    function($resource){
        return $resource('/api/customers/:customerId', {}, {
            query: {method:'GET', params:{customerId:'customers'}, isArray:true}
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




