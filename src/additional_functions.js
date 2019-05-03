// Functions as shown below have been developed based of Numeric or
// taken from Numeric (https://github.com/sloisel/numeric). See the
// licence in ./rescources/Numeric-LICENCE.md

/**
 * Multiple Linear Regression
 * @access public
 * @param {array[]} input_raw Array of x,y value pairs arrays [ [ [x1,y1], [x2,y2], ..., [xn,yn] ], [ [x1,y1], [x2,y2], ..., [xn,yn] ] ]
 * @returns {object} Returns rsquared, slopes and points
 * @example MathEXPINVREG( [ [ [x1,y1], [x2,y2], ..., [xn,yn] ], [ [x1,y1], [x2,y2], ..., [xn,yn] ] ] );
 * // returns
 * {
 *   "rsquared": rSq,
 *   "slopes": [slope1, ...],
 *   "points": [ [x1, x2, ..., xn], [y1, y2, ..., yn] ]
 * }
 */
function MathMULTREG(input_raw) {

	if(input_raw === undefined || !Array.isArray( input_raw ))
        return null;

	//do some basic transforms on the data to get it to useable form
	var numPredictors = input_raw[0].length - 1;
	var input = [];

	for (var i = 0; i < input_raw[0].length; i++) {
		var temp = [];
		for (var j = 0; j < input_raw.length; j++) {
			temp.push(input_raw[j][i]);
		}
		input.push(temp);
	}


	var x = [];
	var ones = [];
	for (i = 0; i < input[0].length; i++) {
		ones.push(1);
	}

	x.push(ones);
	var retX = [];
	for (i = 0; i < numPredictors; i++) {
		x.push(input[i]);
		retX.push(input[i]);
	}

	var y = input[numPredictors];

	//do the actual fit
	x = transpose(x);

	var qr = QRDecomp(x);

	var results = dot(inv(qr.R), dot(transpose(qr.Q), y));

	//calculate the rsquared value
	var sum = 0;
	for (i = 0; i < y.length; i++) {
		sum += y[i];
	}

	var responseAvg = sum / y.length;

	var yHat = [];

	for (i = 0; i < y.length; i++) {
		var yTemp = 0;
		for (j = 0; j < numPredictors; j++) {
			yTemp += results[j + 1] * x[i][j + 1];
		}
		yTemp += results[0];
		yHat.push(yTemp);
	}

	var SSM = 0;
	var SSTO = 0;

	for (i = 0; i < y.length; i++) {
		SSM += ((yHat[i] - responseAvg) * (yHat[i] - responseAvg));
		SSTO += ((y[i] - responseAvg) * (y[i] - responseAvg));
	}

	var rSq = SSM / SSTO;

	return {
		"rsquared": rSq,
		"slopes": results,
		"points": [retX, yHat]
	};

}

module.exports.MathMULTREG = MathMULTREG;

/**
 * Fit exponential decay to Y = Y0 + Ae^(-x/t)
 * A and t are the fitted variables, the provided input array needs to be an array of x,y pairs.
 * @access public
 * @param {array[]} input_raw Input x,y value pairs [ [x1,y1], [x2,y2], ..., [xn,yn] ].
 * @returns {object} Results from fit including points, values for A and t, error, asymptote, rsquared, lifetime, slope
 * @example MathEXPINVREG( [ [x1,y1], [x2,y2], ..., [xn,yn] ] );
 * // returns
 * {
 *   "points": [ [x1,y1], [x2,y2], ..., [xn,yn] ],
 * 	 "results": [A, t],
 * 	 "error": yError,
 *   "asymptote": asymptote,
 *   "rsquared": linReg.rsquared,
 *   "lifetime": lifetime,
 * 	 "slope": slope
 * }
 */
function MathEXPINVREG(input_raw) {

	if(input_raw === undefined || !Array.isArray( input_raw ))
        return null;

	//calculate the approximate asymptote
	var y = [];
	for (i = 0; i < input_raw.length; i++) {
		y.push(input_raw[i][1]);
	}

	//trapezoidal riemann sum assuming spaced evenly
	var riemann = 0;
	var riemannSq = 0;
	for (i = 0; i < y.length - 1; i++) {
		temp = (y[i] + y[i + 1]) / 2;
		riemann += temp;
		temp = (Math.pow(y[i], 2) + Math.pow(y[i + 1], 2)) / 2;
		riemannSq += temp;
	}

	var asymptote = (riemannSq - riemann * (y[0] + y[y.length - 1]) / 2) /
		(riemann - y.length * (y[0] + y[y.length - 1]) / 2);

	//calculate with linear regression on the linear equation ln(Y) = ln(A) - x/t
	var input_transformed = clone(input_raw);
	for (var i = 0; i < input_raw.length; i++) {
		temp = input_raw[i][1] - asymptote;
		if (temp < 0) {
			temp = -1 * temp;
		}
		input_transformed[i][1] = MathLN(temp);
	}



	var constants = [0.5];

	var t2 = 50;
	var t2_old;
	var t, A;
	for (i = 0; i < 10; i++) {

		if (t2 < 2) {
			t = -999999;
			A = 0;
			break;
		}

		t2_old = t2;
		var linReg = MathMULTREG(input_transformed.slice(0, t2));

		t2 = MathROUND((-1 / linReg.slopes[1]) * constants[0], 0);
		if (i == 9) {
			t2 = (t2 > t2_old) ? t2 : t2_old;
			linReg = MathMULTREG(input_transformed.slice(0, t2));
		}

		t = linReg.slopes[1];
		A = Math.pow(Math.E, linReg.slopes[0]);

	}



	var points = [];
	for (i = 0; i < input_raw.length; i++) {
		var temp = [];
		temp.push(input_raw[i][0]);
		temp.push(A * Math.pow(Math.E, input_raw[i][0] * t) + asymptote);
		points.push(temp);
	}

	var yError = 0;
	for (i = 0; i < input_raw.length; i++) {
		yError += Math.pow(A * Math.pow(Math.E, input_raw[i][0] * t) - input_raw[i][1] + asymptote, 2);
	}

	yError /= input_raw.length - 1;

	var lifetime = (-1 / t);
	var slope = -1 * A * t;

	return {
		points: points,
		results: [A, t],
		error: yError,
		asymptote: asymptote,
		rsquared: linReg.rsquared,
		lifetime: lifetime,
		slope: slope
	};
}

module.exports.MathEXPINVREG = MathEXPINVREG;

/**
 * Polynomial fit to y = a0 + a1x + a2x^2 + a3x^3....
 * @access public
 * @param {array[]} input_raw Array of x,y value pairs arrays [ [ [x1,y1], [x2,y2], ..., [xn,yn] ], [ [x1,y1], [x2,y2], ..., [xn,yn] ] ]
 * @param {degree} size degree.
 * @returns {object} Returns points, slopes and error
 * @example MathPOLYREG( [ [ [x1,y1], [x2,y2], ..., [xn,yn] ], [ [x1,y1], [x2,y2], ..., [xn,yn] ] ], degree );
 * // returns
 * {
 *   "points": points,
 *   "slopes": slopes,
 *   "error": yError
 * }
 */
function MathPOLYREG(input_raw, degree) {
	var transformed_nums = [];
	for (var i = 0; i < input_raw.length; i++) {
		var temp = [];
		for (var j = 1; j < degree + 1; j++) {
			temp.push(Math.pow(input_raw[i][0], j))
		}
		temp.push(input_raw[i][1]);
		transformed_nums.push(temp);
	}

	var polyReg = MathMULTREG(transformed_nums);

	var slopes = polyReg.slopes;

	var points = [];
	var yError = 0;
	for (i = 0; i < input_raw.length; i++) {
		temp = [];
		var yHat = 0;
		temp.push(input_raw[i][0]);
		for (j = 0; j < degree + 1; j++) {
			yHat += (Math.pow(input_raw[i][0], degree) * slopes[j]);
		}
		temp.push(yHat);
		points.push(temp);

		yError += Math.pow((yHat - input_raw[i][1]), 2);
	}

	yError /= input_raw.length - 1;

	return {
		"points": points,
		"slopes": slopes,
		"error": yError
	};

}

module.exports.MathPOLYREG = MathPOLYREG;

// helper functions for the functions above

//intended for vectors of equal size
function subVV(vec1, vec2) {
	var ret = [];
	for (var i = 0; i < vec1.length; i++) {
		ret.push(vec1[i] - vec2[i]);
	}

	return ret;
}

module.exports.subVV = subVV;

function proj(vec1, vec2) {
	var denom = innerProd(vec1, vec1);
	var numer = innerProd(vec1, vec2);

	var vec3 = [];

	for (var i = 0; i < vec1.length; i++) {
		vec3[i] = (numer / denom) * vec1[i];
	}

	return vec3;
}

module.exports.proj = proj;

function innerProd(vec1, vec2) {
	if (vec1.length == vec2.length) {
		var ans = 0;
		for (var i = 0; i < vec1.length; i++) {
			ans += vec1[i] * vec2[i];
		}

		return ans;
	}
}

module.exports.innerProd = innerProd;

function normal(vec) {
	var norm = 0;
	for (var i = 0; i < vec.length; i++) {
		norm += vec[i] * vec[i];
	}
	norm = Math.sqrt(norm);

	return norm;
}

module.exports.normal = normal;

//source: http://www.learninglover.com/examples.php?id=79
function QRDecomp(A) {
	var aVectors = transpose(A);
	var uVector = [];
	var eVector = [];
	var eVectorTxt = [];
	var sum = [];

	var testTest = [];

	for (var i = 0; i < aVectors.length; i++) {
		uVector[i] = [];
		for (var j = 0; j < aVectors[i].length; j++) {
			sum[j] = 0;
		}

		for (j = 0; j < i; j++) {
			var temp = proj(eVector[j], aVectors[i]);
			for (k = 0; k < temp.length; k++) {
				sum[k] += temp[k];
			}
		}

		for (j = 0; j < aVectors[i].length; j++) {
			uVector[i][j] = aVectors[i][j] - sum[j];
		}

		var norm = normal(uVector[i]);

		eVector[i] = [];
		eVectorTxt[i] = [];

		for (j = 0; j < aVectors[i].length; j++) {
			eVector[i][j] = uVector[i][j] / norm;
			eVectorTxt[i][j] = uVector[i][j] + " / " + norm;
		}


	}

	for (i = 0; i < aVectors.length; i++) {
		testTest[i] = [];
		for (j = 0; j < aVectors[i].length; j++) {
			testTest[i][j] = 0;
		}

		for (j = 0; j <= i; j++) {
			var tempVec = innerProd(aVectors[i], eVector[j]);

			for (var k = 0; k < eVector[i].length; k++) {
				testTest[i][k] += eVector[j][k] * tempVec;
			}
		}


	}

	eVector = transpose(eVector);
	eVectorTxt = transpose(eVectorTxt);
	var decomp = {};
	decomp.Q = [];

	for (i = 0; i < eVector.length; i++) {
		decomp.Q[i] = eVectorTxt[i];
	}

	for (i = 0; i < eVector.length; i++) {
		decomp.Q[i] = eVector[i];
	}

	decomp.R = dot(transpose(decomp.Q), A);

	return decomp;
}

module.exports.QRDecomp = QRDecomp;

//helper module.exports = functions from numeric.js library
function transpose(x) {
	var i, j, m = x.length,
		n = x[0].length,
		ret = new Array(n),
		A0, A1, Bj;
	for (j = 0; j < n; j++) ret[j] = new Array(m);
	for (i = m - 1; i >= 1; i -= 2) {
		A1 = x[i];
		A0 = x[i - 1];
		for (j = n - 1; j >= 1; --j) {
			Bj = ret[j];
			Bj[i] = A1[j];
			Bj[i - 1] = A0[j];
			--j;
			Bj = ret[j];
			Bj[i] = A1[j];
			Bj[i - 1] = A0[j];
		}
		if (j === 0) {
			Bj = ret[0];
			Bj[i] = A1[0];
			Bj[i - 1] = A0[0];
		}
	}
	if (i === 0) {
		A0 = x[0];
		for (j = n - 1; j >= 1; --j) {
			ret[j][0] = A0[j];
			--j;
			ret[j][0] = A0[j];
		}
		if (j === 0) {
			ret[0][0] = A0[0];
		}
	}
	return ret;
}

module.exports.transpose = transpose;

function _getCol(A, j, x) {
	var n = A.length,
		i;
	for (i = n - 1; i > 0; --i) {
		x[i] = A[i][j];
		--i;
		x[i] = A[i][j];
	}
	if (i === 0) x[0] = A[0][j];
}

module.exports._getCol = _getCol;

function dotVV(x, y) {
	var i, n = x.length,
		i1, ret = x[n - 1] * y[n - 1];
	for (i = n - 2; i >= 1; i -= 2) {
		i1 = i - 1;
		ret += x[i] * y[i] + x[i1] * y[i1];
	}
	if (i === 0) {
		ret += x[0] * y[0];
	}
	return ret;
}

module.exports.dotVV = dotVV;

function dotMMbig(x, y) {
	var gc = _getCol,
		p = y.length,
		v = new Array(p);
	var m = x.length,
		n = y[0].length,
		A = new Array(m),
		xj;
	var VV = dotVV;
	var i, j;
	--p;
	--m;
	for (i = m; i !== -1; --i) A[i] = new Array(n);
	--n;

	for (i = n; i !== -1; --i) {
		gc(y, i, v);
		for (j = m; j !== -1; --j) {
			xj = x[j];
			A[j][i] = VV(xj, v);
		}
	}

	return A;
}

module.exports.dotMMbig = dotMMbig;

function _dim(x) {
	var ret = [];
	while (typeof x === "object") {
		ret.push(x.length);
		x = x[0];
	}
	return ret;
}

module.exports._dim = _dim;

function dim(x) {
	var y, z;
	if (typeof x === "object") {
		y = x[0];
		if (typeof y === "object") {
			z = y[0];
			if (typeof z === "object") {
				return _dim(x);
			}
			return [x.length, y.length];
		}
		return [x.length];
	}
	return [];
}

module.exports.dim = dim;

function clone(input) {
	var ret = [];
	for (var i = 0; i < input.length; i++) {
		var temp = [];
		for (var j = 0; j < input[0].length; j++) {
			temp.push(input[i][j]);
		}
		ret.push(temp);
	}

	return ret;
}

module.exports.clone = clone;

function diag(d) {
	var i, i1, j, n = d.length,
		A = new Array(n),
		Ai;
	for (i = n - 1; i >= 0; i--) {
		Ai = new Array(n);
		i1 = i + 2;
		for (j = n - 1; j >= i1; j -= 2) {
			Ai[j] = 0;
			Ai[j - 1] = 0;
		}
		if (j > i) {
			Ai[j] = 0;
		}
		Ai[i] = d[i];
		for (j = i - 1; j >= 1; j -= 2) {
			Ai[j] = 0;
			Ai[j - 1] = 0;
		}
		if (j === 0) {
			Ai[0] = 0;
		}
		A[i] = Ai;
	}
	return A;
}

module.exports.diag = diag;

function rep(s, v, k) {
	if (typeof k === "undefined") {
		k = 0;
	}
	var n = s[k],
		ret = new Array(n),
		i;
	if (k === s.length - 1) {
		for (i = n - 2; i >= 0; i -= 2) {
			ret[i + 1] = v;
			ret[i] = v;
		}
		if (i === -1) {
			ret[0] = v;
		}
		return ret;
	}
	for (i = n - 1; i >= 0; i--) {
		ret[i] = rep(s, v, k + 1);
	}
	return ret;
}

module.exports.rep = rep;

function identity(n) {
	return diag(rep([n], 1));
}

module.exports.identity = identity;

function inv(x) {
	var s = dim(x),
		abs = Math.abs,
		m = s[0],
		n = s[1];
	var A = clone(x),
		Ai, Aj;
	var I = identity(m),
		Ii, Ij;
	var i, j, k;
	for (j = 0; j < n; ++j) {
		var i0 = -1;
		var v0 = -1;
		for (i = j; i !== m; ++i) {
			k = abs(A[i][j]);
			if (k > v0) {
				i0 = i;
				v0 = k;
			}
		}
		Aj = A[i0];
		A[i0] = A[j];
		A[j] = Aj;
		Ij = I[i0];
		I[i0] = I[j];
		I[j] = Ij;
		x = Aj[j];
		for (k = j; k !== n; ++k) Aj[k] /= x;
		for (k = n - 1; k !== -1; --k) Ij[k] /= x;
		for (i = m - 1; i !== -1; --i) {
			if (i !== j) {
				Ai = A[i];
				Ii = I[i];
				x = Ai[j];
				for (k = j + 1; k !== n; ++k) Ai[k] -= Aj[k] * x;
				for (k = n - 1; k > 0; --k) {
					Ii[k] -= Ij[k] * x;
					--k;
					Ii[k] -= Ij[k] * x;
				}
				if (k === 0) Ii[0] -= Ij[0] * x;
			}
		}
	}
	return I;
}

module.exports.inv = inv;

function dotMV(x, y) {
	var p = x.length,
		i;
	var ret = new Array(p);
	var VV = dotVV;
	for (i = p - 1; i >= 0; i--) {
		ret[i] = VV(x[i], y);
	}
	return ret;
}

module.exports.dotMV = dotMV;

function dotVM(x, y) {
	var j, k, p, q, ret, woo, i0;
	p = x.length;
	q = y[0].length;
	ret = new Array(q);
	for (k = q - 1; k >= 0; k--) {
		woo = x[p - 1] * y[p - 1][k];
		for (j = p - 2; j >= 1; j -= 2) {
			i0 = j - 1;
			woo += x[j] * y[j][k] + x[i0] * y[i0][k];
		}
		if (j === 0) {
			woo += x[0] * y[0][k];
		}
		ret[k] = woo;
	}
	return ret;
}

module.exports.dotVM = dotVM;

function dotMMsmall(x, y) {
	var i, j, k, p, q, r, ret, foo, bar, woo, i0;
	p = x.length;
	q = y.length;
	r = y[0].length;
	ret = new Array(p);
	for (i = p - 1; i >= 0; i--) {
		foo = new Array(r);
		bar = x[i];
		for (k = r - 1; k >= 0; k--) {
			woo = bar[q - 1] * y[q - 1][k];
			for (j = q - 2; j >= 1; j -= 2) {
				i0 = j - 1;
				woo += bar[j] * y[j][k] + bar[i0] * y[i0][k];
			}
			if (j === 0) {
				woo += bar[0] * y[0][k];
			}
			foo[k] = woo;
		}
		ret[i] = foo;
	}
	return ret;
}

module.exports.dotMMsmall = dotMMsmall;

function mulVS(x, y) {
	for (var i = 0; i < x.length; i++) {
		x[i] = x[i] * y;
	}

	return x;
}

module.exports.mulVS = mulVS;

function mulSV(x, y) {
	for (var i = 0; i < y.length; i++) {
		y[i] = y[i] * x;
	}

	return y;
}

module.exports.mulSV = mulSV;

function dot(x, y) {
	var d = dim;
	switch (d(x).length * 1000 + d(y).length) {
		case 2002:
			if (y.length < 10) return dotMMsmall(x, y);
			else return dotMMbig(x, y);
		case 2001:
			return dotMV(x, y);
		case 1002:
			return dotVM(x, y);
		case 1001:
			return dotVV(x, y);
		case 1000:
			return mulVS(x, y);
		case 1:
			return mulSV(x, y);
		case 0:
			return x * y;
		default:
			throw new Error('numeric.dot only works on vectors and matrices');
	}
}

module.exports.dot = dot;