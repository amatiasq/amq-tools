import fs from 'fs';
import {sync as glob} from 'glob';
import path from 'path';
import tsLoader from 'rollup-plugin-typescript';
import typescript from 'typescript';


export function all(extension) {
  return libs(extension).concat(utils(extension));
}


export function libs(extension = x => x) {
  return fs.readdirSync('src')
    .filter(entry => entry !== 'util')
    .map(entry => ({
      name: capitalize(entry),
      input: `src/${entry}/index.ts`,
      output: {
        file: `dist/${entry}.js`,
      },
    }))
    .map(extend(extension))
    .map(build);
}


export function utils(extension = x => x) {
  return glob('src/util/**/*.ts')
    .map(entry => entry.substr('src/'.length))
    .map(entry => ({
      name: capitalize(path.basename(entry, '.ts')),
      input: `src/${entry}`,
      output: {
        file: `dist/${withoutExtension(entry, '.ts')}.js`,
      },
    }))
    .map(extend(extension))
    .map(build);
}


function extend(extend) {
  return (item) => Object.assign({}, item, extend(item));
}


function build(params) {
  const {tsconfig} = params;
  const rest = omit(params, [ 'tsconfig' ]);

  const plugins = [
    tsLoader(Object.assign({}, tsconfig, {typescript})),
  ];

  return Object.assign({}, rest, { plugins });
}


function capitalize(value) {
  return value.replace(/-\w/g, key => key[1].toUpperCase());
}


function withoutExtension(value, extension) {
  return value.substr(0, value.length - extension.length);
}


function omit(object, keys) {
  const result = {};

  Object.keys(object).forEach(key => {
    if (keys.indexOf(key) === -1)
      result[key] = object[key];
  });

  return result;
}
