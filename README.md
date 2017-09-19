# AMQ Toolbox

[![Build Status](https://travis-ci.org/amatiasq/amq-tools.svg)](https://travis-ci.org/amatiasq/amq-tools)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

A set of tools and utilities for TS / JS development with no external dependencies.
Both browsers and node are supported.

This is separated in two kind of components: 3 main modules and many small utils.

### Installation

This project can be installed with NPM or used globally for specific cases.

#### With NPM

All modules can be imported with NPM:

```bash
npm install amq-tools
```

And then imported as CommonJS modules:

```javascript
const log = require('amq-tools/log');
const Stream = require('amq-tools/stream');
const Timer = require('amq-tools/timer');
const getUrlQuery = require('amq-tools/util/get-url-query');
```

#### As ECMAScript module

A ECMAScript 2015 version is available too

```bash
npm install amq-tools-es6
```

```javascript
import log  from 'amq-tools-es6/log';
import Stream  from 'amq-tools-es6/stream';
import Timer  from 'amq-tools-es6/timer';
import getUrlQuery  from 'amq-tools-es6/util/get-url-query';
```

#### Globally

Or globally by including the tag for the module in the HTML:

```html
<script src="http://repos.amatiasq.com/amq-tools/lastest/log.js">
<script src="http://repos.amatiasq.com/amq-tools/lastest/stream.js">
<script src="http://repos.amatiasq.com/amq-tools/lastest/timer.js">
<script src="http://repos.amatiasq.com/amq-tools/lastest/util/get-url-query.js">
```

In this case the modules will be added to the global `amq` object:

```javascript
amq.log(...);
new amq.Stream(...);
new amq.Timer(...);
amq.util.getUrlQuery(...);
```

All the examples use the imported format but the global `amq` version works exactly the same way.

## Components

### Logger

A simple logger tool to intercept method / function calls. Hooks on the passed class / function and logs when it's
invoked and the argument list and also the return value. Additionally every `console.log()` call made during the
function execution will be indented in the console.

[Read more](src/log)

### Stream

*Work in progress*

### Timer

A class to handle delayed code execution.

You only need to provide the callback and the milliseconds to delay once in the constructor.
After that you can schedule the timer as many times as you need to.

[Read more](src/timer)

## Utilities

A set of small functions for various useful proposes, each one is self-documented.

- [chunks](src/util/chunks.ts):
    Splits an array into a two-dimensional array.
- [combinations](src/util/combinations.ts):
    Calculates every possible combination of a set of elements.
- [curry](src/util/curry.ts):
    Decorates a function to accept the arguments it needs in different invocations.
- [deep-extend](src/util/deep-extend.ts):
    Extends a complex object with another object.
- [download-canvas](src/util/download-canvas.ts):
    Modifies a link element to download a canvas as a PNG image when clicked.
- [download-url](src/util/download-url.ts):
    Asks the browser to download a given URL as a file.
- [edit-object](src/util/edit-object.ts):
    Allows for easely add and remove properties from an object.
- [get-global](src/util/get-global.ts):
    Returns `global` object on node and `window` in browser.
- [get-url-query](src/util/get-url-query.ts):
    Reads query parameters of a URL and returns it as a Map.
- [print-jsx](src/util/print-jsx.ts):
    *Work in progress* Generates a string with the JSX code for a given ReactJS element.
- [route-to-regex](src/util/route-to-regex.ts):
    Generates regular expressions for path definitions.
- [split-name](src/util/split-name.ts):
    Splits a full name into first and last name using the whitespace closest to the middle of the string.
- [stringify](src/util/stringify.ts):
    A simple JSON stringifier. Used to customize the JSON output.

### Promise utils

Some utilities specialize on decorating functions that return or accept promises to make them more useful.

- [promise/add-sync-method](src/util/promise/add-sync-method.ts):
    Uses [sync-version](src/util/promise/sync-version.ts) to decorate a object's method
    and add a ``object.${method}Sync()`` version to get the last succesul value.
- [promise/async-params](src/util/promise/async-params.ts):
    Decorates a function to not be invoked until all Promise arguments are resolved.
- [promisify](src/util/promise/promisify.ts):
    Polyfill for [Node8 `util.promisify()`](http://2ality.com/2017/05/util-promisify.html)
- [race-condition](src/util/promise/race-condition.ts):
    Decoreates a promise returning function to prevent race conditions.
    That is when a previous execution is resolved after the last one.
- [sync-version](src/util/promise/sync-version.ts):
    Decorates a promise returning function to cache the last successful value returned.
- [throttle-promise](src/util/promise/throttle-promise.ts):
    Decorates a promise returning function to not be called again
    until the previous returned promise is resolved or rejected.
