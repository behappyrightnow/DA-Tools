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
        $scope.data.experiment.prior.α = α($scope.data.experiment.prior.mean, $scope.data.experiment.prior.variance);
        $scope.data.experiment.prior.β = β($scope.data.experiment.prior.mean, $scope.data.experiment.prior.variance);
        $scope.data.experiment.prior.r = r($scope.data.experiment.prior.α, $scope.data.experiment.prior.β);
        $scope.data.experiment.prior.n = n($scope.data.experiment.prior.α, $scope.data.experiment.prior.β);
        $scope.data.experiment.prior.pdf = { x: Array.from(Array(1000).keys()).map(function(x) { return x / 1000;})};
        $scope.data.experiment.prior.pdf.y = $scope.data.experiment.prior.pdf.x.map(function(x) { return pdf(x, $scope.data.experiment.prior.α, $scope.data.experiment.prior.β)});
        var pdfSeries = {name: "PDF", data: $scope.data.experiment.prior.pdf.x.map(function(x, i) {
            return [x, $scope.data.experiment.prior.pdf.y[i]];
        })};
        Highcharts.chart('pdf', makeChartUsing([pdfSeries], "Some Units", "Probability Distribution Function", "Source: Input Features", "Probability Dist Function"));

        console.log(pdfSeries);
    }


}]);

function α(mean, variance) {
    return mean * (mean * (1-mean)/variance - 1);
}

function β(mean, variance) {
    return (1-mean) * (mean*(1-mean)/variance -1);
}

function r(α,β) {
    return α;
}

function n(α,β) {
    return α+β;
}


function logGamma(n) {
    var arr = Array.from(Array(Math.floor(n)).keys())
    return arr.reduce(function(sum, i) {
        return i===0 ?  sum : sum + Math.log(i);},0
    );
}

function logB(α,β) {
    return logGamma(α)+logGamma(β)-logGamma(α+β);
}

function logPdf(x, α,β) {
    return (α-1) * Math.log(x) + (β-1) * Math.log(1-x) - logB(α,β);
}

function pdf(x, α, β) {
    return Math.exp(logPdf(x,α,β));
}

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