'use strict';

angular.module('rev.dashboard', ['ngRoute', 'rev'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewDashboard', {
    templateUrl: 'viewDashboard/viewDashboard.html',
    controller: 'ViewDashboardCtrl'
  });
}])

.controller('ViewDashboardCtrl', ['$scope', '$http','setupService','$location','$timeout',function($scope, $http, setupService, $location, $timeout) {
    $scope.data = setupService.getData();
    $scope.months = getMonthList();
    $scope.simulationFinished = true;
    $scope.data.items = $scope.data.items.map(function(item) {
        item["editing"] = false;
        item["tenDate"] = toDate(item["ten"]);
        item["fiftyDate"] = toDate(item["fifty"]);
        item["ninetyDate"] = toDate(item["ninety"]);
        item["daysFromToday"] = {
            "ten": diffInDays(item["tenDate"], $scope.data.startDate),
            "fifty": diffInDays(item["fiftyDate"], $scope.data.startDate),
            "ninety": diffInDays(item["ninetyDate"], $scope.data.startDate)
        };
        return item;
    });
    var p = [0.1, 0.5, 0.9];
    $scope.oneSimResults = simulateAllCustomersOnce($scope.data.items, $scope.data.startDate, p);

    function dateStringFor(dateItem) {
        return getMonthNameFor(dateItem)+" "+dateItem.getDate()+", "+dateItem.getFullYear();
    }

    function rediff() {
        // Recalculate differences
        $scope.data.items = $scope.data.items.map(function(item) {
            item["daysFromToday"]["ten"] = diffInDays(item["tenDate"], $scope.data.startDate);
            item["daysFromToday"]["fifty"] = diffInDays(item["fiftyDate"], $scope.data.startDate);
            item["daysFromToday"]["ninety"] = diffInDays(item["ninetyDate"], $scope.data.startDate);
            return item;
        });
        draw();
    }


    function zip(arr1, arr2) {
        var arr3 = arr1.map(function(item) {
            return item;
        });
        for (var i=0;i<arr2.length;i++) {
            arr3.push(arr2[i]);
        }
        return arr3;
    }

    function addBusinessDays(d,n) {
        d = new Date(d.getTime());
        var day = d.getDay();
        d.setDate(d.getDate() + n + (day === 6 ? 2 : +!day) + (Math.floor((n - 1 + (day % 6 || 1)) / 5) * 2));
        return d;
    }

    function addDays(d, n) {
        d = new Date(d.getTime());
        d.setDate(d.getDate() + n);
        return d;
    }

    function makeChartUsing(series, units, chartTitle, subTitle, yAxisTitle, startDate,showDate,showProbability) {
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
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true,
                min: 0,
                max: 700,
                labels: {
                    formatter: function(val) {
                       if (showDate === undefined || showDate == false) {
                        return val.value;
                       } else {
                        return dateStringFor(addDays(startDate, val.value));
                       }
                    }
                }
            },
            tooltip: {
                formatter: function(val) {
                    if (showDate === undefined || showDate == false) {
                        return this.point.x;
                    } else {
                        var msg = "<b>"+this.point.series.name+"</b><br/>";
                        if (showProbability) {
                            msg += "Probability: "+ (Math.round(this.point.y*100))+"%<br/>";
                        }
                        return msg+"Date: "+dateStringFor(addDays(startDate, this.point.x));
                    }
                }
            },
            yAxis: {
                title: {
                    text: yAxisTitle
                }
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
                    showInLegend: true,
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
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x} cm, {point.y} kg'
                    }
                }
            },
            series: series
        };
    }

    function draw() {
        var simResult = simulate($scope.data.items,p, $scope.data.startDate, $scope.numRuns);
        $scope.monthBuckets = simResult.monthBuckets;
        $scope.totalResult = simResult.totalResult;
        $scope.activations = simResult.activations;
        var cdfSeries = $scope.data.items.map(function(item,i) {
            var yVector = [];
            var sum = 0;
            for(var i=0;i<1000;i++) {
                yVector.push(i/1000);
            }
            return {
                name: item.name,
                data: yVector.map(function(y, j) {
                    return [j === 0? 0 :
                        cdfInverse(y, item.daysFromToday, p),y];
                })
            };
        });
        var pdfSeries = $scope.data.items.map(function(item,index) {
            var yVector = [];
            var sum = 0;
            for(var i=0;i<1000;i++) {
                yVector.push(i/1000);
            }
            return {
                name: item.name,
                data: yVector.map(function(y, j) {
                    return [cdfSeries[index].data[j][0], j === 0? 0 :
                        (1/((1/2)*(1/(Math.log((1-p[0])/p[0])))*Math.log((item.daysFromToday.ninety)/(item.daysFromToday.ten))/(y*(1-y))+(1/((1-2*p[0])*(Math.log((1-p[0])/p[0]))))*Math.log(((item.daysFromToday.ninety)*(item.daysFromToday.ten))/Math.pow(item.daysFromToday.fifty,2))*((y-0.5)/(y*(1-y))+Math.log(y/(1-y)))))*Math.exp(-(Math.log(item.daysFromToday.fifty)+(1/2)*(1/(Math.log((1-p[0])/p[0])))*Math.log((item.daysFromToday.ninety)/(item.daysFromToday.ten))*Math.log(y/(1-y))+(1/((1-2*p[0])*(Math.log((1-p[0])/p[0]))))*Math.log(((item.daysFromToday.ninety)*(item.daysFromToday.ten))/Math.pow(item.daysFromToday.fifty,2))*(y-0.5)*Math.log(y/(1-y))))];
                })
            };
        });
        Highcharts.chart('pdf', makeChartUsing(pdfSeries, $scope.data.units, "Probability Density Function", "Source: Input Features", "Probability Dist Function", $scope.data.startDate, true, false));
        Highcharts.chart('cdf', makeChartUsing(cdfSeries, $scope.data.units, "Cumulative Distribution Function", "Source: Input Features", "Cumulative Dist Function", $scope.data.startDate, true, true));

    }
    draw();
    $scope.addRow = function() {
        $scope.data.items.push({name:"New", ten:0, fifty:0, ninety: 0, editing: false});
        draw();
    };

    $scope.edit = function(index) {
        $scope.data.items[index].editing = !$scope.data.items[index].editing;
    }

    $scope.update = function(index) {
        var item  = $scope.data.items[index];
        item.ten = toDateString(item.tenDate);
        item.fifty = toDateString(item.fiftyDate);
        item.ninety = toDateString(item.ninetyDate);
        item.editing = false;
        draw();
    }

    $scope.remove = function(index) {
        $scope.data.items = $scope.data.items.filter(function(item, i) {
            return index !== i;
        });
        draw();
    }
    $scope.simulate = function() {
        console.log("Simulating "+$scope.numRuns+" times.");
        var that = $scope;
        that.simulationFinished = false;

        $timeout(function() {
            var simResult = simulate(that.data.items,p, that.data.startDate, that.numRuns);
            that.monthBuckets = simResult.monthBuckets;
            that.totalResult = simResult.totalResult;
            that.activations = simResult.activations;
            that.simulationFinished = true;
        }, 50);

    }

    $scope.simulateOnce = function() {
        console.log("Simulating once");
       $scope.oneSimResults = simulateAllCustomersOnce($scope.data.items, $scope.data.startDate, p);
    }

    $scope.recalcDate = function() {
        rediff();
        draw();
    }

    $scope.formatMoney = function(amount) {
        try {
            var decimalCount = 0;
            var decimal = ".";
            var thousands = ",";
            var negativeSign = amount < 0 ? "-$" : "$";

            var i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            var j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        }  catch (e) {
            console.log(e)
        }
    }
    $scope.expand = function(itemToExpand) {
        if (itemToExpand.expanded === undefined) {
            itemToExpand.expanded = true;
        } else {
            itemToExpand.expanded = !itemToExpand.expanded;
        }
    }

    $scope.expand10 = function(i) {
        console.log("Expanding 10% for "+i);
        $scope.expand($scope.monthBuckets[i].ten);
    }

    $scope.expand10total = function() {
        console.log("Expanding 10% Total");
        $scope.expand($scope.totalResult.ten);
    }

    $scope.expand50 = function(i) {
        console.log("Expanding 50% for "+i);
        $scope.expand($scope.monthBuckets[i].fifty);
    }

    $scope.expand50total = function() {
        console.log("Expanding 50% Total");
        $scope.expand($scope.totalResult.fifty);
    }

    $scope.expand90 = function(i) {
        console.log("Expanding 90% for "+i);
        $scope.expand($scope.monthBuckets[i].ninety);
    }

    $scope.expand90total = function() {
        console.log("Expanding 90% Total");
        $scope.expand($scope.totalResult.ninety);
    }

    $scope.downloadCSV = function() {
            var d = new Date();
            var csv = "Number of Runs,"+$scope.numRuns+",,Date,"+d.toString()+"\n\n";
            csv += "Percentile";
            $scope.months.forEach(function(month) {
                csv += ","+month;
            });
            csv += ",Total\n";

            csv += "10% chance of being below";
            $scope.monthBuckets.forEach(function(monthBucket) {
                csv += ","+monthBucket.ten.monthRevenue;
            });
            csv += ","+$scope.totalResult.ten.total+"\n";
            csv += "50% chance of being below";
            $scope.monthBuckets.forEach(function(monthBucket) {
                csv += ","+monthBucket.fifty.monthRevenue;
            });
            csv += ","+$scope.totalResult.fifty.total+"\n";
            csv += "90% chance of being below";
            $scope.monthBuckets.forEach(function(monthBucket) {
                csv += ","+monthBucket.ninety.monthRevenue;
            });
            csv += ","+$scope.totalResult.ninety.total+"\n";


            console.log(csv);
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'revenueForecast.csv';
            hiddenElement.click();
    }
}]);

function toDate(dateText) {
    var parts = dateText.split('/');
    return new Date(parts[2], parts[0]-1, parts[1]);
}

function addDays(d, n) {
    d = new Date(d.getTime());
    d.setDate(d.getDate() + n);
    return d;
}

function toDateString(d) {
    return (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear();
}

function diffInDays(d1, d2) {
    var Difference_In_Time = Math.max(d1.getTime() - d2.getTime(),0);

    // To calculate the no. of days between two dates
    return Difference_In_Time / (1000 * 3600 * 24);
}

function getMonthNameFor(d) {
    var month = getMonthList();
    return month[d.getMonth()];
}

function getMonthList() {
    return [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
}
function simulate(items, p, startDate, numRuns) {
    console.log("Starting simulation...");
    var monthBuckets = [];
    var totals = [];
    var monthList = getMonthList();
    for (var i=0;i<12;i++) {
        monthBuckets[i] = { month: monthList[i], data:[], ten: 0, fifty: 0, ninety: 0};
    }
    for (var i=0;i<numRuns;i++) {
        var simResults = simulateAllCustomersOnce(items, startDate, p);
        simResults.eachMonth.forEach(function(monthRevenue, i) {
            monthBuckets[i].data.push({monthRevenue: monthRevenue, monthDetails: simResults.eachMonthDetails[i]});
        });

        totals.push({total: simResults.total, totalDetails: simResults.totalDetails, monthlyTotals: makeMonthlyTotalsFrom(simResults)});
    }
    monthBuckets = monthBuckets.map(function(monthBucket) {
        var result = fillTenFiftyNinety(monthBucket.data,monthBucketSorter);
        monthBucket.ten = result.ten;
        monthBucket.fifty = result.fifty;
        monthBucket.ninety = result.ninety;
        return monthBucket;
    });
    var totalResult = fillTenFiftyNinety(totals, totalSort);
    console.log(monthBuckets);
    console.log(totalResult);
    return { monthBuckets: monthBuckets, totalResult: totalResult};
}

function cdfInverse(y, days, p) {
    return Math.exp(Math.log(days.fifty)+(1/2)*(1/(Math.log((1-p[0])/p[0])))*Math.log(days.ninety/days.ten)*Math.log(y/(1-y))+(1/((1-2*p[0])*(Math.log((1-p[0])/p[0]))))*Math.log((days.ninety*days.ten)/(Math.pow(days.fifty,2)))*(y-0.5)*Math.log(y/(1-y)));
}

function totalSort(a,b) {
    return a.total - b.total;
};

function monthBucketSorter(a, b) {
    return a.monthRevenue - b.monthRevenue;
}
function fillTenFiftyNinety(dataBucket, sorter) {
    dataBucket.sort(sorter);
    var tenIndex = dataBucket.length * 0.1 | 0;
    var fiftyIndex = dataBucket.length * 0.5 | 0;
    var ninetyIndex = dataBucket.length * 0.9 | 0;
    return {
        ten: dataBucket[tenIndex],
        fifty: dataBucket[fiftyIndex],
        ninety: dataBucket[ninetyIndex]
    };
}

function simulateAllCustomersOnce(items, startDate, p) {
    var eachMonth = [];
    var eachMonthDetails = [];
    var totalDetails = [];
    var monthList = getMonthList();
    for (var i=0;i<12;i++) {
        eachMonth.push(0);
        eachMonthDetails.push([]);
    }
    var activations = [];
    var total = 0;
    var rnd = Math.random();
    items.map(function(item) {
        var x = cdfInverse(rnd, item.daysFromToday, p);
        if (isNaN(x)) {
            x = 0;
        }
        var dateOfActivation = addDays(startDate, x);
        var monthOfActivation = dateOfActivation.getMonth();
        var yearOfActivation = dateOfActivation.getFullYear();
        if (yearOfActivation === 2020) {
            eachMonth[monthOfActivation] += item.revenue;
            eachMonthDetails[monthOfActivation].push({name:item.name, revenue:item.revenue});
            total += item.revenue;
            totalDetails.push({name:item.name, revenue:item.revenue, month: monthList[monthOfActivation], monthIndex: monthOfActivation});
            activations.push({name:item.name, month:monthOfActivation, revenue:item.revenue});
        } else {
            activations.push({name:item.name, month:13, revenue:item.revenue});
        }
    });
    return {
        eachMonth: eachMonth,
        eachMonthDetails: eachMonthDetails,
        total: total,
        totalDetails: totalDetails,
        activations: activations
    }
}

function makeMonthlyTotalsFrom(simResults) {
    var monthlyTotals = [];
    for (var j=0;j<12;j++) {
        monthlyTotals[j] = 0;
    }
    simResults.totalDetails.forEach(function(totalDetail) {
        monthlyTotals[totalDetail.monthIndex] += totalDetail.revenue;
    });
    return monthlyTotals;
}




