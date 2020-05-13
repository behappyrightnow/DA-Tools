'use strict';

angular.module('abtest.dashboard', ['ngRoute', 'abtest'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewDashboard', {
    templateUrl: 'viewDashboard/viewDashboard.html',
    controller: 'ViewDashboardCtrl'
  });
}])

.controller('ViewDashboardCtrl', ['$scope', '$http','setupService','$location',function($scope, $http, setupService, $location) {
    $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };
}]);