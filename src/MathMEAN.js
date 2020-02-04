/**
 * Calculate the mean from an array of numbers. The function fails
 * if the array is empty or has invalid values.
 * @access public
 * @function
 * @param {number[]} values numbers
 * @returns {number}
 * @example MathMEAN([1,2,3,4.5]);
 * // returns 2.625
 */

function MathMEAN(values) {
	var mean = false;
	var count = 0;
	if (values && Array.isArray(values)) {
		for (var i = 0, len = values.length; i < len; i++){
			if(values[i] === null)
				continue;
			else if(!Number(values[i]) && values[i] !== null && values[i] != 0)
				return parseFloat(!Number(values[i]));
			else{
				mean += Number(values[i]);
				count++;
			}
		}
		mean /= count;
	}
	return parseFloat(mean);
}

module.exports = MathMEAN;
