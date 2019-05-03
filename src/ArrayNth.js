/**
 * Extract every n-th element from an array.
 * @access public
 * @param {number[]} arr Input array.
 * @param {number} [size=1] Step size.
 * @param {number} [idx=0] Starting point.
 * @returns {number[]|void} Every n-th element.
 * @example ArrayNth( [ 1, 2, 3, 4, 5, 6], 2, 2 );
 * // returns [3, 5]
 */

function ArrayNth(arr, size, idx) {

    if (!Array.isArray(arr))
        return null;

    if (idx === undefined || idx < 0 || idx === null)
        idx = 0;

    if (size === undefined || size < 1 || size === null)
        size = 1;

    if ( !Number.isInteger(size) )
        return null;

    if ( !Number.isInteger(idx) )
        return null;

    if ( arr.length == 0 && (size > 1 || idx >0) )
        return null;

    var sliced = [];
    for (i = idx; i < arr.length; i = i + size) {
        sliced.push(arr[i]);
    }
    return sliced;
}

module.exports = ArrayNth;