/**
 * Get the minimum value from an array of numbers. The function fails
 * if the array is empty or has invalid values.
 * @access public
 * @function
 * @param {number[]} values numbers
 * @returns {number}
 * @example MathMIN([1,2,3,4.5]);
 * // returns 1
 */

function MathMIN(values) {
	var min = false;
	if (values && Array.isArray(values)) {
		for (i = 0; i < values.length; i++) {
			if(!Number(values[i]) && values[i] !== null && values[i] != 0)
				return parseFloat(Number(values[i]));
			if (!min)
				min = Number(values[i]);
			else if (Number(values[i]) < min)
				min = Number(values[i]);
		}
	}
	return parseFloat(min);
}

module.exports = MathMIN;
