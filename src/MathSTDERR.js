/**
 * Calculate the standard error from an array of numbers. The function fails, if the array is empty or has invalid values.
 * @access public
 * @param {number[]} values numbers
 * @returns {number}
 * @example MathSTDERR([1,2,3,4.5]);
 * // returns 0.6465050270492876
 */

function MathSTDERR(values) {
	var stderr = false;
	if (values && Array.isArray(values)) {

		var check = values.some(function(el){
			return (!Number(el) && el !== null && el != 0)? true : false;
		});

		if(check)
			return parseFloat(stderr);

		if (values.length > 2) {
			var mean = false;
			var count = 0;
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

			var tmp = [];
			var sum = false;
			for (i = 0, len = values.length; i < len; i++){
				if(values[i] === null)
					continue;
				var val = Math.pow((values[i] - mean), 2);
				sum += val;
				tmp.push(val);
			}
			stdev = Math.sqrt(sum / count);

			stderr = stdev / Math.sqrt(count);
		}
	}
	return parseFloat(stderr);
}

module.exports = MathSTDERR;
