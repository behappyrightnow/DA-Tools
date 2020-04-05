'use strict';

// Declare app level module which depends on views, and components
angular.module('rev', [
  'ngRoute',
  'rev.dashboard'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/viewDashboard'});
}]).
factory('setupService', function() {
  var setupData = {
    startDate: new Date(2020,0,1),
    pi: Math.PI,
    items: [
        {"name": "CUST1","ten": "1/1/2020", "fifty": "1/1/2020","ninety":"1/1/2020","revenue":134000},
        {"name": "CUST2","ten": "2/1/2020", "fifty": "3/1/2020","ninety":"1/1/2021","revenue":199000},
        {"name": "CUST3","ten": "1/29/2020", "fifty": "2/15/2020","ninety":"3/1/2020","revenue":122800},
        {"name": "CUST4","ten": "12/1/2020", "fifty": "12/2/2020","ninety":"12/3/2020","revenue":250000},
        {"name": "CUST5","ten": "3/31/2020", "fifty": "4/30/2020","ninety":"5/31/2020","revenue":300611},
        {"name": "CUST6","ten": "5/1/2020", "fifty": "6/1/2020","ninety":"7/30/2020","revenue":234200},
        {"name": "CUST7","ten": "3/1/2020", "fifty": "3/30/2020","ninety":"5/30/2020","revenue":330400},
        {"name": "CUST8","ten": "4/30/2020", "fifty": "1/1/2021","ninety":"6/1/2021","revenue":452368},
        {"name": "CUST9","ten": "5/1/2020", "fifty": "6/1/2020","ninety":"1/1/2021","revenue":112000},
        {"name": "CUST10","ten": "5/1/2020", "fifty": "6/1/2020","ninety":"10/1/2020","revenue":213200},
        {"name": "CUST11","ten": "5/1/2020", "fifty": "6/1/2020","ninety":"7/1/2020","revenue":324880}
    ],
    units: "dates"
  };

  var getData = function() {
    return setupData;
  }

  return {
    getData: getData
  };

});
