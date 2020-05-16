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
            priorScalingPower: 2
        },
        numTosses: 0,
        numHeads: 0,
        posterior: {
            newR: 400,
            newN: 10000,
            chartName: "prePostExperiment"
        }
    },
    control: {
        description: "show a normal button titled 'Start Now' on homepage",
        prior: {
            r: 1,
            n: 20,
            type: "ASYMMETRIC",
            chartName: "pdfControl",
            priorScalingPower: 2
        },
        numTosses: 0,
        numHeads: 0,
        posterior: {
            newR: 300,
            newN: 10000,
            chartName: "prePostControl"
        }
    },
    metric: "Long-run fraction of heads",
    headEquivalent: "button-click on home page",
    tossEquivalent: "page view",
    valueOfHead: 1,
    numUsersAtLaunch: 1000000,
    costOfLaunch: 20000,
    posteriorScalingPower: 10
  };