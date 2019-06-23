# PhotosynQ Helper Functions

These preset functions allow PhotosynQ Users to develop new Macros for evaluating their measurements easier and faster. This not only includes function to perform standard calculations like **mean** or find the **maximum** or **minimum**, but linear and non-linear regressions and functions to transform arrays.

Please see the documentation: <https://help.photosynq.org/macros/provided-functions>

## Install

If you want to build the functions yourself, make sure you have `node.js` and `npm` installed before you run the command below.

```bash
npm install
```

## How to Use

### In the Browser

The functions can be used in the browser by simply including the file in the header of the HTML document using `math.js` or the minified version `math.min.js`.

```HTML
<!doctype html>
<html>
    <head>
        <script src="../path/to/file" type="javascript/text"></script>
    </head>
    <body>
        <!-- Page Content -->
    <body>
</html>
```

### With node.js

To use the functions, you have to require the package.

```JavaScript
// Specific functions
const { functions, you, need} = require('photosynq-helpers');

// All functions
const pq = require('photosynq-helpers');

// All functions as globals
require('photosynq-helpers/inlcude')();

```

## Files

The distribution folder holds a set of files, that can be used in the browser or with `node.js` (in case you don't want to include the package)

```shell
├── src                 // Source Folder
├── docs                // Documentation
├── dist                // Distribution files
│   ├── math.js         // Math functions for the browser
│   ├── math.min.js     // Math functions minified for the browser
│   └── math.node.js    // Math functions for node.js to be used without package
└── tests               // Automated tests for functions
```

## Build

Use the following gulp task to build distribution files. The documentation files are not generated.

```bash
# Using gulp
gulp build
# or via npm
npm run build
```

To build the complete set of files, distribution files and documentation, run the gulp task below.

```bash
# Using gulp
gulp
# or via npm
npm run release
```

## Generate Documentation

The documentation can be build using the following gulp task. The task doesn't require distribution files.

```bash
# Using gulp
gulp docs
# or via npm
npm run docs
```

## Test Functions

You can test the by simply running the following gulp task.

```bash
# Using gulp
gulp test
# or via npm
npm run test
```