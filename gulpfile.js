/**
 * PhotosynQ Math functions
 */

const {series, parallel, dest, src} = require('gulp');
const jetpack = require('fs-jetpack');
const mocha = require('gulp-mocha');
const minify = require('gulp-minify');
var spawn = require('child_process').spawn;


function clean(done) {
    jetpack.remove('./dist');
    jetpack.remove('./docs');
    done();
}

// Get all the files in the source folder to build a math functions master file
function build(done) {
    let files = jetpack.inspectTree('./src').children;
    var content = "";
    jetpack.remove('./dist');
    for(var file in files){
        if(files[file].type != 'file')
            continue;
        content = jetpack.read( jetpack.path('./src', files[file].name ) );
        content = content.replace(/\s{0,}module\.exports\s{0,}=\s{0,}\w*;?/ig,'');
        content = content.replace(/\s{0,}(const|let|var)\s{0,}\w*\s{0,}=\s{0,}require\(([\w\/\.\"\']+)\);?/gi,'');
        jetpack.append('./dist/math.js', content );
    }
    done();
}

// Minify JavaScript for Browser
function compress() {
    return src(['dist/math.js'])
        .pipe(minify({
            ext:{
                min:'.min.js'
            }
        }))
        .pipe(dest('./dist'));
}

// Test the math functions after compiling
function testBrowser() {
    return src(['test/test.js'], { read: false })
    .pipe(mocha({
      reporter: 'dot',
      exit: true,
      environment: 'browser'
    }));
}

// Test the math functions after compiling
function testBrowserMini() {
    return src(['test/test.js'], { read: false })
    .pipe(mocha({
      reporter: 'dot',
      exit: true,
      environment: 'browser.min'
    }));
}

// Test the math functions after compiling
function testNodeInclude() {
    return src(['test/test.js'], { read: false })
    .pipe(mocha({
        reporter: 'dot',
        exit: true,
        environment: 'node/include'
    }));
}

// Test the math functions after compiling
function testNode() {
    return src(['test/test.js'], { read: false })
    .pipe(mocha({
        reporter: 'dot',
        exit: true,
        environment: 'node'
    }));
}

// Build the documentation (JSON) for the ./docs folder
function docsJSON() {
    if(!jetpack.exists('./docs'))
        jetpack.dir('./docs');
    return spawn('node', [
            'node_modules/documentation/bin/documentation.js',
            'build',
            './src',
            '--output',
            './docs/documentation.json',
            '--format',
            'json',
            '--access',
            'public',
            '--sort-order',
            'alpha'
        ] , {
        stdio: 'inherit'
    });
}

// Build the documentation (Markdown) for the ./docs folder
function docsMD() {
    if(!jetpack.exists('./docs'))
        jetpack.dir('./docs');
    return spawn('node', [
            'node_modules/documentation/bin/documentation.js',
            'build',
            './src',
            '--output',
            './docs/documentation.md',
            '--format',
            'md',
            '--access',
            'public',
            '--sort-order',
            'alpha',
            '--markdown-toc',
            'false'
        ] , {
        stdio: 'inherit'
    });
}

// Build the documentation (HTML) for the ./docs folder
function docsHTML() {
    if(!jetpack.exists('./docs'))
        jetpack.dir('./docs');
    return spawn('node', [
            'node_modules/documentation/bin/documentation.js',
            'build',
            './src',
            '--output',
            './docs',
            '--format',
            'html',
            '--access',
            'public',
            '--sort-order',
            'alpha'
        ] , {
        stdio: 'inherit'
    });
}

exports.build  = series( clean, build, compress, docsMD );
exports.test = series( clean, build, compress, testBrowser, testBrowserMini, testNodeInclude, testNode );
exports.docs = parallel( docsJSON, docsMD, docsHTML );
exports.default = exports.release = series( clean, build, compress, testBrowser, testBrowserMini, testNodeInclude, testNode, parallel( docsJSON, docsMD, docsHTML ) );