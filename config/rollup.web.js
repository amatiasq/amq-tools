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
      name: capitalize(entry),
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
      name: capitalize(path.basename(entry)),
      input: `dist/web.modules/${entry}.js`,
      output: {
        file: `dist/web/${entry}.js`,
      },
    }))
    .map(extend(extension));
}


function store(namespace) {
  return entry => ({
    output: Object.assign({ format: 'iife' }, entry.output),
    banner: globalStore([ ...namespace, entry.name ]),
  });
}


function globalStore(path) {
  const key = path.pop();

  const namespaces = path.reduce((namespaces, step) => {
    const prev = last(namespaces) || 'window';
    namespaces.push(`${prev}.${step}`);
    return namespaces;
  }, []);

  const code = namespaces.map(ns => `${ns} = ${ns} || {}`)
  const lastNs = last(namespaces);

  code.push(`${lastNs}.${key} = `);
  return code.join(';\n');
}


function extend(extend) {
  return (item) => Object.assign({}, item, extend(item));
}


function capitalize(value) {
  return value.replace(/-\w/g, key => key[1].toUpperCase());
}


function withoutExtension(value, extension) {
  return value.substr(0, value.length - extension.length);
}


function last(array) {
  return array[array.length - 1];
}
