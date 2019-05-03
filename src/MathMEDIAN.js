/**
 * Calculate the median from an array of numbers. The function fails,
 * if the array is empty or has invalid values.
 * @access public
 * @param {number[]} values numbers
 * @returns {number}
 * @example MathMEDIAN([1,2,3,4.5]);
 * // returns 2.5
 */

function MathMEDIAN(values) {
	var val = false;
	if (values && Array.isArray(values)) {

		var check = values.some(function(el){
			return (!Number(el) && el !== null && el != 0)? true : false;
		});

		if(check)
			return parseFloat(val);

		values = values.filter(function(itm){
			return (itm === null || (!Number(itm) && itm != 0)) ? false : true;
		});

		// Sort values
		values.sort(function (a, b) {
			if (a < b) //sort string ascending
				return -1;
			if (a > b) return 1;
			return 0; //default return value (no sorting)
		});

		var n = values.length;
		// Even
		if ((n % 2 == 0)) {
			val = (Number(values[(n / 2) - 1]) + Number(values[(n / 2)])) / 2;
		}
		// Odd
		if ((Math.abs(n) % 2 == 1)) {
			val = values[Math.floor((n / 2))];
		}
	}
	return parseFloat(val);
}

module.exports = MathMEDIAN;
