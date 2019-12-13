/**
 * Calculate the sum from an array of numbers. The function fails if the array is empty or has invalid values.
 * @access public
 * @param {number[]} values numbers
 * @returns {number}
 * @example MathSum([1,2,3,4.5]);
 * // returns 10.5
 */

function MathSUM(values) {
	var sum = false;
	if (values && Array.isArray(values)) {
		for (var i = 0, len = values.length; i < len; i++){
            if(values[i] === null)
                continue;
            if(!Number(values[i]) && values[i] != 0 ){
                sum = false;
                break;
            }
            sum += Number(values[i]);
        }
	}
	return parseFloat(sum);
}

module.exports = MathSUM;
