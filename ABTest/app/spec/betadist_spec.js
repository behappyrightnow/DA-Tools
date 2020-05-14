describe('betadist', function(){
	describe('after initializing Beta(7,10)', function(){
	    var betaDist = new BetaDist(7,10);
	    it('should set α and β correctly', function() {
	    	expect(betaDist._α).toEqual(7);
	    	expect(betaDist._β).toEqual(3);
	    });
	    it('should set r and n correctly', function() {
	    	expect(betaDist._r).toEqual(7);
	    	expect(betaDist._n).toEqual(10);
	  	});
	  	it('should calculate mean and variance correctly', function() {
	  		expect(betaDist._mean).toEqual(0.7);
	  		expect(betaDist._variance).toBeCloseTo(0.019,3);
	  	});
	  	describe('log gamma', function() {
	  		it('should calculate for 0 correctly', function() {
		  		expect(betaDist.logGamma(0)).toEqual(0);
		  	});
		  	it('should calculate for 1 correctly', function() {
		  		expect(betaDist.logGamma(1)).toEqual(0);
		  	});
		  	it('should calculate for 2 correctly', function() {
		  		expect(betaDist.logGamma(2)).toEqual(0);
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
	  		it("should calculate for α=7 and β=3 correctly", function() {
	  			expect(betaDist.logB(7,3)).toBeCloseTo(-5.529429088,6);
	  		});
	  		it("should calculate for α=10 and β=15 correctly", function() {
	  			expect(betaDist.logB(10,15)).toBeCloseTo(-16.79168074,6);
	  		});
	  		it("should calculate for α=1000 and β=9000 correctly", function() {
	  			expect(betaDist.logB(1000,9000)).toBeCloseTo(-3253.311909,6);
	  		});
	  	});
	  	describe("logpdf", function() {
	  		it("should calculate for x = 0.06 (α=7, β=3) correctly", function() {
	  			expect(betaDist.logPdf(0.06)).toBeCloseTo(-11.47478602, 6);
	  		});
	  		it("should calculate for x = 0.22 (α=7, β=3) correctly", function() {
	  			expect(betaDist.logPdf(0.22)).toBeCloseTo(-4.052260027, 6);
	  		});
	  		it("should calculate for x = 0.54 (α=7, β=3) correctly", function() {
	  			expect(betaDist.logPdf(0.54)).toBeCloseTo(0.279254672, 6);
	  		});
	  		it("should calculate for x = 0.99 (α=7, β=3) correctly", function() {
	  			expect(betaDist.logPdf(0.99)).toBeCloseTo(-3.7412133, 6);
	  		});
	  	});
	  	describe("pdf", function() {
	  		it("should calculate for x = 0.0 (α=7, β=3) correctly", function() {
	  			expect(betaDist.pdf(0)).toBeCloseTo(0, 6);
	  		});
	  		it("should calculate for x = 0.06 (α=7, β=3) correctly", function() {
	  			expect(betaDist.pdf(0.06)).toBeCloseTo(0.00001039, 6);
	  		});
	  		it("should calculate for x = 0.22 (α=7, β=3) correctly", function() {
	  			expect(betaDist.pdf(0.22)).toBeCloseTo(0.017383044, 6);
	  		});
	  		it("should calculate for x = 0.54 (α=7, β=3) correctly", function() {
	  			expect(betaDist.pdf(0.54)).toBeCloseTo(1.322144014, 6);
	  		});
	  		it("should calculate for x = 0.99 (α=7, β=3) correctly", function() {
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
	});
	describe('after initializing a Uniform Beta(1,2)', function(){
	    var betaDist = new BetaDist(1,2);
	    it("should calculate for x = 0.1 (α=1, β=1) correctly", function() {
  			expect(betaDist.pdf(0.1)).toEqual(1);
  		});
	    it("should calculate for x = 0.0 (α=1, β=1) correctly", function() {
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
