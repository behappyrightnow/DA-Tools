;
var BetaDist = (function () {
    function BetaDist(r, n, priorScalingPower) {
        if (priorScalingPower === void 0) { priorScalingPower = 1; }
        this.__initialize(r, n, priorScalingPower);
    }
    BetaDist.prototype.__initialize = function (r, n, priorScalingPower) {
        this._priorScalingPower = priorScalingPower;
        this._alpha = r * this._priorScalingPower;
        this._beta = n * this._priorScalingPower - r * this._priorScalingPower;
        this._r = r;
        this._n = n;
        this._mean = this.mean(this._alpha, this._beta);
        this._variance = this.variance(this._alpha, this._beta);
        this.pdfSeries = this.makePDFSeries();
        this.cdfTable = this.makeCdfTable();
    };
    BetaDist.prototype.mean = function (alpha, beta) {
        return alpha / (alpha + beta);
    };
    BetaDist.prototype.variance = function (alpha, beta) {
        return (alpha * beta) / ((Math.pow(alpha + beta, 2)) * (1 + alpha + beta));
    };
    BetaDist.prototype.logGamma = function (Z) {
        var S = 1 + 76.18009173 / Z - 86.50532033 / (Z + 1) + 24.01409822 / (Z + 2) - 1.231739516 / (Z + 3) + .00120858003 / (Z + 4) - .00000536382 / (Z + 5);
        var LG = (Z - .5) * Math.log(Z + 4.5) - (Z + 4.5) + Math.log(S * 2.50662827465);
        return LG;
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
    BetaDist.prototype.betaIncomplete = function (X, A, B) {
        var A0 = 0;
        var B0 = 1;
        var A1 = 1;
        var B1 = 1;
        var M9 = 0;
        var A2 = 0;
        var C9;
        while (Math.abs((A1 - A2) / A1) > .00001) {
            A2 = A1;
            C9 = -(A + M9) * (A + B + M9) * X / (A + 2 * M9) / (A + 2 * M9 + 1);
            A0 = A1 + C9 * A0;
            B0 = B1 + C9 * B0;
            M9 = M9 + 1;
            C9 = M9 * (B - M9) * X / (A + 2 * M9 - 1) / (A + 2 * M9);
            A1 = A0 + C9 * A1;
            B1 = B0 + C9 * B1;
            A0 = A0 / B1;
            B0 = B0 / B1;
            A1 = A1 / B1;
            B1 = 1;
        }
        return A1 / A;
    };
    BetaDist.prototype.cdf = function (x) {
        var A = this._alpha;
        var B = this._beta;
        var S = A + B;
        var Betacdf = 0;
        var BT = Math.exp(this.logGamma(S) - this.logGamma(B) - this.logGamma(A) + A * Math.log(x) + B * Math.log(1 - x));
        if (x < (A + 1) / (S + 2)) {
            Betacdf = BT * this.betaIncomplete(x, A, B);
        }
        else {
            Betacdf = 1 - BT * this.betaIncomplete(1 - x, B, A);
        }
        return Betacdf;
    };
    BetaDist.prototype.makeCdfTable = function () {
        var cdfTable = new Array();
        for (var i = 0; i < 1000; i++) {
            var x = i / 1000;
            var p = this.cdf(x);
            cdfTable.push({ probability: p, value: x });
        }
        cdfTable.sort(function (a, b) {
            if (a.value < b.value) {
                return -1;
            }
            if (a.value > b.value) {
                return 1;
            }
            return 0;
        });
        return cdfTable;
    };
    BetaDist.prototype.cdfInverse = function (probability) {
        var answer = undefined;
        for (var i = 0; i < this.cdfTable.length - 1 && answer === undefined; i++) {
            var firstDiff = probability - this.cdfTable[i].probability;
            var secondDiff = probability - this.cdfTable[i + 1].probability;
            if (firstDiff >= 0 && secondDiff < 0) {
                if (Math.abs(firstDiff) > Math.abs(secondDiff)) {
                    answer = this.cdfTable[i + 1].value;
                }
                else {
                    answer = this.cdfTable[i].value;
                }
            }
        }
        return answer;
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
    BetaDist.prototype.addResults = function (r, n, posteriorScalingPower) {
        if (posteriorScalingPower === void 0) { posteriorScalingPower = 1; }
        this.__initialize(parseInt(r, 10) / posteriorScalingPower + this._r * this._priorScalingPower, parseInt(n, 10) / posteriorScalingPower + this._n * this._priorScalingPower, 1);
    };
    return BetaDist;
}());
//# sourceMappingURL=betadist.js.map