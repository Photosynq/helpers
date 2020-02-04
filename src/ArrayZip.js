/**
 * This function transforms two arrays into one array of x,y pairs
 * Both arrays supplied need to have the same size.
 * @access public
 * @function
 * @param {number[]} x values.
 * @param {number[]} y values.
 * @returns {number[]|void} [ [x1,y1], [x2,y2], ..., [xn,yn] ].
 * @example var x = [1, 2, 3];
 * var y = [4, 5, 6];
 * ArrayZip(x,y)
 * //returns [ [1, 4], [2, 5], [3, 6] ]
 */

function ArrayZip(x,y){
    // check both inputs
    if(x === undefined || y === undefined || !Array.isArray(x) || !Array.isArray(y) || x.length != y.length)
        return null;

    var arr = [];
    for(var i=0,len=x.length; i<len; i++){
        arr.push([x[i],y[i]]);
    }
    return arr;
}

module.exports = ArrayZip;
