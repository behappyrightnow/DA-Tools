class BetaDist {
	_α: number;
	_β: number;
	_r: number;
	_n: number;
	_mean: number;
	_variance: number;
	_priorScalingPower: number;
	pdfSeries: Array<Array<number>>;
	
    constructor(r: number, n: number, priorScalingPower: number = 1) {
        this.__initialize(r, n, priorScalingPower);
    }

    __initialize(r: number, n: number, priorScalingPower: number = 1) {
        this._priorScalingPower = priorScalingPower;
        this._α = r * this._priorScalingPower;
        this._β = n * this._priorScalingPower - r * this._priorScalingPower;
        this._r = r;
        this._n = n;
        this._mean = this.mean(this._α,this._β);
        this._variance = this.variance(this._α,this._β);
        this.pdfSeries = this.makePDFSeries();
    }

   	mean(α: number, β: number): number {
    	return α/(α+β);
	}

	variance(α: number, β: number): number {
    	return (α * β)/ ((Math.pow(α+β,2)) * (1+α+β));
	}

	logGamma(n: number):number {
	    var arr = Array.from(Array(n).keys());
	    return arr.reduce(function(sum, i) {
	        return i===0 ?  sum : sum + Math.log(i);},0
	    );
	}

	logB(α: number,β: number): number {
    	return this.logGamma(α)+this.logGamma(β)-this.logGamma(α+β);
	}

	logPdf(x: number): number {
    	return x === 0 ? 0: (this._α-1) * Math.log(x) + (this._β-1) * Math.log(1-x) - this.logB(this._α,this._β);
	}

	pdf(x: number): number {
    	return x === 0? 0: Math.exp(this.logPdf(x));
	}

	makePDFSeries():Array<Array<number>> {
		var xValues:Array<number> = Array.from(Array(1000).keys()).map(function(x) { return x / 1000;});
		var answer = xValues.map((xValue,i) => {
			return [xValue,this.pdf(xValue)];
		});
		answer.push([1,0]);
		return answer;
	}

	rescalePrior(newScalingPower:number) {
		this.__initialize(this._r, this._n, newScalingPower);
	}

	regenerate() {
		this.__initialize(this._r, this._n, this._priorScalingPower);
	}
}