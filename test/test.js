/**
 * Test the math functions for the appropriate output
 */
const assert = require('assert');
const fs = require('fs');
// const tests = require('./tests.json');
const tests = require('./test-definitions.js');

/** Get the test environment */
var env;
for (var index in process.argv) {
    var str = process.argv[index];
    if (str.indexOf("--environment") == 0) {
        env = str.substr(14);
    }
}

// var pq = require('../index');

/** Include the functions here. We use require here, since we want the same conditions as on the server */
if(env == 'node/include')
    require('../include')();

/** Include the functions like in a standard node environment */
else if (env == 'node')
    var pq = require('../index');

/** Include the functions here. We use eval here, since we want the same conditions as in the apps */
else if (env == 'browser')
    eval(fs.readFileSync('./dist/math.js') + '');

/** Include the functions (minified) here. We use eval here, since we want the same conditions as in the apps */
else if (env == 'browser.min')
    eval(fs.readFileSync('./dist/math.min.js') + '');
else
    console.log('No environment selected. Use: --environment');


// Parse the expected value as string or stringified object
function expected(value){
	if(typeof value == 'object')
		return JSON.stringify(value);
	else
		return String(value);
}

/** Now run all the tests */
for (var fn in tests) {
	describe(fn, function () {
        tests[fn].forEach(function (test) {
			var res;

			if (fn == "ArrayNth"){
				if(test.args.length == 0 )
					res = (!pq)? ArrayNth() : pq.ArrayNth();
				if(test.args.length == 1 )
					res = (!pq)? ArrayNth(test.args[0]) : pq.ArrayNth(test.args[0]);
				if(test.args.length == 2 )
					res = (!pq)? ArrayNth(test.args[0],test.args[1]) : pq.ArrayNth(test.args[0],test.args[1]);
				if(test.args.length == 3 )
					res = (!pq)? ArrayNth(test.args[0],test.args[1],test.args[2]) : pq.ArrayNth(test.args[0],test.args[1],test.args[2]);
			}

			if (fn == "ArrayRange"){
				if(test.args.length == 0 )
					res = (!pq)? ArrayRange() : pq.ArrayRange();
				if(test.args.length == 1 )
					res = (!pq)? ArrayRange(test.args[0]) : pq.ArrayRange(test.args[0]);
				if(test.args.length == 2 )
					res = (!pq)? ArrayRange(test.args[0],test.args[1]) : pq.ArrayRange(test.args[0],test.args[1]);
				if(test.args.length == 3 )
					res = (!pq)? ArrayRange(test.args[0],test.args[1],test.args[2]) : pq.ArrayRange(test.args[0],test.args[1],test.args[2]);
				if(test.args.length == 4 )
					res = (!pq)? ArrayRange(test.args[0],test.args[1],test.args[2],test.args[3]) : pq.ArrayRange(test.args[0],test.args[1],test.args[2],test.args[3]);
			}

			if (fn == "ArrayUnZip")
				res = (!pq)? ArrayUnZip(test.args) : pq.ArrayUnZip(test.args);

			if (fn == "ArrayZip"){
				if(test.args.length == 0 )
					res = (!pq)? ArrayZip() : pq.ArrayZip();
				if(test.args.length == 1 )
					res = (!pq)? ArrayZip(test.args[0]) : pq.ArrayZip(test.args[0]);
				if(test.args.length == 2 )
					res = (!pq)? ArrayZip(test.args[0],test.args[1]) : pq.ArrayZip(test.args[0],test.args[1]);
			}

			if (fn == "GetIndexByLabel"){
				if(test.args.length == 0 )
					res = (!pq)? GetIndexByLabel() : pq.GetIndexByLabel();
				if(test.args.length == 1 )
					res = (!pq)? GetIndexByLabel(test.args[0]) : pq.GetIndexByLabel(test.args[0]);
				if(test.args.length == 2 )
					res = (!pq)? GetIndexByLabel(test.args[0],test.args[1]) : pq.GetIndexByLabel(test.args[0],test.args[1]);
				if(test.args.length == 3 )
					res = (!pq)? GetIndexByLabel(test.args[0],test.args[1],test.args[2]) : pq.GetIndexByLabel(test.args[0],test.args[1],test.args[2]);
			}

			if (fn == "GetLabelLookup")
				res = (!pq)? GetLabelLookup(test.args) : pq.GetLabelLookup(test.args);

			if (fn == "GetProtocolByLabel"){
				if(test.args.length == 0 )
					res = (!pq)? GetProtocolByLabel() : pq.GetProtocolByLabel();
				if(test.args.length == 1 )
					res = (!pq)? GetProtocolByLabel(test.args[0]) : pq.GetProtocolByLabel(test.args[0]);
				if(test.args.length == 2 )
					res = (!pq)? GetProtocolByLabel(test.args[0],test.args[1]) : pq.GetProtocolByLabel(test.args[0],test.args[1]);
				if(test.args.length == 3 )
					res = (!pq)? GetProtocolByLabel(test.args[0],test.args[1],test.args[2]) : pq.GetProtocolByLabel(test.args[0],test.args[1],test.args[2]);
			}

			if (fn == "MathLINREG"){
				if(test.args.length == 0)
					res = (!pq)? MathLINREG() : pq.MathLINREG();
				if(test.args.length == 1 )
					res = (!pq)? MathLINREG(test.args[0]) : pq.MathLINREG(test.args[0]);
				if(test.args.length == 2 )
					res = (!pq)? MathLINREG(test.args[0],test.args[1]) : pq.MathLINREG(test.args[0],test.args[1]);
			}

			if (fn == "MathLN")
				res = (!pq)? MathLN(test.args) : pq.MathLN(test.args);

			if (fn == "MathLOG")
				res = (!pq)? MathLOG(test.args) : pq.MathLOG(test.args);

			if (fn == "MathMAX")
				res = (!pq)? MathMAX(test.args) : pq.MathMAX(test.args);

			if (fn == "MathMEAN")
				res = (!pq)? MathMEAN(test.args) : pq.MathMEAN(test.args);

			if (fn == "MathMEDIAN")
				res = (!pq)? MathMEDIAN(test.args) : pq.MathMEDIAN(test.args);

			if (fn == "MathMIN")
				res = (!pq)? MathMIN(test.args) : pq.MathMIN(test.args);

			if (fn == "MathROUND"){
				res = (!pq)? MathROUND(test.args[0]) : pq.MathROUND(test.args[0]);
				if(test.args.length == 2)
					res = (!pq)? MathROUND(test.args[0], test.args[1]) : pq.MathROUND(test.args[0], test.args[1]);;
			}

			if (fn == "MathSTDERR")
				res = (!pq)? MathSTDERR(test.args) : pq.MathSTDERR(test.args);

			if (fn == "MathSTDEV")
				res = (!pq)? MathSTDEV(test.args) : pq.MathSTDEV(test.args);

			if (fn == "MathSTDEVS")
				res = (!pq)? MathSTDEVS(test.args) : pq.MathSTDEVS(test.args);

			if (fn == "MathSUM")
				res = (!pq)? MathSUM(test.args) : pq.MathSUM(test.args);

			if (fn == "MathVARIANCE")
				res = (!pq)? MathVARIANCE(test.args) : pq.MathVARIANCE(test.args);

			if (fn == "info"){
				if(test.args.length == 0)
					res = (!pq)? info() : pq.info();
				if(test.args.length == 1 )
					res = (!pq)? info(test.args[0]) : pq.info(test.args[0]);
				if(test.args.length == 2 )
					res = (!pq)? info(test.args[0],test.args[1]) : pq.info(test.args[0],test.args[1]);
			}

			if (fn == "warning"){
				if(test.args.length == 0)
					res = (!pq)? warning() : pq.warning();
				if(test.args.length == 1 )
					res = (!pq)? warning(test.args[0]) : pq.warning(test.args[0]);
				if(test.args.length == 2 )
					res = (!pq)? warning(test.args[0],test.args[1]) : pq.warning(test.args[0],test.args[1]);
			}

			if (fn == "danger"){
				if(test.args.length == 0)
					res = (!pq)? danger() : pq.danger();
				if(test.args.length == 1 )
					res = (!pq)? danger(test.args[0]) : pq.danger(test.args[0]);
				if(test.args.length == 2 )
					res = (!pq)? danger(test.args[0],test.args[1]) : pq.danger(test.args[0],test.args[1]);
			}

			if (fn == "NonLinearRegression")
				res = (!pq)? NonLinearRegression() : pq.NonLinearRegression();

			if (fn == "TransformTrace"){
				if(test.args.length == 0)
					res = (!pq)? TransformTrace() : pq.TransformTrace();
				if(test.args.length == 2 )
					res = (!pq)? TransformTrace(test.args[0]) : pq.TransformTrace(test.args[0]);
				if(test.args.length == 2 )
					res = (!pq)? TransformTrace(test.args[0],test.args[1]) : pq.TransformTrace(test.args[0],test.args[1]);
				if(test.args.length == 3 )
					res = (!pq)? TransformTrace(test.args[0],test.args[1],test.args[2]) : pq.TransformTrace(test.args[0],test.args[1],test.args[2]);
			}
			// Add new test to the pipeline
			it(`expect ${expected(test.expected)} when ${JSON.stringify(test.args)} is provided.`, function () {
				// Check if the expected and returned results are equal
				assert.deepStrictEqual( res, test.expected );
			});

        });
    });
}