'use strict';

angular.module('abtest.dashboard', ['ngRoute', 'abtest'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewDashboard', {
    templateUrl: 'viewDashboard/viewDashboard.html',
    controller: 'ViewDashboardCtrl'
  });
}])

.controller('ViewDashboardCtrl', ['$scope', '$http','setupService','$location',function($scope, $http, setupService, $location) {
    $scope.data = setupService.getData();
    console.log($scope.data);
    $scope.formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });

    $scope.experimentPrior = function(distributionType) {
        console.log(distributionType);
        $scope.data.priorDistType = distributionType;
        switch (distributionType) {
            case "UNINFORMED":
                $scope.data.experiment.prior.mean = ($scope.data.upperBound + $scope.data.lowerBound) / 2;
                $scope.data.experiment.prior.variance = ($scope.data.upperBound - $scope.data.lowerBound) / 12;
                break;
            case "SYMMETRIC":
                $scope.data.experiment.prior.mean = ($scope.data.upperBound + $scope.data.lowerBound) / 2;
                $scope.data.experiment.prior.variance = 1;
                break;
        }
        $scope.data.experiment.prior.betaDist = new BetaDist($scope.data.experiment.prior.mean, $scope.data.experiment.prior.variance);
        var pdfSeries = {name: "PDF", data: $scope.data.experiment.prior.betaDist.pdfSeries};
        Highcharts.chart('pdf', makeChartUsing([pdfSeries], "Some Units", "Probability Distribution Function", "Source: Input Features", "Probability Dist Function"));

        console.log(pdfSeries);
    }


}]);

function makeChartUsing(series, units, chartTitle, subTitle, yAxisTitle) {
    return {
        chart: {
            type: 'line',
            zoomType: 'xy'
        },
        title: {
            text: chartTitle
        },
        subtitle: {
            text: subTitle
        },
        xAxis: {
            title: {
                enabled: true,
                text: units
            },
            crosshair: true,
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            min: 0
        },
        yAxis: {
            title: {
                text: yAxisTitle
            },
            crossHair: true
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            y: 150,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                }
            }
        },
        series: series
    };
}