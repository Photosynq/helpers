/**
 * This is a flexible function to generate an array of arithmetic progressions.
 * All arguments must be integers.
 * @access public
 * @param {number} [start=0] Start value.
 * @param {number} stop Stop value.
 * @param {number} [step=1] Step size.
 * @param {('none'|'log'|'ln'|'x2')} [transform="none"] Generate a progression and transform numbers.
 * @returns {number[]|void}
 * @example ArrayRange(10);
 * // returns [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 *
 * ArrayRange(1,11);
 * // returns [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *
 * ArrayRange(0, 30, 5);
 * // returns [0, 5, 10, 15, 20, 25]
 *
 * ArrayRange(0, 10, 3);
 * // returns [0, 3, 6, 9]
 *
 * ArrayRange(0, 10, 3, "x2");
 * // returns [0, 9, 36, 81]
 *
 * ArrayRange(0, -10, -1);
 * // returns [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
 *
 * ArrayRange(0);
 * // returns []
 *
 * ArrayRange(1,0);
 * // returns []
 */

function ArrayRange(start, stop, step, transform) {

    if(start === undefined || typeof start != 'number')
        return null;

    if(stop === undefined){
        stop = start;
        start = 0;
    }
    if(typeof stop != 'number')
        return null;

    if(step === undefined || step === null)
        step = 1;

    if(typeof step != 'number' || step == 0)
        return null;

    if(transform === undefined)
        transform = 'none';

    if(['none','log','ln','x2'].indexOf(transform) == -1)
        return null;

    var arr = [];

    while (step > 0 ? stop > start : stop < start) {
        if(transform == 'none')
            arr.push(start);
        if(transform == 'log')
            arr.push( Math.log(start) / Math.LN10);
        if(transform == 'ln')
            arr.push( Math.log(start) );
        if(transform == 'x2')
            arr.push( Math.pow(start, 2) );
        start += step;
    }
    return arr;
}

module.exports = ArrayRange;
