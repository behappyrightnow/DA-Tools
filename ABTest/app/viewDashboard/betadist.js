var BetaDist = (function () {
    function BetaDist(r, n, priorScalingPower) {
        if (priorScalingPower === void 0) { priorScalingPower = 1; }
        this.__initialize(r, n, priorScalingPower);
    }
    BetaDist.prototype.__initialize = function (r, n, priorScalingPower) {
        if (priorScalingPower === void 0) { priorScalingPower = 1; }
        this._priorScalingPower = priorScalingPower;
        this._alpha = Math.floor(r * this._priorScalingPower);
        this._beta = Math.floor(n * this._priorScalingPower - r * this._priorScalingPower);
        this._r = r;
        this._n = n;
        this._mean = this.mean(this._alpha, this._beta);
        this._variance = this.variance(this._alpha, this._beta);
        this.pdfSeries = this.makePDFSeries();
    };
    BetaDist.prototype.mean = function (alpha, beta) {
        return alpha / (alpha + beta);
    };
    BetaDist.prototype.variance = function (alpha, beta) {
        return (alpha * beta) / ((Math.pow(alpha + beta, 2)) * (1 + alpha + beta));
    };
    BetaDist.prototype.logGamma = function (n) {
        var arr = Array.from(Array(n).keys());
        return arr.reduce(function (sum, i) {
            return i === 0 ? sum : sum + Math.log(i);
        }, 0);
    };
    BetaDist.prototype.logB = function (alpha, beta) {
        return this.logGamma(alpha) + this.logGamma(beta) - this.logGamma(alpha + beta);
    };
    BetaDist.prototype.logPdf = function (x) {
        return x === 0 ? 0 : (this._alpha - 1) * Math.log(x) + (this._beta - 1) * Math.log(1 - x) - this.logB(this._alpha, this._beta);
    };
    BetaDist.prototype.pdf = function (x) {
        return x === 0 ? 0 : Math.exp(this.logPdf(x));
    };
    BetaDist.prototype.makePDFSeries = function () {
        var _this = this;
        var xValues = Array.from(Array(1000).keys()).map(function (x) { return x / 1000; });
        var answer = xValues.map(function (xValue, i) {
            return [xValue, _this.pdf(xValue)];
        });
        answer.push([1, 0]);
        return answer;
    };
    BetaDist.prototype.rescalePrior = function (newScalingPower) {
        this.__initialize(this._r, this._n, newScalingPower);
    };
    BetaDist.prototype.regenerate = function () {
        this.__initialize(this._r, this._n, this._priorScalingPower);
    };
    BetaDist.prototype.regenerateFromMean = function () {
        this._r = this._n * this._mean;
        this.__initialize(this._r, this._n, this._priorScalingPower);
    };
    BetaDist.prototype.clone = function () {
        return new BetaDist(this._r, this._n, this._priorScalingPower);
    };
    BetaDist.prototype.addResults = function (r, n) {
        this.__initialize(r + this._r * this._priorScalingPower, n + this._n * this._priorScalingPower, 1);
    };
    return BetaDist;
}());
//# sourceMappingURL=betadist.js.map