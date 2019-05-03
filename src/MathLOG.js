/**
 * Returns the logarithm (base 10) of a number.
 * @access public
 * @param {number} value
 * @returns {number}
 * @example MathLOG(10);
 * // returns 1
 */

function MathLOG(value) {
	var val = false;
	if (value) {
		val = Math.log(value) / Math.LN10;
	}
	return parseFloat(val);
}

module.exports = MathLOG;
