'use strict';

/* Services */

var movieServices = angular.module('movieServices', ['ngResource']);

movieServices.factory('Movie', ['$resource',
    function($resource){
        return $resource('/api/movies/:movieId', {}, {
            query: {method:'GET', params:{movieId:'movies'}, isArray:true}
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




