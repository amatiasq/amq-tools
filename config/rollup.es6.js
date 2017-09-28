import {all} from './rollup.config';


export default all(entry => ({
  tsconfig: {target: 'es2015'},
  output: {
    file: entry.output.file.replace('dist/', 'dist/es6/'),
    format: 'es',
  },
}));
