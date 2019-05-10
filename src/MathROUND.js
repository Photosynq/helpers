/**
 * Calculate the variance from an array of numbers. The function fails, if the array is empty or has invalid values.
 * @access public
 * @param {number} value
 * @param {number} [digets=2] number of digits
 * @returns {number}
 * @example MathROUND(1.23456789, 5);
 * // returns 1.2346
 */

function MathROUND(value, digets) {
	digets = typeof digets !== 'undefined' ? digets : 2;
	var val = false;

	if (value === null || typeof value == 'object' || value === '') {
		return parseFloat(val);
	}

	if (Number(value) == 0) {
		return 0;
	}

	if (value && parseInt(digets) >= 0) {
		val = Math.round(Number(value) * Math.pow(10, digets)) / Math.pow(10, digets);
	}
	return parseFloat(val);
}

module.exports = MathROUND;
