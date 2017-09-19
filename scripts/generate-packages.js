#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const keys = [ "name", "version", "description", "repository", "author", "license", "bugs", "homepage" ];
const cjs = pick(pkg, keys);
const es6 = pick(pkg, keys);

cjs.name = pkg.name + '-cjs';

write('../dist/cjs/package.json', cjs);
write('../dist/es6/package.json', es6);


function write(relativePath, content) {
  fs.writeFileSync(path.join(__dirname, relativePath), JSON.stringify(content, null, 2));
}


function pick(object, keys) {
  const result = {};

  for (const key of Object.keys(object)) {
    if (keys.includes(key)) {
      result[key] = object[key];
    }
  }

  return result;
}