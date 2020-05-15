var setupData = {
    lowerBound: 0,
    upperBound: 1,
    experiment: {
        description: "show a large button titled 'Start Now' on homepage",
        prior: {
            r: 7,
            n: 10,
            type: "ASYMMETRIC",
            chartName: "pdfExperiment"
        },
        numTosses: 0,
        numHeads: 0,
        posterior: {
            newR: 0,
            newN: 0,
            chartName: "prePostExperiment"
        }
    },
    control: {
        description: "show a normal button titled 'Start Now' on homepage",
        prior: {
            r: 7,
            n: 10,
            type: "ASYMMETRIC",
            chartName: "pdfControl"
        },
        numTosses: 0,
        numHeads: 0,
        posterior: {
            newR: 0,
            newN: 0,
            chartName: "prePostControl"
        }
    },
    metric: "Long-run fraction of heads",
    headEquivalent: "button-click on home page",
    tossEquivalent: "page view",
    valueOfHead: 1,
    numUsersAtLaunch: 1000000,
    costOfLaunch: 20000,
  };