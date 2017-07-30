#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const keys = [ "name", "version", "description", "repository", "author", "license", "bugs", "homepage" ];
const cjs = pick(pkg, keys);
const es6 = pick(pkg, keys);

es6.name = pkg.name + '-es6';

fs.writeFileSync(path.join(__dirname, '../dist/cjs/package.json'), JSON.stringify(cjs, null, 2));
fs.writeFileSync(path.join(__dirname, '../dist/es6/package.json'), JSON.stringify(es6, null, 2));


function pick(object, keys) {
  const result = {};

  Object
    .keys(object)
    .filter(key => keys.indexOf(key) !== -1)
    .forEach(key => result[key] = object[key]);

  return result;
}