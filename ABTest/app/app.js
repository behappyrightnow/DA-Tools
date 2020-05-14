'use strict';

// Declare app level module which depends on views, and components
angular.module('abtest', [
  'ngRoute','ngMaterial',
  'abtest.dashboard'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/viewDashboard'});
}]).
factory('setupService', function() {
  var getData = function() {
    return setupData;
  }

  return {
    getData: getData
  };

});
