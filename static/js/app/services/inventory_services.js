'use strict';

/* Services */

var inventoryServices = angular.module('inventoryServices', ['ngResource']);

inventoryServices.factory('Inventory', ['$resource',
    function($resource){
        return $resource('/api/inventories/:inventoryId', {}, {
            query: {method:'GET', params:{inventoryId:'inventory'}, isArray:true}
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




