var BetaDist = (function () {
    function BetaDist(r, n, priorScalingPower) {
        if (priorScalingPower === void 0) { priorScalingPower = 1; }
        this.__initialize(r, n, priorScalingPower);
    }
    BetaDist.prototype.__initialize = function (r, n, priorScalingPower) {
        if (priorScalingPower === void 0) { priorScalingPower = 1; }
        this._priorScalingPower = priorScalingPower;
        this._α = r * this._priorScalingPower;
        this._β = n * this._priorScalingPower - r * this._priorScalingPower;
        this._r = r;
        this._n = n;
        this._mean = this.mean(this._α, this._β);
        this._variance = this.variance(this._α, this._β);
        this.pdfSeries = this.makePDFSeries();
    };
    BetaDist.prototype.mean = function (α, β) {
        return α / (α + β);
    };
    BetaDist.prototype.variance = function (α, β) {
        return (α * β) / ((Math.pow(α + β, 2)) * (1 + α + β));
    };
    BetaDist.prototype.logGamma = function (n) {
        var arr = Array.from(Array(n).keys());
        return arr.reduce(function (sum, i) {
            return i === 0 ? sum : sum + Math.log(i);
        }, 0);
    };
    BetaDist.prototype.logB = function (α, β) {
        return this.logGamma(α) + this.logGamma(β) - this.logGamma(α + β);
    };
    BetaDist.prototype.logPdf = function (x) {
        return x === 0 ? 0 : (this._α - 1) * Math.log(x) + (this._β - 1) * Math.log(1 - x) - this.logB(this._α, this._β);
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
    return BetaDist;
}());
//# sourceMappingURL=betadist.js.map