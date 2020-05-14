var BetaDist = (function () {
    function BetaDist(mean, variance) {
        this._α = this.α(mean, variance);
        this._β = this.β(mean, variance);
        this._r = this.r(this._α, this._β);
        this._n = this.n(this._α, this._β);
        this.pdfSeries = this.makePDFSeries();
    }
    BetaDist.prototype.α = function (mean, variance) {
        return Math.floor(mean * (mean * (1 - mean) / variance - 1));
    };
    BetaDist.prototype.β = function (mean, variance) {
        return Math.floor((1 - mean) * (mean * (1 - mean) / variance - 1));
    };
    BetaDist.prototype.r = function (α, β) {
        return α;
    };
    BetaDist.prototype.n = function (α, β) {
        return α + β;
    };
    BetaDist.prototype.logGamma = function (n) {
        var arr = Array.from(Array(Math.floor(n)).keys());
        return arr.reduce(function (sum, i) {
            return i === 0 ? sum : sum + Math.log(i);
        }, 0);
    };
    BetaDist.prototype.logB = function (α, β) {
        return this.logGamma(α) + this.logGamma(β) - this.logGamma(α + β);
    };
    BetaDist.prototype.logPdf = function (x) {
        return (this._α - 1) * Math.log(x) + (this._β - 1) * Math.log(1 - x) - this.logB(this._α, this._β);
    };
    BetaDist.prototype.pdf = function (x) {
        return Math.exp(this.logPdf(x));
    };
    BetaDist.prototype.makePDFSeries = function () {
        var _this = this;
        var xValues = Array.from(Array(1000).keys()).map(function (x) { return x / 1000; });
        return xValues.map(function (xValue) {
            return [xValue, _this.pdf(xValue)];
        });
    };
    return BetaDist;
}());
//# sourceMappingURL=betadist.js.map