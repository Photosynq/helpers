/**
 * The function transforms a given array by providing a second same length array, or a single number.
 * @access public
 * @function
 * @param {('add'|'subtract'|'multiply'|'divide'|'+'|'-'|'*'|'/'|'normToMin'|'normToMax'|'normToRange'|'normToIdx'|'normToVal'|'ma'|'sgf'|'abs'|'absorbance'|'absolute')} fn Available functions to transform the input array.
 * @param {number[]} a1 Input array.
 * @param {number|number[]} [a2] Second array or single number
 * @returns {number[]|string|void} Transformed array, a string with an error message or null
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
 * TransformTrace('sgf', [1,2,3,4,3,2,1,1]);
 * // returns [1.3333333333333333,1.9523809523809523]
 *
 * // Absorbance (abs) -log(I/I0)
 *
 * // In case no value is provided, I0 is the fist value from the array
 * TransformTrace('abs', [1.5, 2, 3, 4]);
 * // returns [-0, -0.12494, -0.30103, -0.42597]
 * 
 * TransformTrace('absorbance', [1.5, 2, 3, 4]);
 * // returns [-0, -0.12494, -0.30103, -0.42597]
 *
 * // The provided value is I0
 * TransformTrace('abs', [1.5, 2, 3, 4], 1);
 * // returns [-0.1761, -0.3010, -0.4771, -0.6021]
 * 
 * // Absolute numbers
 * TransformTrace('absolute', [1, -2, 3, -4]);
 * // returns [1, 2, 3, 4]
 * 
 */

function TransformTrace( fn, a1, a2 ) {

    // Available functions for transformation
    var fns = ['add','subtract','multiply','divide','+','-','*','/','normToMin','normToMax','normToRange','normToIdx','normToVal','ma','sgf','abs', 'absorbance', 'absolute'];
    var trace = [];
    var issue = null;

    // Making sure, the transformation method is available
    if( fn === undefined || fns.indexOf(fn) == -1)
        return 'Unknown Transformation';

    // Making sure the array to transform is an array
    else if( a1 === undefined || !Array.isArray(a1) )
        return 'Second parameter needs to be a number array';
    
    // Making sure the provided array is a number array
    else if( a1.findIndex(function(x){ return !Number(x);}) > -1 )
        return 'Provided array contains elements other than numbers';

    // Making sure, transformations with two parameters have correct inputs
    else if( ['add','subtract','multiply','divide','+','-','*','/'].indexOf(fn) > -1 ){
        
        // Second parameter needs to be a number or number array
        if( a2 === undefined || !Array.isArray(a2) && typeof a2 != 'number' )
            return 'Input for second parameter needs to be a number array or number';
        
            // Provided arrays have different sizes
        else if( Array.isArray(a2) && a1.length != a2.length )
            return 'Provided arrays have different sizes (a1 = '+a1.length+', a2 = '+a2.length+')';
        
            // Provided second array is not a number array
        else if( Array.isArray(a2) && a2.findIndex(function(x){ return !Number(x);}) > -1 )
            return 'The second array contains elements other than numbers';
    }

    // Making sure, transformations with number required as second parameter are not receiving arrays
    else if( ['normToIdx','normToVal'].indexOf(fn) > -1 && typeof a2 != 'number' )
        return 'This transformation requires the second parameter to be a number';

    // Making sure, absorbance transformation has a number or no parameter
    else if( ['abs','absorbance'].indexOf(fn) > -1 ) {
        if( a2 !== undefined && typeof a2 != 'number' )
            return 'This transformation requires the second parameter to be a number or left empty';
    }

    // Making sure, transformations with only one input are not returning an array with [undefined]
    else if( ['normToMin','normToMax','normToRange','ma','sgf','absolute'].indexOf(fn) > -1 && a2 !== undefined )
        return 'This transformation only allows one input parameter';

    // Make sure, the array to transform has a minimum length
    else if( ['sgf'].indexOf(fn) > -1 && a1.length <= 6 )
        return 'Array has to have a minimum length of 7 elements';

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
            if(fn == 'abs' || fn == 'absorbance'){
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

        if(fn == 'abs' || fn == 'absorbance'){
            trace = a1.map(function(a,i,arr){
                return ( - Math.log( (a / arr[0]) ) / Math.LN10 );
            });
        }

        if(fn == 'absolute'){
            trace = a1.map(function(a){
                return Math.abs(a);
            });
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
