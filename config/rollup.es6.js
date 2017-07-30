import {all} from './rollup.config';


export default all(entry => ({
  dest: entry.dest.replace('dist/', 'dist/es6/'),
  format: 'es',
  tsconfig: {target: 'es2015'}
}));
