import {libs} from './rollup.config';


export default libs(lib => ({
  input: lib.input.replace('src/', 'demo/').replace('/index', ''),
  tsconfig: {target: 'es5'},
  output: {
    file: lib.output.file.replace('dist/', 'dist/demo/'),
    format: 'iife',
  },
}));
