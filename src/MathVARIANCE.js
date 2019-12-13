/**
 * Calculate the variance from an array of numbers. The function fails if the array is empty or has invalid values.
 * @access public
 * @param {number[]} values numbers
 * @returns {number}
 * @example MathVARIANCE([1,2,3,4.5]);
 * // returns 2.2292
 */

function MathVARIANCE(values) {
	var variance = false;
	var mean = false;
	var count = 0;
	if (values && Array.isArray(values)) {

		var check = values.some(function(el){
			return (!Number(el) && el !== null && el != 0)? true : false;
		});

		if(check || values.length == 0)
			return parseFloat(variance);

		values = values.filter(function(itm){
			return (itm === null || (!Number(itm) && itm != 0) ) ? false : true;
		});

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

		for (i = 0; i < values.length; i++) {
			variance += Math.pow((values[i] - mean), 2);
		}
		variance = (1 / (values.length - 1)) * variance;
	}
	return parseFloat(variance);
}

module.exports = MathVARIANCE;
