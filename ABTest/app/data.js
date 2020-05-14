var setupData = {
    lowerBound: 0,
    upperBound: 1,
    priorDistType: "ASYMMETRIC",
    experiment: {
        description: "show a large button titled 'Start Now' on homepage",
        prior: {
            mean: 0.5,
            variance: 0.08
        },
        cost: 20
    },
    control: {
        description: "show a normal button titled 'Start Now' on homepage",
        prior: {
            mean: 0.5,
            variance: 0.08
        },
        cost: 5
    },
    metric: "Long-run fraction of heads",
    headEquivalent: "button-click on home page",
    valueOfHead: 1000
  };