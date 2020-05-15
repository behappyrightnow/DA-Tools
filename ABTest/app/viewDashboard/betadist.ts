class BetaDist {
	_alpha: number;
	_beta: number;
	_r: number;
	_n: number;
	_mean: number;
	_variance: number;
	_priorScalingPower: number;
	_posteriorScalingPower: number;
	pdfSeries: Array<Array<number>>;
	
    constructor(r: number, n: number, priorScalingPower: number = 1) {
        this.__initialize(r, n, priorScalingPower);
    }

    __initialize(r: number, n: number, priorScalingPower: number) {
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

	// logGamma sourced from https://www.math.ucla.edu/~tom/distributions/beta.html
	logGamma(Z:number): number {
		var S=1+76.18009173/Z-86.50532033/(Z+1)+24.01409822/(Z+2)-1.231739516/(Z+3)+.00120858003/(Z+4)-.00000536382/(Z+5);
		var LG= (Z-.5)*Math.log(Z+4.5)-(Z+4.5)+Math.log(S*2.50662827465);
		return LG;
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

	// betaIncomplete sourced from https://www.math.ucla.edu/~tom/distributions/beta.html
	betaIncomplete(X:number, A: number, B: number):number {
		var A0=0;
		var B0=1;
		var A1=1;
		var B1=1;
		var M9=0;
		var A2=0;
		var C9;
		while (Math.abs((A1-A2)/A1)>.00001) {
			A2=A1;
			C9=-(A+M9)*(A+B+M9)*X/(A+2*M9)/(A+2*M9+1);
			A0=A1+C9*A0;
			B0=B1+C9*B0;
			M9=M9+1;
			C9=M9*(B-M9)*X/(A+2*M9-1)/(A+2*M9);
			A1=A0+C9*A1;
			B1=B0+C9*B1;
			A0=A0/B1;
			B0=B0/B1;
			A1=A1/B1;
			B1=1;
		}
		return A1/A;
	}

	// cdf sourced from https://www.math.ucla.edu/~tom/distributions/beta.html
	cdf(x:number): number {
		var A = this._alpha;
		var B = this._beta;
		var S=A+B;
		var Betacdf=0;
		var BT=Math.exp(this.logGamma(S)-this.logGamma(B)-this.logGamma(A)+A*Math.log(x)+B*Math.log(1-x));
		if (x<(A+1)/(S+2)) {
			Betacdf=BT*this.betaIncomplete(x,A,B)
		} else {
			Betacdf=1-BT*this.betaIncomplete(1-x,B,A)
		}
		return Betacdf;
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

	addResults(r: string, n: string, posteriorScalingPower: number = 1) {
		this.__initialize(Math.floor(parseInt(r,10)/posteriorScalingPower)+this._r*this._priorScalingPower, Math.floor(parseInt(n,10)/posteriorScalingPower)+this._n*this._priorScalingPower, 1);
	}
}