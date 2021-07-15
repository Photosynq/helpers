/**
 * The function transforms a given array by providing a second same length array, or a single number.
 * @access public
 * @function
 * @param {('add'|'subtract'|'multiply'|'divide'|'+'|'-'|'*'|'/'|'normToMin'|'normToMax'|'normToRange'|'normToIdx'|'normToVal'|'ma'|'sgf'|'abs')} fn Available functions to transform the input array.
 * @param {number[]} a1 Input array.
 * @param {number|number[]} [a2] Second array or single number
 * @returns {number[]|void} Transformed array or null
 * @example TransformTrace('subtract', [1, 2, 3, 4], [0, 1, 2, 1]);
 * // returns [1, 1, 1, 3]
 *
 * TransformTrace('add', [1, 2, 3, 4], [0, 1, 2, 1]);
 * // returns [1, 3, 5, 5]
 *
 * TransformTrace('add', [1, 2, 3, 4], 5);
 * // returns [6, 7, 8, 9]
 *
 * TransformTrace('normToMin', [1.5, 2, 3, 4]);
 * // returns [1, 1.3333, 2, 2.6665]
 *
 * TransformTrace('normToMax', [1.5, 2, 3, 4]);
 * // returns [0.375, 0.5, 0.75, 1]
 *
 * TransformTrace('normToRange', [1.5, 2, 3, 4]);
 * // returns [0, 0.2, 0.6, 1]
 *
 * TransformTrace('normToIdx', [1.5, 2, 3, 4], 1);
 * // returns [0.75, 1, 1.5, 2]
 *
 * TransformTrace('normToVal', [1, 2, 3, 4], 2);
 * // returns [0.75, 1, 1.5, 2]
 *
 * // Smoothing (ma= Moving average, sgf= Savitzky-Golay filter)
 *
 * TransformTrace('ma', [1.5, 2, 3, 4]);
 * // returns [1.6667, 2.1665, 3, 3.6665]
 *
 * TransformTrace('sgf', [1, 2, 3, 4]);
 * // returns [6, 7, 8, 9]
 *
 * // Absorbance (abs) -log(I/I0)
 *
 * // In case no value is provided, I0 is the fist value from the array
 * TransformTrace('abs', [1.5, 2, 3, 4]);
 * // returns [-0, -0.12494, -0.30103, -0.42597]
 *
 * // The provided value is I0
 * TransformTrace('abs', [1.5, 2, 3, 4], 1);
 * // returns [-0.1761, -0.3010, -0.4771, -0.6021]
 */

function TransformTrace( fn, a1, a2 ) {

    // Available functions for transformation
    var fns = ['add','subtract','multiply','divide','+','-','*','/','normToMin','normToMax','normToRange','normToIdx','normToVal','ma','sgf','abs'];
    var trace = [];
    var issue = null;

    // Making sure user input meets minimum requirements
    if( fn === undefined || fns.indexOf(fn) == -1 || a1 === undefined || !Array.isArray(a1) )
        return 'Unknown Function';

    // Making sure input for a2 is a valid array
    if( a2 !== undefined && Array.isArray(a2) && a1.length != a2.length )
        return 'Arrays have different sizes (a1 = '+a1.length+', a2 = '+a2.length+')';

    // Making sure input for a2 is a number otherwise
    else if( a2 !== undefined && !Array.isArray(a2) && typeof a2 != 'number' )
        return 'Input for third parameter needs to be an array or number';

    if(typeof a2 == 'number'){
        trace = a1.map(function(a){
            if(fn == 'add' || fn == '+'){
                return a + a2;
            }
            if(fn == 'subtract' || fn == '-'){
                return a - a2;
            }
            if(fn == 'multiply' || fn == '*'){
                return a * a2;
            }
            if(fn == 'divide' || fn == '/' || fn == 'normToVal'){
                return a / a2;
            }
            if(fn == 'normToIdx'){
                return a / a1[a2];
            }
            if(fn == 'abs'){
                return ( - Math.log( ( a / a2) ) / Math.LN10 );
            }
        });
    }

    else if(a2 === undefined){
        if(fn == 'normToMin'){
            var min = Math.min.apply(Math, a1);
            trace = a1.map(function(a){
                return a / min;
            });
        }
        if(fn == 'normToMax'){
            var max = Math.max.apply(Math, a1);
            trace = a1.map(function(a){
                return a / max;
            });
        }

        if(fn == 'normToRange'){
            var min = Math.min.apply(Math, a1);
            var max = Math.max.apply(Math, a1);
            trace = a1.map(function(a){
                return ((a - min) / (max - min));
            });
        }

        if(fn == 'ma'){
            var tmp = [];
            // We have to extend the trace by one on each side to calculate the points in the beginning
            a1.unshift(a1[0]);
            a1.push(a1[a1.length - 1]);
            for (var i = 1, len = a1.length; i < len - 1; i++) {
                tmp.push((a1[i] + a1[i - 1] + a1[i + 1]) / 3);
            }
            trace = tmp;
        }

        if(fn == 'sgf'){
            var len = a1.length;
            var beg0 = a1[0];
            var beg1 = a1[1];
            var beg2 = a1[2];

            var end0 = a1[len - 1];
            var end1 = a1[len - 2];
            var end2 = a1[len - 3];

            var tmp = [];
            a1.unshift(beg2, beg1, beg0);
            a1.push(end0, end1, end2);
            for (var i = 3; i < len - 3; i++) {
                tmp.push( (-2 * a1[i - 3] + 3 * a1[i - 2] + 6 * a1[i - 1] + 7 * a1[i] + 6 * a1[i + 1] + 3 * a1[i + 2] + -2 * a1[i + 2]) / 21 );
            }
            trace = tmp;
        }

        if(fn == 'abs'){
            for (var i in a1)
                trace.push( ( - Math.log( (a1[i] / a1[0]) ) / Math.LN10 ) );
        }
    }

    }

    else if( Array.isArray(a2) ){
        trace = a1.map(function(a,idx){
            if(fn == 'add' || fn == '+'){
                return a + a2[idx];
            }
            if(fn == 'subtract' || fn == '-'){
                return a - a2[idx];
            }
            if(fn == 'multiply' || fn == '*'){
                return a * a2[idx];
            }
            if(fn == 'divide' || fn == '/'){
                return a / a2[idx];
            }
        });
    }
    else{
        return null;
    }

    return issue ? null : trace;
}

module.exports = TransformTrace;
