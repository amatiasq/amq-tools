import fs from 'fs';
import {sync as glob} from 'glob';
import path from 'path';

const libsConf = libs(store([ 'amq' ]));
const utilsConf = utils(store([ 'amq', 'util' ]));


export default libsConf.concat(utilsConf);


function libs(extension = x => x) {
  return fs.readdirSync('src')
    .filter(entry => entry !== 'util')
    .map(entry => ({
      interop: false,
      name: pascalCase(entry),
      input: `dist/web.modules/${entry}/index.js`,
      output: {
        file: `dist/web/${entry}.js`,
      },
    }))
    .map(extend(extension));
}


function utils(extension = x => x) {
  return glob('src/util/**/*.ts')
    .map(entry => withoutExtension(entry, '.ts').substr('src/'.length))
    .map(entry => ({
      name: camelCase(path.basename(entry)),
      input: `dist/web.modules/${entry}.js`,
      output: {
        file: `dist/web/${entry}.js`,
      },
    }))
    .map(extend(extension));
}


function store(namespace) {
  return entry => ({
    name: [...namespace, entry.name].join('.'),
    output: Object.assign({ format: 'iife' }, entry.output),
  });
}


function extend(extend) {
  return (item) => Object.assign({}, item, extend(item));
}


function camelCase(value) {
  return value.replace(/-\w/g, key => key[1].toUpperCase());
}


function pascalCase(value) {
  const camel = camelCase(value);
  return camel[0].toUpperCase() + camel.substr(1);
}


function withoutExtension(value, extension) {
  return value.substr(0, value.length - extension.length);
}


function last(array) {
  return array[array.length - 1];
}
