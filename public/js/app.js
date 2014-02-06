var TAP = {};  // wrapper object pattern - change to meaningful value for you

TAP.mean = angular.module('meanapp', ['ngResource']);

TAP.mean.config(function ($routeProvider) {

    $routeProvider.
        when('/', {
            controller: "userListCtrl",
            templateUrl: 'views/user/list.html'
        }).
        when('/user', {
            controller  : "userListCtrl",
            templateUrl : "views/user/list.html"
        }).
        when('/user/create', {
            controller  : "userCreateCtrl",
            templateUrl : "views/user/create.html"
        }).
        when('/user/:id', {
            controller  :  "userViewCtrl",
            templateUrl : 'views/user/view.html'
        }).
        when('/user/:id/edit', {
            controller  :  "userEditCtrl",
            templateUrl :  "views/user/edit.html"
        }).
        when('/user/:id/delete', {
            controller  :  "userDeleteCtrl",
            templateUrl :  "views/user/delete.html"
        }).
        when('/message/email/:id', {
            controller  :  "messageCtrl",
            templateUrl :  "views/message/email.html"
        }).
        when('/message/sms/:id', {
            controller  :  "messageCtrl",
            templateUrl :  "views/message/sms.html"
        }).
        otherwise({
            redirectTo: '/'
        });
});

// Users REST end-point and controllers - you'd break out into files as you had more
TAP.mean.factory("Users", function ($resource) {

    return $resource("/api/users/:id", {id : "@_id"},
        {
           "create"  : {method : "POST"},
           "index"   : {method : "GET", isArray: true},
           "show"    : {method : "GET", isArray: false},
           "update"  : {method : "PUT"},
           "destroy" : {method : "DELETE"}
        }
    );
});


TAP.mean.controller("userListCtrl" , function ($scope, Users) {

    Users.index(function (data) {
        $scope.users =  data;
    });

});


TAP.mean.controller("userViewCtrl" , function ($scope, $location, $routeParams, Users) {

    Users.show({ id : $routeParams.id}, function (data) {
        $scope.user = data;
    });

});


TAP.mean.controller("userCreateCtrl", function ($scope, $location, Users) {

    $scope.user = {};

    $scope.doCreate =  function () {
        Users.create($scope.user);
        $location.path("/user");
    };

    $scope.doCancel = function () {
        $location.path("/user");
    };

});

TAP.mean.controller("userEditCtrl", function ($scope, $location, $routeParams, Users) {

    Users.show({ id : $routeParams.id}, function (data) {
        $scope.user = data;
    });

    $scope.doUpdate = function () {
        Users.update($scope.user);
        $location.path("/user");
    };

    $scope.doCancel = function () {
        $location.path("/user");
    };
});

TAP.mean.controller("userDeleteCtrl", function ($scope, $location, $routeParams, Users) {

    $scope.doDelete = function () {
        Users.destroy({ id : $routeParams.id});
        $location.path("/user");
    };

    $scope.doCancel = function () {
        $location.path("/user");
    };

});


/*
 * Messaging controller
 */
TAP.mean.controller("messageCtrl", function ($scope, $http, $location, $routeParams, Users) {

    $scope.message = {};
    Users.show({ id : $routeParams.id}, function (data) {
        $scope.user = data;
        $scope.message.email = data.email;
        $scope.message.phone = data.phone;
        $scope.message.firstName = data.firstName;
        $scope.message.lastName = data.lastName;
    });

    $scope.sendEmail = function () {

        $http.post("/api/email",$scope.message).success(function(data, status, headers, config) {
            console.log("Client-side: Mail sent");
            $location.path("/user/"+$routeParams.id);
            // TODO: Add flash / growl style message to confirm
        }).
            error(function(data, status, headers, config) {
                console.log("Client-Side : Mail failed");
            });
    };

    $scope.sendSMS = function () {

        $http.post("/api/sms",$scope.message).success(function(data, status, headers, config) {
            console.log("Client-side: Text sent");
            $location.path("/user/"+$routeParams.id);
            // TODO: Add flash / growl style message to confirm
        }).
            error(function(data, status, headers, config) {
                console.log("Client-Side: Text failed");
            });
    };
});

/*
 * Things you'd likely do from here
 *  - Break the controllers up into a directory to have a file per object you save
 *  - Consider avoiding a route triggered view change since you may/may not want to hit the REST service that much
 *  - Add in form validations in an improved manner both sides
 *  - Research the various components you can get for Angular (calendar, etc.) to support what you need
 *    Note you can take jQuery stuff and then wrap it in a directive - try not to combine DOM style manipulations a la
 *    jQuery with Angular style it is kind of mixing methods and may cause lots of trouble
 */



