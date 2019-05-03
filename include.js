/**
 * PhotosynQ Helper Functions
 * When requiring, all functions will be globably available
 * Use: require('photosynq-math/include')()
 */

module.exports = function() {
    this.ArrayNth = require('./src/ArrayNth');
    this.ArrayRange = require('./src/ArrayRange');
    this.ArrayUnZip = require('./src/ArrayUnZip');
    this.ArrayZip = require('./src/ArrayZip');
    this.GetIndexByLabel = require('./src/GetIndexByLabel');
    this.GetLabelLookup = require('./src/GetLabelLookup');
    this.GetProtocolByLabel = require('./src/GetProtocolByLabel');
    this.MathLINREG = require('./src/MathLINREG');
    this.MathLN = require('./src/MathLN');
    this.MathLOG = require('./src/MathLOG');
    this.MathMAX = require('./src/MathMAX');
    this.MathMEAN = require('./src/MathMEAN');
    this.MathMEDIAN = require('./src/MathMEDIAN');
    this.MathMIN = require('./src/MathMIN');
    this.MathROUND = require('./src/MathROUND');
    this.MathSTDERR = require('./src/MathSTDERR');
    this.MathSTDEV = require('./src/MathSTDEV');
    this.MathSTDEVS = require('./src/MathSTDEVS');
    this.MathSUM = require('./src/MathSUM');
    this.MathVARIANCE = require('./src/MathVARIANCE');
    this.info = require('./src/Message').info;
    this.warning = require('./src/Message').warning;
    this.danger = require('./src/Message').danger;
    this.NonLinearRegression = require('./src/NonLinearRegression');
    this.TransformTrace = require('./src/TransformTrace');
    this.MathMULTREG = require('./src/additional_functions').MathMULTREG;
    this.MathEXPINVREG = require('./src/additional_functions').MathEXPINVREG;
    this.MathPOLYREG = require('./src/additional_functions').MathPOLYREG;
    this.subVV = require('./src/additional_functions').subVV;
    this.proj = require('./src/additional_functions').proj;
    this.innerProd = require('./src/additional_functions').innerProd;
    this.normal = require('./src/additional_functions').normal;
    this.QRDecomp = require('./src/additional_functions').QRDecomp;
    this.transpose = require('./src/additional_functions').transpose;
    this._getCol = require('./src/additional_functions')._getCol;
    this.dotVV = require('./src/additional_functions').dotVV;
    this.dotMMbig = require('./src/additional_functions').dotMMbig;
    this._dim = require('./src/additional_functions')._dim;
    this.dim = require('./src/additional_functions').dim;
    this.clone = require('./src/additional_functions').clone;
    this.diag = require('./src/additional_functions').diag;
    this.rep = require('./src/additional_functions').rep;
    this.identity = require('./src/additional_functions').identity;
    this.inv = require('./src/additional_functions').inv;
    this.dotMV = require('./src/additional_functions').dotMV;
    this.dotVM = require('./src/additional_functions').dotVM;
    this.dotMMsmall = require('./src/additional_functions').dotMMsmall;
    this.mulVS = require('./src/additional_functions').mulVS;
    this.mulSV = require('./src/additional_functions').mulSV;
    this.dot = require('./src/additional_functions').dot;
};