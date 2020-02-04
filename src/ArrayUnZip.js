/**
 * This function transforms an array of [x, y] pairs into an object with an array of x and an array of y values
 * @access public
 * @function
 * @param {array[]} input Array of [x, y] pairs.
 * @returns {object|void} { x: [x1, x2, ..., xn], y: [y1, y2, ..., yn] }
 * @example ArrayUnZip( [ [1, 4], [2, 5], [3, 6] ] );
 * //returns {x: [1, 2, 3], y: [4, 5, 6]}
 */

function ArrayUnZip(input){
    // check both inputs
    if(input === undefined || input.length == 0 || !Array.isArray(input) || !Array.isArray(input[0]))
        return null;

    var arrays = {x: [], y: []};
    for(var i=0,len=input.length; i<len; i++){
        arrays.x.push(input[i][0] || null);
        arrays.y.push(input[i][1] || null);
    }
    return arrays;
}

module.exports = ArrayUnZip;
