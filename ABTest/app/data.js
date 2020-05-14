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
        cost: 20
    },
    control: {
        description: "show a normal button titled 'Start Now' on homepage",
        prior: {
            r: 7,
            n: 10,
            type: "ASYMMETRIC",
            chartName: "pdfControl"
        },
        cost: 5
    },
    metric: "Long-run fraction of heads",
    headEquivalent: "button-click on home page",
    tossEquivalent: "page view",
    valueOfHead: 1000
  };