var setupData = {
    lowerBound: 0,
    upperBound: 1,
    experiment: {
        description: "show a large button titled 'Start Now' on homepage",
        prior: {
            mean: 0.7,
            variance: 0.019,
            type: "ASYMMETRIC",
            chartName: "pdfExperiment"
        },
        cost: 20
    },
    control: {
        description: "show a normal button titled 'Start Now' on homepage",
        prior: {
            mean: 0.7,
            variance: 0.019,
            type: "ASYMMETRIC",
            chartName: "pdfControl"
        },
        cost: 5
    },
    metric: "Long-run fraction of heads",
    headEquivalent: "button-click on home page",
    valueOfHead: 1000
  };