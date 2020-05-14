class BetaDist {
	_alpha: number;
	_beta: number;
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
        this._alpha = Math.floor(r * this._priorScalingPower);
        this._beta = Math.floor(n * this._priorScalingPower - r * this._priorScalingPower);
        this._r = r;
        this._n = n;
        this._mean = this.mean(this._alpha,this._beta);
        this._variance = this.variance(this._alpha,this._beta);
        this.pdfSeries = this.makePDFSeries();
    }

   	mean(alpha: number, beta: number): number {
    	return alpha/(alpha+beta);
	}

	variance(alpha: number, beta: number): number {
    	return (alpha * beta)/ ((Math.pow(alpha+beta,2)) * (1+alpha+beta));
	}

	logGamma(n: number):number {
	    var arr = Array.from(Array(n).keys());
	    return arr.reduce(function(sum, i) {
	        return i===0 ?  sum : sum + Math.log(i);},0
	    );
	}

	logB(alpha: number,beta: number): number {
    	return this.logGamma(alpha)+this.logGamma(beta)-this.logGamma(alpha+beta);
	}

	logPdf(x: number): number {
    	return x === 0 ? 0: (this._alpha-1) * Math.log(x) + (this._beta-1) * Math.log(1-x) - this.logB(this._alpha,this._beta);
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

	regenerateFromMean() {
		this._r = this._n * this._mean;
		this.__initialize(this._r, this._n, this._priorScalingPower);
	}

	clone() {
		return new BetaDist(this._r, this._n, this._priorScalingPower);
	}

	addResults(r: string, n: string) {
		this.__initialize(parseInt(r,10)+this._r*this._priorScalingPower, parseInt(n,10)+this._n*this._priorScalingPower, 1);
	}
}