var setupData = {
    lowerBound: 0,
    upperBound: 1,
    experiment: {
        description: "show a large button titled 'Start Now' on homepage",
        prior: {
            r: 1,
            n: 10,
            type: "ASYMMETRIC",
            chartName: "pdfExperiment",
            priorScalingPower: 5
        },
        numTosses: 0,
        numHeads: 0,
        posterior: {
            newR: 600,
            newN: 10000,
            chartName: "prePostExperiment",
            posteriorScalingPower: 10
        }
    },
    control: {
        description: "show a normal button titled 'Start Now' on homepage",
        prior: {
            r: 1,
            n: 10,
            type: "ASYMMETRIC",
            chartName: "pdfControl",
            priorScalingPower: 5
        },
        numTosses: 0,
        numHeads: 0,
        posterior: {
            newR: 300,
            newN: 10000,
            chartName: "prePostControl",
            posteriorScalingPower: 10
        }
    },
    metric: "Long-run fraction of heads",
    headEquivalent: "button-click on home page",
    tossEquivalent: "page view",
    valueOfHead: 1,
    numUsersAtLaunch: 1000000,
    costOfLaunch: 20000,
  };