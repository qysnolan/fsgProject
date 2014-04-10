'use strict';

/* Filters */

angular.module('inventoryFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});
