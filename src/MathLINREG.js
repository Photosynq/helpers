/**
 * Function to perform a simple linear regression (y = mx +b), returning slope, y-intercent, 
 * correlation coefficient (R) and coefficient of determination (R²).
 * @access public
 * @param {number[]} x x-values
 * @param {number[]} y y-values
 * @returns {object} Linear regression results
 * @example MathLINREG([60,61,62,63,65], [3.1,3.6,3.8,4,4.1]);
 * // returns {
 * // 	"m": 0.188,    // slope
 * // 	"b": -7.964,   // y intercept
 * // 	"r": 0.912,    // correlation coefficient
 * // 	"r2": 0.832    // coefficient of determination
 * }
 */

function MathLINREG(x, y) {
	var regression = false;

	// calculate number of points
	var xn = x.length;
	var yn = y.length;

	if (xn == yn) {
		// Calculate Sums
		var xSum = MathSUM(x);
		var ySum = MathSUM(y);

		var xxSum = 0;
		var xySum = 0;
		var yySum = 0;

		for (var i = 0; i < xn; i++) {
			xySum += (x[i] * y[i]);
			xxSum += (x[i] * x[i]);
			yySum += (y[i] * y[i]);
		}

		// calculate slope
		var m = ((xn * xySum) - (xSum * ySum)) / ((xn * xxSum) - (xSum * xSum));

		// calculate intercept
		var b = (ySum - (m * xSum)) / xn;

		// calculate r
		var r = (xySum - ((1 / xn) * xSum * ySum)) / Math.sqrt(((xxSum) - ((1 / xn) * (Math.pow(xSum, 2)))) * ((yySum) - ((1 / xn) * (Math.pow(ySum, 2)))));

		regression = {
			'm': m,
			'b': b,
			'r': r,
			'r2': (r * r)
		};
	}
	return regression;
}

const MathSUM = require('./MathSUM');

module.exports = MathLINREG;
