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

    $scope.setPrior = function(distributionType, category) {
        console.log(distributionType, category);
        category.prior.type = distributionType;
        switch (distributionType) {
            case "UNINFORMED":
                category.prior.r = 1;
                category.prior.n = 2;
                break;
            case "SYMMETRIC":
                category.prior.r = 5;
                category.prior.n = 10;
                break;
            case "ASYMMETRIC":
                category.prior.r = 7;
                category.prior.n = 10;
        }
        category.prior.betaDist = new BetaDist(category.prior.r, category.prior.n);
        var pdfSeries = {name: "PDF", data: category.prior.betaDist.pdfSeries};
        Highcharts.chart(category.prior.chartName, makeChartUsing([pdfSeries], "Some Units", "Probability Distribution Function", "Source: Input Features", "Probability Dist Function"));
        $scope.redraw_posterior(category);
        console.log(pdfSeries);
    }

    $scope.redraw = function(category) {
        category.prior.betaDist.regenerate();
        var pdfSeries = {name: "PDF", data: category.prior.betaDist.pdfSeries};
        Highcharts.chart(category.prior.chartName, makeChartUsing([pdfSeries], $scope.data.metric, "Probability Distribution Function", "Source: Input Features", "Probability Dist Function"));
        redraw_posterior(category);
    }

    $scope.redraw_mean = function(category) {
        category.prior.betaDist.regenerateFromMean();
        var pdfSeries = {name: "PDF", data: category.prior.betaDist.pdfSeries};
        Highcharts.chart(category.prior.chartName, makeChartUsing([pdfSeries], $scope.data.metric, "Probability Distribution Function", "Source: Input Features", "Probability Dist Function"));
    }

    $scope.redraw_posterior = function(category) {
        console.log("redraw_posterior(",category,")");
        category.posterior.betaDist = category.prior.betaDist.clone();
        category.posterior.betaDist.addResults(category.posterior.newR, category.posterior.newN, category.posterior.posteriorScalingPower);
        var prior = {name: "Prior", data: category.prior.betaDist.pdfSeries, yAxis: 0};
        var posterior = {name: "Posterior", data: category.posterior.betaDist.pdfSeries, yAxis: 1};
        var chartOptions = makeChartUsing([prior, posterior], $scope.data.metric, "Probability Distribution Function", "Source: Input Features", "Probability Dist Function");
        chartOptions.yAxis = [yAxis(),yAxis(true)];
        Highcharts.chart(category.posterior.chartName, chartOptions);
    }
    $scope.setPrior($scope.data.experiment.prior.type, $scope.data.experiment);
    $scope.setPrior($scope.data.control.prior.type, $scope.data.control);
    $scope.redraw_posterior($scope.data.experiment);
    $scope.redraw_posterior($scope.data.control);
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
        yAxis: yAxis(),
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

function yAxis(opposite) {
    var answer = {
        title: {
            text: "pdf(x)"
        },
        crossHair: true,
        labels: {
            enabled: false
        }
    };
    if (opposite) {
        answer["opposite"] = true;
    }
    return answer;
}