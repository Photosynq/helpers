/**
 * Returns the natural logarithm (base E) of a number.
 * @access public
 * @function
 * @param {number} value
 * @returns {number}
 * @example MathLN(10);
 * // returns 2.302585092994046
 */

function MathLN(value) {
	var val = false;
	if (value) {
		val = Math.log(value);
	}
	return parseFloat(val);
}

module.exports = MathLN;
