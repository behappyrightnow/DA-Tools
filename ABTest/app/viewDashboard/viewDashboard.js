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
    $scope.notCopied = true;
    $scope.setupEditMode = false;
    $scope.posteriorScalingPowerSensitivity = 400;
    console.log($scope.data);
    $scope.charts = {};

    $scope.formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });

    $scope.toggleEditingSetup = function() {
        $scope.setupEditMode = !$scope.setupEditMode;
    }

    $scope.setPrior = function(distributionType, category) {
        console.log(distributionType, category);
        category.prior.type = distributionType;
        switch (distributionType) {
            case "UNINFORMED":
                category.prior.r = 1;
                category.prior.n = 2;
                category.prior.priorScalingPower = 1;
                break;
            case "SYMMETRIC":
                category.prior.r = 5;
                category.prior.n = 10;
                category.prior.priorScalingPower = 1;
                break;
            case "ASYMMETRIC":
                category.prior.r = 2;
                category.prior.n = 20;
                category.prior.priorScalingPower = 1;
                break;
        }
        category.prior.betaDist = new BetaDist(category.prior.r, category.prior.n, category.prior.priorScalingPower);
        var pdfSeries = {name: "PDF", data: category.prior.betaDist.pdfSeries};
        var chartOptions = makeChartUsing([pdfSeries], "Some Units", "Probability Distribution Function", "Source: Input Features", "Probability Dist Function");
        $scope.updateChart(category.prior.chartName, [pdfSeries.data], chartOptions);
        $scope.redraw_posterior(category);
        $scope.drawSensitivity();
        $scope.drawSensitivityToHeads();
        console.log(pdfSeries);
    }

    $scope.redraw = function(category) {
        category.prior.betaDist.regenerate();
        var pdfSeries = {name: "PDF", data: category.prior.betaDist.pdfSeries};
        var chartOptions = makeChartUsing([pdfSeries], $scope.data.metric, "Probability Distribution Function", "Source: Input Features", "Probability Dist Function");
        $scope.updateChart(category.prior.chartName, [pdfSeries.data], chartOptions);
        $scope.redraw_posterior(category);
    }

    $scope.redraw_mean = function(category) {
        category.prior.betaDist.regenerateFromMean();
        var pdfSeries = {name: "PDF", data: category.prior.betaDist.pdfSeries};
        var chartOptions = makeChartUsing([pdfSeries], $scope.data.metric, "Probability Distribution Function", "Source: Input Features", "Probability Dist Function");
        $scope.updateChart(category.prior.chartName, [pdfSeries.data], chartOptions);
        $scope.redraw_posterior(category);
    }

    $scope.updateChart = function(chartId, dataArr, chartOptions) {
        if (chartId in $scope.charts) {
            var chart = $scope.charts[chartId];
            dataArr.map(function(data,i) {
                chart.series[i].setData(data,true);
            });
        } else {
            var chart = Highcharts.chart(chartId, chartOptions);
            $scope.charts[chartId] = chart;
        }
    }
    $scope.redraw_posterior = function(category) {
        console.log("redraw_posterior(",category,")");
        category.posterior.betaDist = category.prior.betaDist.clone();
        category.posterior.betaDist.addResults(category.posterior.newR, category.posterior.newN, $scope.data.posteriorScalingPower);
        var prior = {name: "Prior", data: category.prior.betaDist.pdfSeries, yAxis: 0};
        var posterior = {name: "Posterior", data: category.posterior.betaDist.pdfSeries, yAxis: 1};
        var chartOptions = makeChartUsing([prior, posterior], $scope.data.metric, "Probability Distribution Function", "Source: Input Features", "Probability Dist Function");
        chartOptions.yAxis = [yAxis(),yAxis(true)];
        $scope.updateChart(category.posterior.chartName, [prior.data, posterior.data], chartOptions);
        $scope.valueAddedByFeature = $scope.data.control.posterior.betaDist === undefined ? 0 : $scope.data.experiment.posterior.betaDist._mean * $scope.data.valueOfHead * $scope.data.numUsersAtLaunch - $scope.data.control.posterior.betaDist._mean * $scope.data.valueOfHead * $scope.data.numUsersAtLaunch;
        $scope.netValue = $scope.valueAddedByFeature - $scope.data.costOfLaunch;
        $scope.drawSensitivity();
        $scope.drawSensitivityToHeads();
    }

    $scope.redraw_both_posterior = function(experiment, control) {
        $scope.redraw_posterior(experiment);
        $scope.redraw_posterior(control);
    }

    $scope.drawSensitivity = function() {
        if ($scope.data.experiment.prior.betaDist === undefined || $scope.data.control.prior.betaDist == undefined) {
            return;
        }
        var expSensitivityOptions = {
            r: $scope.data.experiment.posterior.newR,
			n: $scope.data.experiment.posterior.newN,
			numLaunch: $scope.data.numUsersAtLaunch,
			valueOfHead: $scope.data.valueOfHead,
			costToSubtract: $scope.data.costOfLaunch,
			startScalePower:1,
			endScalePower:1000
        };
        var controlSensitivityOptions = {
            r: $scope.data.control.posterior.newR,
			n: $scope.data.control.posterior.newN,
			numLaunch: $scope.data.numUsersAtLaunch,
			valueOfHead: $scope.data.valueOfHead,
			costToSubtract: 0,
			startScalePower:1,
			endScalePower:1000
        };
        var experimentNetValue = {name: "Experiment Net Value", data: $scope.data.experiment.prior.betaDist.sensitivityToPosteriorScalePower(expSensitivityOptions)};
        var controlNetValue = {name: "Control Net Value", data: $scope.data.control.prior.betaDist.sensitivityToPosteriorScalePower(controlSensitivityOptions)};
        var addedValue = experimentNetValue.data.map(function(item, i) {
            return [item[0], Math.max(item[1]-controlNetValue.data[i][1],0)];
        })
        var experimentAddedValue = {name: "Experiment Added Value Over Control", data: addedValue};
        var chartOptions = makeChartUsing([experimentNetValue, controlNetValue, experimentAddedValue], "Posterior Scale Power", "Sensitivity to Posterior Scale Power", "", "Value");
        chartOptions.yAxis.labels.enabled = true;
        chartOptions.yAxis.title.text = "Value ($)";
        Highcharts.chart("sensitivityPosteriorScale", chartOptions);
    }

    $scope.drawSensitivityToHeads = function() {
        if ($scope.data.experiment.prior.betaDist === undefined || $scope.data.control.prior.betaDist == undefined) {
            return;
        }
        var headSensitivityOptions = {
            n: $scope.data.control.posterior.newN,
			numLaunch: $scope.data.numUsersAtLaunch,
			valueOfHead: $scope.data.valueOfHead,
			costToSubtract: 0,
			posteriorScalePower: $scope.posteriorScalingPowerSensitivity,
			startHeads:1,
			endHeads:1000
        };
        var controlNetValue = {name: "Control Net Value", data: $scope.data.control.prior.betaDist.sensitivityToHeads(headSensitivityOptions)};
        var expPrior = $scope.data.experiment.prior.betaDist;
        var expPosterior = $scope.data.experiment.posterior;
        var experimentNetValue = {name: "Experiment Net Value",
            data: controlNetValue.data.map(function(item,i) {
                return [item[0],headSensitivityOptions.valueOfHead * headSensitivityOptions.numLaunch * (expPrior._r*expPrior._priorScalingPower+expPosterior.newR/headSensitivityOptions.posteriorScalePower)/(expPrior._n*expPrior._priorScalingPower+expPosterior.newN/headSensitivityOptions.posteriorScalePower) - $scope.data.costOfLaunch ];
            })
        };
        var addedValue = experimentNetValue.data.map(function(item, i) {
            return [item[0], Math.max(item[1]-controlNetValue.data[i][1],0)];
        })
        var experimentAddedValue = {name: "Experiment Added Value Over Control", data: addedValue};
        var chartOptions = makeChartUsing([experimentNetValue, controlNetValue, experimentAddedValue], "Number of Heads in Control", "Sensitivity to Heads in Control", "", "Value");
        chartOptions.yAxis.labels.enabled = true;
        chartOptions.yAxis.title.text = "Value ($)";
        $scope.updateChart("sensitivityHeadsControl", [experimentNetValue.data, controlNetValue.data, experimentAddedValue.data], chartOptions);
    }

    $scope.prunedData = function() {
        var pruned = JSON.parse(JSON.stringify($scope.data));
        delete pruned.experiment.prior['pdfSeries'];
        delete pruned.experiment.posterior['pdfSeries'];
        delete pruned.control.prior['pdfSeries'];
        delete pruned.control.posterior['pdfSeries'];
        delete pruned.experiment.prior['betaDist'];
        delete pruned.experiment.posterior['betaDist'];
        delete pruned.control.prior['betaDist'];
        delete pruned.control.posterior['betaDist'];
        return pruned;
    }
    $scope.$watch('data', function(newVal, oldVal) {
        console.log("resetting notCopied");
        $scope.notCopied = true;
        $scope.data.experiment.prior.priorScalingPower = $scope.data.experiment.prior.betaDist._priorScalingPower;
        if ($scope.data.experiment.control.betaDist !== undefined) {
            $scope.data.control.prior.priorScalingPower = $scope.data.experiment.control.betaDist._priorScalingPower;
        }
    }, true);
    $scope.copyToClipboard = function() {
        copyTextToClipboard("var setupData = "+JSON.stringify($scope.prunedData())+";");
        $scope.notCopied = false;
    }
    $scope.setPrior($scope.data.experiment.prior.type, $scope.data.experiment);
    $scope.setPrior($scope.data.control.prior.type, $scope.data.control);
    $scope.redraw_posterior($scope.data.experiment);
    $scope.redraw_posterior($scope.data.control);
    $scope.drawSensitivity();
    $scope.drawSensitivityToHeads();
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


function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}