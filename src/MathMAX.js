/**
 * Get the maximum value from an array of numbers. The function fails
 * if the array is empty or has invalid values.
 * @access public
 * @function
 * @param {number[]} values numbers
 * @returns {number}
 * @example MathMAX([1,2,3,4.5]);
 * // returns 4.5
 */

function MathMAX(values) {
	var max = false;
	if (values && Array.isArray(values)) {
		for (i = 0; i < values.length; i++) {
			if(!Number(values[i]) && values[i] !== null && values[i] != 0)
				return parseFloat(Number(values[i]));
			if (!max)
				max = Number(values[i]);
			else if (Number(values[i]) > max)
				max = Number(values[i]);
		}
	}
	return parseFloat(max);
}

module.exports = MathMAX;
