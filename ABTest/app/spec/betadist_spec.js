describe('betadist', function(){
	describe('after initializing Beta(7,10)', function(){
	    var betaDist = new BetaDist(7,10);
	    it('should set alpha and beta correctly', function() {
	    	expect(betaDist._alpha).toEqual(7);
	    	expect(betaDist._beta).toEqual(3);
	    });
	    it('should set r and n correctly', function() {
	    	expect(betaDist._r).toEqual(7);
	    	expect(betaDist._n).toEqual(10);
	  	});
	  	it('should calculate mean and variance correctly', function() {
	  		expect(betaDist._mean).toEqual(0.7);
	  		expect(betaDist._variance).toBeCloseTo(0.019,3);
	  	});
	  	it('should set prior scaling power to 1', function() {
	  		expect(betaDist._priorScalingPower).toEqual(1);
	  	});

	  	describe('log gamma', function() {
	  		// it('should calculate for 0 correctly', function() {
		  	// 	expect(betaDist.logGamma(0)).toBeCloseTo(0,6);
		  	// });
		  	it('should calculate for 1 correctly', function() {
		  		expect(betaDist.logGamma(1)).toBeCloseTo(0,6);
		  	});
		  	it('should calculate for 2 correctly', function() {
		  		expect(betaDist.logGamma(2)).toBeCloseTo(0,6);
		  	});
		  	it('should calculate for 3 correctly', function() {
		  		expect(betaDist.logGamma(3)).toBeCloseTo(0.693147,6);
		  	});
		  	it('should calculate for 4 correctly', function() {
		  		expect(betaDist.logGamma(4)).toBeCloseTo(1.791759469,6);
		  	});
		  	it('should calculate for 10 correctly', function() {
		  		expect(betaDist.logGamma(10)).toBeCloseTo(12.80182748,6);
		  	});
	  	});
	  	describe("logB", function() {
	  		it("should calculate for alpha=7 and beta=3 correctly", function() {
	  			expect(betaDist.logB(7,3)).toBeCloseTo(-5.529429088,6);
	  		});
	  		it("should calculate for alpha=10 and beta=15 correctly", function() {
	  			expect(betaDist.logB(10,15)).toBeCloseTo(-16.79168074,6);
	  		});
	  		it("should calculate for alpha=1000 and beta=9000 correctly", function() {
	  			expect(betaDist.logB(1000,9000)).toBeCloseTo(-3253.311909,6);
	  		});
	  	});
	  	describe("logpdf", function() {
	  		it("should calculate for x = 0.06 (alpha=7, beta=3) correctly", function() {
	  			expect(betaDist.logPdf(0.06)).toBeCloseTo(-11.47478602, 6);
	  		});
	  		it("should calculate for x = 0.22 (alpha=7, beta=3) correctly", function() {
	  			expect(betaDist.logPdf(0.22)).toBeCloseTo(-4.052260027, 6);
	  		});
	  		it("should calculate for x = 0.54 (alpha=7, beta=3) correctly", function() {
	  			expect(betaDist.logPdf(0.54)).toBeCloseTo(0.279254672, 6);
	  		});
	  		it("should calculate for x = 0.99 (alpha=7, beta=3) correctly", function() {
	  			expect(betaDist.logPdf(0.99)).toBeCloseTo(-3.7412133, 6);
	  		});
	  	});
	  	describe("pdf", function() {
	  		it("should calculate for x = 0.0 (alpha=7, beta=3) correctly", function() {
	  			expect(betaDist.pdf(0)).toBeCloseTo(0, 6);
	  		});
	  		it("should calculate for x = 0.06 (alpha=7, beta=3) correctly", function() {
	  			expect(betaDist.pdf(0.06)).toBeCloseTo(0.00001039, 6);
	  		});
	  		it("should calculate for x = 0.22 (alpha=7, beta=3) correctly", function() {
	  			expect(betaDist.pdf(0.22)).toBeCloseTo(0.017383044, 6);
	  		});
	  		it("should calculate for x = 0.54 (alpha=7, beta=3) correctly", function() {
	  			expect(betaDist.pdf(0.54)).toBeCloseTo(1.322144014, 6);
	  		});
	  		it("should calculate for x = 0.99 (alpha=7, beta=3) correctly", function() {
	  			expect(betaDist.pdf(0.99)).toBeCloseTo(0.0237253, 6);
	  		});
	  	});
	  	describe("PDF Series creation", function() {
	  		it("should generate 1001 points", function() {
	  			expect(betaDist.pdfSeries.length).toEqual(1001);
	  		});
	  		it("should generate first point as 0,0", function() {
	  			expect(betaDist.pdfSeries[0][0]).toEqual(0);
	  			expect(betaDist.pdfSeries[0][1]).toEqual(0);
	  		});
	  		it("should generate pdf value correctly for x=0.111", function() {
	  			expect(betaDist.pdfSeries[111][1]).toBeCloseTo(0.000372513,6);
	  		});
	  		it("should generate pdf value correctly for x=0.565", function() {
	  			expect(betaDist.pdfSeries[565][1]).toBeCloseTo(1.551206949,6);
	  		});
	  		it("should generate pdf value correctly for x=0.989", function() {
	  			expect(betaDist.pdfSeries[989][1]).toBeCloseTo(0.028534066,6);
	  		});
	  		it("should generate last pdf point as 1,0", function() {
		    	expect(betaDist.pdfSeries[1000][0]).toEqual(1);
		  		expect(betaDist.pdfSeries[1000][1]).toEqual(0);
		    });
	  	});
	  	describe("rescaling prior scale power to 10", function() {
	  		var betaDist2 = new BetaDist(7,10);
	  		betaDist2.rescalePrior(10);
	  		it('should set prior scaling power correctly', function() {
	  			expect(betaDist2._priorScalingPower).toEqual(10);
	  		});
	  		it('should set alpha and beta correctly', function() {
		    	expect(betaDist2._alpha).toEqual(70);
		    	expect(betaDist2._beta).toEqual(30);
		    });
		    it('should set r and n correctly', function() {
		    	expect(betaDist2._r).toEqual(7);
		    	expect(betaDist2._n).toEqual(10);
		  	});
		  	it('should calculate mean and variance correctly', function() {
		  		expect(betaDist2._mean).toEqual(0.7);
		  		expect(betaDist2._variance).toBeCloseTo(0.0020792,6);
		  	});
	  	});
	  	describe("rescale directly", function() {
			var betaDist2 = new BetaDist(7,10);
	  		betaDist2._priorScalingPower = 10;
	  		it('alpha and beta should be unchanged', function() {
		    	expect(betaDist2._alpha).toEqual(7);
		    	expect(betaDist2._beta).toEqual(3);
		    });

	  		it('alpha and beta should change after regeneration', function() {
	  			betaDist2.regenerate();
		    	expect(betaDist2._alpha).toEqual(70);
		    	expect(betaDist2._beta).toEqual(30);
		    });
	  	});
	  	describe("change mean", function() {	
	  		var betaDist2 = null;
	  		beforeEach(function() {
	  			betaDist2 = new BetaDist(7,10);
	  			betaDist2._mean = 0.6;
	  		});
	  		it('alpha and beta should be unchanged', function() {
		    	expect(betaDist2._alpha).toEqual(7);
		    	expect(betaDist2._beta).toEqual(3);
		    });

	  		it('alpha and beta should change after regeneration from mean', function() {
	  			betaDist2.regenerateFromMean();
		    	expect(betaDist2._alpha).toEqual(6);
		    	expect(betaDist2._beta).toEqual(4);
		    });
		    it('should calculate alpha and beta correctly when scaling power is not 1', function() {
		    	betaDist2 = new BetaDist(7,10,100);
	  			betaDist2._mean = 0.63;
	  			betaDist2.regenerateFromMean();
		    	expect(betaDist2._alpha).toEqual(630);
		    	expect(betaDist2._beta).toEqual(370);
		    });
	  	});
	  	describe("learn", function() {
	  		beforeEach(function() {
	  			betaDist = new BetaDist(7,10);
	  			betaDist.addResults("10","100");
	  		});
	  		it("should update r and n correctly", function() {
	  			expect(betaDist._r).toEqual(17);
	  			expect(betaDist._n).toEqual(110);
	  		});
	  		it("should update alpha and beta correctly", function() {
	  			expect(betaDist._alpha).toEqual(17);
	  			expect(betaDist._beta).toEqual(93);
	  		});
	  		it("should update r and n correctly with scaling power 10", function() {
	  		    betaDist = new BetaDist(7,10);
	  			betaDist.addResults("10","100", 10);
	  			expect(betaDist._r).toEqual(8);
	  			expect(betaDist._n).toEqual(20);
	  		});
	  	});
	  	describe("cdf", function() {
	  		beforeEach(function() {
	  			betaDist = new BetaDist(7,10);
	  		});
	  		it("should calculate cdf correctly when x = 0.1", function() {
	  			expect(betaDist.cdf(0.51)).toBeCloseTo(0.100086418,6);
	  		});
	  		it("should calculate cdf correctly when x = 0.5", function() {
	  			expect(betaDist.cdf(0.72)).toBeCloseTo(0.517098162,6);
	  		});
	  		it("should calculate cdf correctly when x = 0.9", function() {
	  			expect(betaDist.cdf(0.87)).toBeCloseTo(0.899073627,6);
	  		});
	  	});

	  	describe("cdfInverse", function() {
	  		describe("with rigged table", function() {
	  			beforeEach(function() {
	  				var cdfTable = [
			  			{ value: 0.49, probability: 0.080388424},
			  			{ value: 0.50, probability: 0.08984375},
			  			{ value: 0.51, probability: 0.100086418},
			  			{ value: 0.52, probability: 0.111146888},
			  			{ value: 0.7,  probability: 0.462831166},
			  			{ value: 0.71, probability: 0.48975403},
			  			{ value: 0.72, probability: 0.517098162},
			  			{ value: 0.73, probability: 0.544769316},
			  			{ value: 0.87, probability: 0.899073627},
			  			{ value: 0.88, probability: 0.916741098},
			  			{ value: 0.89, probability: 0.93275039},
			  			{ value: 0.9, probability: 0.947027862}
			  		];
			  		betaDist.cdfTable = cdfTable;
			  	});
			  	it("should calculate inverse cdf correctly when x = 0.1", function() {
		  			expect(betaDist.cdfInverse(0.1)).toBeCloseTo(0.51,2);
		  		});
		  		it("should calculate cdf correctly when x = 0.5", function() {
		  			expect(betaDist.cdfInverse(0.5)).toBeCloseTo(0.71,2);
		  		});
		  		it("should calculate cdf correctly when x = 0.9", function() {
		  			expect(betaDist.cdfInverse(0.9)).toBeCloseTo(0.87,2);
		  		});

	  		});
	  		describe("with production data", function() {
		  		beforeEach(function() {
		  			betaDist = new BetaDist(7,10);
		  		});
		  		it("should calculate inverse cdf correctly when x = 0.1", function() {
		  			expect(betaDist.cdfInverse(0.1)).toBeCloseTo(0.51,2);
		  		});
		  		it("should calculate cdf correctly when x = 0.5", function() {
		  			expect(betaDist.cdfInverse(0.5)).toBeCloseTo(0.714,2);
		  		});
		  		it("should calculate cdf correctly when x = 0.9", function() {
		  			expect(betaDist.cdfInverse(0.9)).toBeCloseTo(0.871,2);
		  		});
		  	});
	  	});

	});
	describe('after initializing a Uniform Beta(1,2)', function(){
	    var betaDist = new BetaDist(1,2);
	    it("should calculate pdf for x = 0.1 (alpha=1, beta=1) correctly", function() {
  			expect(betaDist.pdf(0.1)).toBeCloseTo(1,6);
  		});
	    it("should calculate for x = 0.0 (alpha=1, beta=1) correctly", function() {
  			expect(betaDist.pdf(0)).toEqual(0);
  		});
	    it("should generate first pdf point as 0,0", function() {
	    	expect(betaDist.pdfSeries[0][0]).toEqual(0);
	  		expect(betaDist.pdfSeries[0][1]).toEqual(0);
	    });
	    it("should generate last pdf point as 1,0", function() {
	    	expect(betaDist.pdfSeries[1000][0]).toEqual(1);
	  		expect(betaDist.pdfSeries[1000][1]).toEqual(0);
	    });
	});
});
