import {libs, utils} from './rollup.config';


const libsConf = libs(store([ 'amq' ]));
const utilsConf = utils(store([ 'amq', 'util' ]));


export default libsConf.concat(utilsConf);


function store(namespace) {
  return entry => ({
    footer: globalStore([ ...namespace, entry.moduleName ]),
    tsconfig: {target: 'es5'},
    output: {
      file: entry.output.file.replace('dist/', 'dist/web/'),
      format: 'iife',
    },
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

  code.push(`${lastNs}.${key} = ${key}`);
  return code.join(';\n') + ';\n';
}


function last(array) {
  return array[array.length - 1];
}
