/**
 * Calculate the variance from an array of numbers. The function fails if the array is empty or has invalid values.
 * @access public
 * @function
 * @param {number[]} values numbers
 * @returns {number}
 * @example MathSTDEV([1,2,3,4.5]);
 * // returns 1.2930100540985752
 */

function MathSTDEV(values) {
	var stdev = false;
	if (values && Array.isArray(values)) {

		var check = values.some(function(el){
			return (!Number(el) && el !== null && el != 0)? true : false;
		});

		if(check)
			return parseFloat(stdev);

		values = values.filter(function(itm){
			return (itm === null || (!Number(itm) &&  itm != 0)) ? false : true;
		});

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
				var val = Math.pow((values[i] - mean), 2);
				sum += val;
				tmp.push(val);
			}
			stdev = Math.sqrt(sum / values.length);
		}
	}
	return parseFloat(stdev);
}

module.exports = MathSTDEV;
