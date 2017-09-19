#!/usr/bin/env node

const fs = require('fs');

const file = process.argv[2];
const path = process.argv[3].split('.');

const content = JSON.parse(fs.readFileSync(file));
const result = path.reduce((value, step) => value[step], content);

console.log(result);