var movieControllers = angular.module('movieControllers', []);

movieControllers.controller('MovieListCtrl', function ($scope, $http) {

    $scope.column_head = {
        1: "Title",
        2: "Rental Duration (days)",
        3: "Rental Rate (USD$)",
        4: "Length (min)",
        5: "Rating",
        6: "Last Update"
    };

    $scope.sort = {
        column: '1',
        descending: false
    };

    var initiation = function() {
        $http.get(base_url).success(function(data) {
            $scope.movies = data.results;
            $scope.count = data.count;
            $scope.previous = data.previous;
            $scope.next = data.next;
            $scope.totalPages = Math.ceil($scope.count/25);
            $scope.currentPage = 1;
            $scope.firstEntry = 25 * ($scope.currentPage - 1) + 1;
            $scope.lastEntry = $scope.firstEntry + 24 > $scope.count
                ? $scope.count : $scope.firstEntry + 24;
            var pages = [];
            for(var i=0; i<$scope.totalPages; i++)
                pages[i] = {"number": i+1};
            $scope.pages = pages;
            $scope.pageNumber = $scope.currentPage;
            $scope.base_url = base_url;
            $scope.searchTerm = searchValue.trim();
            checkDisable();
        });
        $scope.firstDisable = true;
        $scope.lastDisable = true;
        $scope.nextDisable = false;
        $scope.previousDisable = false;
        $scope.allDataLoaded = false;
        $scope.allDataLoading = false;
        $scope.orderProp = 'name';
        $scope.query = null;
    };

    initiation();
    $scope.stock = null;
    $scope.currentMovie = null;

    var checkDisable = function() {
        $scope.previous==undefined
            ? $scope.previousDisable = true : $scope.previousDisable = false;
        $scope.next==undefined
            ? $scope.nextDisable = true : $scope.nextDisable = false;
        $scope.currentPage==1
            ? $scope.firstDisable = true : $scope.firstDisable = false;
        $scope.totalPages==$scope.currentPage
            ? $scope.lastDisable = true : $scope.lastDisable = false;
    };

    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if (sort.column == column) {
            sort.descending = !sort.descending;
        }
        else {
            sort.column = column;
            sort.descending = false;
        }

        switch(column)
        {
            case '1':
                $scope.orderProp = sort.descending ? "-title": "title";
                break;
            case '2':
                $scope.orderProp = sort.descending ? "-rental_duration": "rental_duration";
                break;
            case '3':
                $scope.orderProp = sort.descending ? "-rental_rate": "rental_rate";
                break;
            case '4':
                $scope.orderProp = sort.descending ? "-length": "length";
                break;
            case '5':
                $scope.orderProp = sort.descending ? "-rating": "rating";
                break;
            case '6':
                $scope.orderProp = sort.descending ? "-last_update": "last_update";
                break;
            default:
                $scope.orderProp = "";
        }
    };

    $scope.getMovies = function(url, direction) {

        $http.get(url).success(function(data) {
            $scope.movies = data.results;
            $scope.previous = data.previous;
            $scope.next = data.next;
            if(direction==1)
                $scope.currentPage = 1;
            if(direction==2)
                $scope.currentPage --;
            if(direction==3)
                $scope.currentPage ++;
            if(direction==4)
                $scope.currentPage = $scope.totalPages;
            $scope.pageNumber = $scope.currentPage;
            $scope.firstEntry = 25 * ($scope.currentPage - 1) + 1;
            $scope.lastEntry = $scope.firstEntry + 24 > $scope.count
                ? $scope.count : $scope.firstEntry + 24;
            $scope.query = null;
            checkDisable();
        });
    };

    $scope.goToPage = function(pageNumber) {
        $http.get(base_url+'&page='+pageNumber.number).success(function(data) {
            $scope.movies = data.results;
            $scope.previous = data.previous;
            $scope.next = data.next;
            $scope.currentPage = pageNumber.number;
            $scope.pageNumber = $scope.currentPage;
            $scope.firstEntry = 25 * ($scope.currentPage - 1) + 1;
            $scope.lastEntry = $scope.firstEntry + 24 > $scope.count
                ? $scope.count : $scope.firstEntry + 24;
            $scope.query = null;
            checkDisable();
        });
    };

    $scope.checkStock = function(movieId, movieName) {
        $http.get('/check_stock/movie/'+movieId).success(function(data) {
            $scope.stock = data;
            $scope.currentMovie = movieName;
        });
    }
});

movieControllers.controller('MovieDetailCtrl',
    ['$scope', '$routeParams','$http', 'Movie',
    function($scope, $routeParams, $http, Movie) {
        $scope.movie = Movie.get({movieId: $routeParams.movieId},
                                 function(movie) { });
        var checkStock = function(movieId) {
            $http.get('/check_stock/movie/'+movieId).success(function(data) {
                $scope.stock = data;
            });
        };
        checkStock($routeParams.movieId);
}]);