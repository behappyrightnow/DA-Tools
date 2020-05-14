class BetaDist {
	_α: number;
	_β: number;
	_r: number;
	_n: number;
	pdfSeries: Array<Array<number>>;
	
    constructor(mean: number, variance: number) {
        this._α = this.α(mean, variance);
        this._β = this.β(mean, variance);
        this._r = this.r(this._α, this._β);
        this._n = this.n(this._α, this._β);
        this.pdfSeries = this.makePDFSeries();
    }

    α(mean: number, variance: number): number {
    	return Math.floor(mean * (mean * (1-mean)/variance - 1));
	}

	β(mean: number, variance: number): number {
    	return Math.floor((1-mean) * (mean*(1-mean)/variance -1));
	}

	r(α: number,β: number): number {
    	return α;
	}

	n(α: number,β: number): number {
    	return α+β;
	}

	logGamma(n: number):number {
	    var arr = Array.from(Array(Math.floor(n)).keys())
	    return arr.reduce(function(sum, i) {
	        return i===0 ?  sum : sum + Math.log(i);},0
	    );
	}

	logB(α: number,β: number): number {
    	return this.logGamma(α)+this.logGamma(β)-this.logGamma(α+β);
	}

	logPdf(x: number): number {
    	return (this._α-1) * Math.log(x) + (this._β-1) * Math.log(1-x) - this.logB(this._α,this._β);
	}

	pdf(x: number): number {
    	return Math.exp(this.logPdf(x));
	}

	makePDFSeries():Array<Array<number>> {
		var xValues:Array<number> = Array.from(Array(1000).keys()).map(function(x) { return x / 1000;});
		return xValues.map((xValue) => {
			return [xValue,this.pdf(xValue)];
		});
	}
}