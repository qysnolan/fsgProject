var customerControllers = angular.module('customerControllers', []);

customerControllers.controller('CustomerListCtrl', function ($scope, $http) {

    $scope.column_head = {
        1: "Last Name",
        2: "First Name",
        3: "Email",
        4: "Home Store",
        5: "Active",
        6: "Create Date",
        7: "Last Update"
    };

    $scope.sort = {
        column: '1',
        descending: false
    };

    var initiation = function() {
        $http.get(base_url).success(function(data) {
            $scope.customers = data.results;
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
                $scope.orderProp = sort.descending ? "-last_name": "last_name";
                break;
            case '2':
                $scope.orderProp = sort.descending ? "-first_name": "first_name";
                break;
            case '3':
                $scope.orderProp = sort.descending ? "-email": "email";
                break;
            case '4':
                $scope.orderProp = sort.descending ? "-store_id": "store_id";
                break;
            case '5':
                $scope.orderProp = sort.descending ? "-active": "active";
                break;
            case '6':
                $scope.orderProp = sort.descending ? "-create_date": "create_date";
                break;
            case '7':
                $scope.orderProp = sort.descending ? "-last_update": "last_update";
                break;
            default:
                $scope.orderProp = "";
        }
    };

    $scope.getCustomers = function(url, direction) {
        $http.get(url).success(function(data) {
            $scope.customers = data.results;
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
        $http.get(base_url+'?page='+pageNumber.number).success(function(data) {
            $scope.customers = data.results;
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
});

customerControllers.controller('CustomerDetailCtrl',
    ['$scope', '$routeParams', '$http', 'Customer',
    function($scope, $routeParams, $http, Customer) {
        $scope.customer = Customer.get({customerId: $routeParams.customerId},
            function(customer) { });

        var getBalance = function(customerId) {
            $http.get('/get_balance/customer/'+customerId).success(function(data) {
                $scope.balance = data;
            });
        };
        getBalance($routeParams.customerId);
}]);