// Script modified based of the calculator found on http://statpages.info/nonlin.html

/**
 * Function to perform a non-linear regression.
 * @see http://statpages.info/nonlin.html
 * @access public
 * @param {object} data Data for the non-linear regression needs to be provided as an array of x,y pairs. `[[x1,y1], [x2,y2], ..., [xn,yn]]`
 * @param {object} options
 * @param {string} options.equation Formula for the function to be fitted
 * @param {number[]} options.initial Array with the initial guesses for parameters in equation
 * @param {number} [options.iterations=200] Number of iterations (maximum 2000)
 * @param {number} [options.cPts] Number of datapoints
 * @param {number} options.cVar Number of independant variables
 * @param {number} options.cPar Number of parameters
 * @param {number} [options.RelaxF=1.0] Fractional adjustment factor (Values smaller than 1 will make the covergence slower but more stable)
 * @param {(1|"Y"|"Sqrt(Y)"|"w"|"Rep")} [options.SEy=1] Standard Error associated with the Y variable (Equal `1`, Relative `Y`, Counts `Sqrt(Y)`, Data `w`, Replicates `Rep`
 * @param {("Y"|"LN(Y)"|"SQRT(Y)"|"1/Y")} [options.yTrans="Y"] Transformation
 * @param {("X1"|"LN(X1)"|"SQRT(X1)"|"1/X1")} [options.x1Trans="X1"] Transformation
 * @param {("X2"|"LN(X2)"|"SQRT(X2)"|"1/X2")} [options.x2Trans="X2"] Transformation
 * @param {("X3"|"LN(X3)"|"SQRT(X3)"|"1/X3")} [options.x3Trans="X3"] Transformation
 * @param {("X4"|"LN(X4)"|"SQRT(X4)"|"1/X4")} [options.x4Trans="X4"] Transformation
 * @param {("X5"|"LN(X5)"|"SQRT(X5)"|"1/X5")} [options.x5Trans="X5"] Transformation
 * @param {("X6"|"LN(X6)"|"SQRT(X6)"|"1/X6")} [options.x6Trans="X6"] Transformation
 * @param {("X7"|"LN(X7)"|"SQRT(X7)"|"1/X7")} [options.x7Trans="X7"] Transformation
 * @param {("X8"|"LN(X8)"|"SQRT(X8)"|"1/X8")} [options.x8Trans="X8"] Transformation
 * @param {boolean} [options.Centered=false] Centered Approximation to Partial Derivatives
 * @param {boolean} [options.LeastAbs=false] Least-Absolute -Value curve fitting
 * @param {number} [options.cPctile=50] Percentile
 * @returns {object}
 * @example NonLinearRegression(
 *  [
 *    [x1,y1],
 *    [x2,y2],
 *    ...,
 *    [xn,yn]
 *  ],
 *  {
 * 	  equation: "",
 * 	  initial: [a, b, ..., h]
 *  }
 * )
 *
 *
 * // Available equations
 * // "b + a * e(- x / c)"
 * // "( a - c ) * e( - b * t ) + c"
 * // "( c + a / ( 1 + b / x ) )"
 * // "( c + a * a / ( 1 + b / x ) )"
 *
 *
 * // returns
 * // {
 * //   text: <string>,
 * //   ParameterEstimates: <string>,
 * //   CovarianceMatrix: <string>,
 * //   r2: <number>
 * //   parameters: {
 * //     name: <string>,
 * //     value: <number>,
 * //     sd_error: <number>,
 * //     p: <number>
 * //   },
 * //   RMS_error: <number>,
 * //   presets: <object>,
 * //   iterations: <number>,
 * //   RMS_errors: <array>
 * // }
 */

function NonLinearRegression(data, options) {
	// Equal: all points are equally precise;
	// Relative: Std Err of each Y value is proportional to Y variable itself;
	// Counts: Std Err = square root of Y; this is appropriate if Y represents the # of occurrences of something (such as radioactive decay events);
	// Data: Std Err is specified in the data window as a separate column of numbers, immediately to the right of the Y values;
	// Replicates: Specify this if you have entered several Y values.

	// initial settings
	var presets = {
		iterations: (options.iterations === undefined || options.iterations > 2000) ? 200 : options.iterations,
		cPts: data.length || 0, // Number of datapoints
		cVar: options.variables || 1, // Number of independant variables
		cPar: options.initial.length || 0, // Number of parameters
		equation: options.equation || '', // Function
		RelaxF: options.RelaxF || 1.0, // 0.5, 0.2, 0.1, 0.05
		SEy: options.SEy || 1, //[1, 'Y','Sqrt(Y)','w','Rep'],
		yTrans: 'Y', //['Y', 'LN(Y)','LN(Y)', 'SQRT(Y)', '1/Y'],
		x1Trans: 'X', //['X', 'LN(X)', 'SQRT(X)', '1/X'],
		x2Trans: 'X2', //['X2', 'LN(X2)', 'SQRT(X2)', '1/X2'],
		x3Trans: 'X3', //['X3', 'LN(Y)', 'SQRT(Y)', '1/X3'],
		x4Trans: 'X4', //['X4', 'LN(X4)', 'SQRT(X4)', '1/X4'],
		x5Trans: 'X5', //['X5', 'LN(X5)', 'SQRT(X5)', '1/X5'],
		x6Trans: 'X6', //['X6', 'LN(X6)', 'SQRT(X6)', '1/X6'],
		x7Trans: 'X7', //['X7', 'LN(X7)', 'SQRT(X7)', '1/X7'],
		x8Trans: 'X8', //['X8', 'LN(X8)', 'SQRT(X8)', '1/X8'],
		Centered: options.Centered || false,
		LeastAbs: options.LeastAbs || false,
		cPctile: options.Percentile || 50 // Percentile
	};

	// initial parameters
	var parameters = {
		ca: options.initial[0] || 0,
		cb: options.initial[1] || 0,
		cc: options.initial[2] || 0,
		cd: options.initial[3] || 0,
		ce: options.initial[4] || 0,
		cf: options.initial[5] || 0,
		cg: options.initial[6] || 0,
		ch: options.initial[7] || 0,
		sa: 1.0,
		sb: 1.0,
		sc: 1.0,
		sd: 1.0,
		se: 1.0,
		sf: 1.0,
		sg: 1.0,
		sh: 1.0,
		pva: 0,
		pvb: 0,
		pvc: 0,
		pvd: 0,
		pve: 0,
		pvf: 0,
		pvg: 0,
		pvh: 0
	};

	// All functins and parameters
	function STUDT(r, t) {
		r = Math.abs(r);
		var n = r / Math.sqrt(t),
			a = Math.atan(n);
		if (1 == t) return 1 - a / (Math.PI / 2);
		var e = Math.sin(a),
			u = Math.cos(a);
		return t % 2 == 1 ? 1 - (a + e * u * STATCOM(u * u, 2, t - 3, -1)) / (Math.PI / 2) : 1 - e * STATCOM(u * u, 1, t - 3, -1)
	}

	function STATCOM(r, t, n, a) {
		for (var e = 1, u = e, c = t; c <= n;) e = e * r * c / (c - a), u += e, c += 2;
		return u;
	}

	function ASTUDT(r, t) {
		for (var n = .5, a = .5, e = 0; a > 1e-15;) e = 1 / n - 1, a /= 2, STUDT(e, t) > r ? n -= a : n += a;
		return e;
	}

	function MAX(r, t) {
		return r > t ? r : t;
	}

	function MIN(r, t) {
		return r < t ? r : t;
	}

	function Fmt(r) {
		var t;
		return Math.abs(r) < 5e-5 && (r = 0), t = r >= 0 ? " " + (r + 5e-5) : " " + (r - 5e-5), t = t.substring(0, t.indexOf(".") + 5), t.substring(t.length - 10, t.length)
	}

	function vFmt(r) {
		var t;
		return Math.abs(r) < 5e-7 && (r = 0), t = r >= 0 ? " " + (r + 5e-7) : " " + (r - 5e-7), t = t.substring(0, t.indexOf(".") + 7), t.substring(t.length - 18, t.length)
	}

	function ix(r, t) {
		return r * (presets.cPar + 1) + t
	}
	var Par = [0, 0, 0, 0, 0, 0, 0, 0],
		SEP = [1, 1, 1, 1, 1, 1, 1, 1],
		Der = [0, 0, 0, 0, 0, 0, 0, 0, 0],
		Arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		Cov = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		xArr = [0, 0, 0, 0, 0, 0, 0, 0, 0],
		i = 0,
		j = 0,
		k = 0,
		l = 0,
		m = 0,
		cPar = 0,
		cVar = 0,
		cPts = 0,
		ccSW = 1,
		ccAv = 0,
		ccSD = 1;

	// Iterating function
	function Iterate(r, a, P) {
		var r = r,
			t = 0,
			c = 0,
			x = 0;
		dgfr = a.cPts - a.cPar;
		var s = ASTUDT(.05, dgfr),
			A = a.cPctile / 100,
			e = P.ca;
		Par[0] = e;
		var S = P.cb;
		Par[1] = S;
		var T = P.cc;
		Par[2] = T;
		var n = P.cd;
		Par[3] = n;
		var o = P.ce;
		Par[4] = o;
		var M = P.cf;
		Par[5] = M;
		var f = P.cg;
		Par[6] = f;
		var h = P.ch;
		Par[7] = h;
		var E = "Y = " + a.equation + "\n";
		for (i = 1; i <= a.cVar; i++) E += " x" + i + " ";
		E += " Y yc Y-yc SEest YcLo YcHi \n";
		var m = 0;
		for (b = 0; b < a.cPar * (a.cPar + 1); b++) Arr[b] = 0;
		for (i = 1; i <= a.cPts; i++) {
			for (b = 0; b < a.cVar; b++) xArr[b] = r[i - 1][0], v = r[i - 1][1];
			var g = xArr[0];
			"LN(X2)" == a.x1Trans && (g = Math.log(xArr[0])), "SQRT(X2)" == a.x2Trans && (g = Math.sqrt(xArr[0])), "1/X2" == a.x2Trans && (g = 1 / xArr[0]);
			var q = g,
				D = xArr[1];
			"LN(X2)" == a.x2Trans && (D = Math.log(xArr[1])), "SQRT(X2)" == a.x2Trans && (D = Math.sqrt(xArr[1])), "1/X2" == a.x2Trans && (D = 1 / xArr[1]);
			var X = xArr[2];
			"LN(X3)" == a.x3Trans && (X = Math.log(xArr[2])), "SQRT(X3)" == a.x3Trans && (X = Math.sqrt(xArr[2])), "1/X3" == a.x3Trans && (X = 1 / xArr[2]);
			var F = xArr[3];
			"LN(X4)" == a.x4Trans && (F = Math.log(xArr[3])), "SQRT(X4)" == a.x4Trans && (F = Math.sqrt(xArr[3])), "1/X4" == a.x4Trans && (F = 1 / xArr[3]);
			var d = xArr[4];
			"LN(X5)" == a.x5Trans && (d = Math.log(xArr[4])), "SQRT(X5)" == a.x5Trans && (d = Math.sqrt(xArr[4])), "1/X5" == a.x5Trans && (d = 1 / xArr[4]);
			var p = xArr[5];
			"LN(X6)" == a.x6Trans && (p = Math.log(xArr[5])), "SQRT(X6)" == a.x6Trans && (p = Math.sqrt(xArr[5])), "1/X6" == a.x6Trans && (p = 1 / xArr[5]);
			var R = xArr[6];
			"LN(X7)" == a.x7Trans && (R = Math.log(xArr[6])), "SQRT(X7)" == a.x7Trans && (R = Math.sqrt(xArr[6])), "1/X7" == a.x7Trans && (R = 1 / xArr[6]);
			var C = xArr[7];
			"LN(X8)" == a.x8Trans && (C = Math.log(xArr[7])), "SQRT(X8)" == a.x8Trans && (C = Math.sqrt(xArr[7])), "1/X8" == a.x8Trans && (C = 1 / xArr[7]);
			var l = Equation(a.equation, e, S, T, n, o, M, f, h, g, q);
			if (Y = r[i - 1][1], "Rep" == a.SEy) {
				var y = 1,
					L = Y,
					I = Y * Y;
				y += 1, L += Y, I += Y * Y, Y = L / y;
				var N = Math.sqrt(Math.abs(I / y - Y * Y) / y)
			}
			yo = Y;
			var U = 1;
			"w" == a.SEy && (U = v), "Rep" == a.SEy && (U = N), "Sqrt(Y)" == a.SEy && (U = Math.sqrt(Y)), 0 == U && (U = .001);
			var u = a.yTrans.toUpperCase(),
				Q = Y;
			"LN(Y)" == u && (Q = Math.log(Y)), "LN(SQRT)" == u && (Q = Math.sqrt(Y)), "1/Y" == u && (Q = 1 / Y), "LN(Y)" == u && (U /= Y), "SQRT(Y)" == u && (U /= Q), "1/Y" == u && (U = U / Y * Y), Y = Q, a.LeastAbs && (U *= Y < l ? MAX(Math.sqrt(A * Math.abs(Y - l)), .001 * Y) : MAX(Math.sqrt((1 - A) * Math.abs(Y - l)), .001 * Y)), t += 1 / (U * U), c += l / (U * U), x += (Y - ccAv) * (Y - ccAv) / (U * U);
			for (var b = 0; b < a.cPar; b++) {
				var W = Par[b];
				if (0 == Par[b]) var B = 1e-4;
				else var B = Par[b] / 1e3;
				Par[b] += B, e = Par[0], S = Par[1], T = Par[2], n = Par[3], o = Par[4], M = Par[5], f = Par[6], h = Par[7], ycIncr = Equation(a.equation, e, S, T, n, o, M, f, h, g, q), Der[b] = (ycIncr - l) / (B * U), a.Centered && (Par[b] -= B, e = Par[0], S = Par[1], T = Par[2], n = Par[3], o = Par[4], M = Par[5], f = Par[6], h = Par[7], ycDecr = Equation(a.equation, e, S, T, n, o, M, f, h, g, q), Der[b] = (ycIncr - ycDecr) / (2 * B * U)), Par[b] = W, e = Par[0], S = Par[1], T = Par[2], n = Par[3], o = Par[4], M = Par[5], f = Par[6], h = Par[7]
			}
			for (Der[a.cPar] = (Y - l) / U, m += Der[a.cPar] * Der[a.cPar], b = 0; b < a.cPar; b++)
				for (k = 0; k <= a.cPar; k++) Arr[ix(b, k)] = Arr[ix(b, k)] + Der[b] * Der[k];
			var V = 0;
			for (b = 0; b < a.cPar; b++)
				for (V += Cov[ix(b, b)] * Der[b] * Der[b], k = b + 1; k < a.cPar; k++) V += 2 * Cov[ix(b, k)] * Der[b] * Der[k];
			V = U * Math.sqrt(V);
			var _ = l,
				w = l - s * V,
				H = l + s * V;
			"LN(Y)" == u && (_ = Math.exp(l), w = Math.exp(w), H = Math.exp(H)), "SQRT(Y)" == u && (_ = l * l, w *= w, H *= H), "1/Y" == u && (_ = 1 / l, w = 1 / w, H = 1 / H), E += Fmt(yo) + Fmt(_) + Fmt(yo - _) + Fmt(V) + Fmt(w) + Fmt(H) + "\n"
		}
		ccSW = t, ccAv = c / ccSW, ccSD = x / ccSW;
		var j = (ccSD - m / ccSW) / ccSD,
			z = Math.sqrt(j);
		for (E += "\nCorr. Coeff. = " + vFmt(z) + "; r*r = " + vFmt(j), RMS = Math.sqrt(m / MAX(1, dgfr)), E += "\nRMS Error = " + vFmt(RMS) + "; d.f = " + dgfr + "; SSq = " + vFmt(m) + "\n", AIC = a.cPts * Math.log(m / a.cPts) + 2 * (a.cPar + 1), a.cPts >= a.cPar + 2 ? AICc = AIC + 2 * (a.cPar + 1) * (a.cPar + 1 + 1) / (a.cPts - (a.cPar + 1) - 1) : AICc = AIC, E += "AIC = " + vFmt(AIC) + "; AIC(corrected) = " + vFmt(AICc) + "\n", i = 0; i < a.cPar; i++) {
			var G = Arr[ix(i, i)];
			for (Arr[ix(i, i)] = 1, k = 0; k <= a.cPar; k++) Arr[ix(i, k)] = Arr[ix(i, k)] / G;
			for (b = 0; b < a.cPar; b++)
				if (i != b)
					for (G = Arr[ix(b, i)], Arr[ix(b, i)] = 0, k = 0; k <= a.cPar; k++) Arr[ix(b, k)] = Arr[ix(b, k)] - G * Arr[ix(i, k)]
		}
		var J = "\nParameter Estimates...\n",
			K = [];
		for (i = 0; i < a.cPar; i++) Par[i] = Par[i] + a.RelaxF * Arr[ix(i, a.cPar)], SEP[i] = RMS * Math.sqrt(Arr[ix(i, i)]), J += "p" + (i + 1) + "=" + vFmt(Par[i]) + " +/- " + vFmt(SEP[i]) + "; p=" + Fmt(STUDT(Par[i] / SEP[i], dgfr)) + "\n", K.push({
			name: "P" + (i + 1),
			value: Par[i],
			sd_error: SEP[i],
			p: STUDT(Par[i] / SEP[i], dgfr)
		});
		var O = "\nCovariance Matrix Terms and Error-Correlations...\n";
		for (b = 0; b < a.cPar; b++)
			for (k = b; k < a.cPar; k++) Cov[ix(b, k)] = Arr[ix(b, k)] * RMS * RMS, v = Arr[ix(b, k)] / Math.sqrt(Arr[ix(b, b)] * Arr[ix(k, k)]), O += "B(" + (b + 1) + "," + (k + 1) + ")=", b != k && (O += "B(" + (k + 1) + "," + (b + 1) + ")="), O += " ", O += Cov[ix(b, k)], O += "; r=" + v + "\n";
		return {
			text: E,
			ParameterEstimates: J,
			CovarianceMatrix: O,
			r2: vFmt(j),
			par: {
				ca: Par[0],
				sa: SEP[0],
				pva: vFmt(STUDT(Par[0] / SEP[0], dgfr)),
				cb: Par[1],
				sb: SEP[1],
				pvb: vFmt(STUDT(Par[1] / SEP[1], dgfr)),
				cc: Par[2],
				sc: SEP[2],
				pvc: vFmt(STUDT(Par[2] / SEP[2], dgfr)),
				cd: Par[3],
				sd: SEP[3],
				pvd: vFmt(STUDT(Par[3] / SEP[3], dgfr)),
				ce: Par[4],
				se: SEP[4],
				pve: vFmt(STUDT(Par[4] / SEP[4], dgfr)),
				cf: Par[5],
				sf: SEP[5],
				pvf: vFmt(STUDT(Par[5] / SEP[5], dgfr)),
				cg: Par[6],
				sg: SEP[6],
				pvg: vFmt(STUDT(Par[6] / SEP[6], dgfr)),
				ch: Par[7],
				sh: SEP[7],
				pvh: vFmt(STUDT(Par[7] / SEP[7], dgfr))
			},
			parameters: K,
			RMS_error: RMS,
			presets: presets
		}
	}

	// Function library
	function Equation(eqtn, a, b, c, d, e, f, g, h, x, t) {
		if (eqtn == 'b + a * e(- x / c)')
			return b + a * Math.exp(-x / c)
		if (eqtn == '( a - c ) * e( - b * t ) + c')
			return (a - c) * Math.exp(-b * t) + c
		if (eqtn == '( c + a / ( 1 + b / x ) )')
			return ( c + a / ( 1 + b / x ) );
		if (eqtn == '( c + a * a / ( 1 + b / x ) )')
			return ( c + a * a / ( 1 + b / x ) );
		return null;
	}

	// iteration loop
	var output = {};
	var convergence;
	var rmsarr = [];
	for (it = 0; it < presets.iterations; it++) {
		var tmp = Iterate(data, presets, parameters);
		if (convergence <= tmp.RMS_error && it > 1 || isNaN(tmp.RMS_error))
			break;
		parameters = tmp.par;
		convergence = tmp.RMS_error;
		output = tmp;
		rmsarr.push(tmp.RMS_error);
	}
	output.iterations = it;
	output.RMS_errors = rmsarr;
	delete output.par
	return output;
}

module.exports = NonLinearRegression;
