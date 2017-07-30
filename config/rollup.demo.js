import {libs} from './rollup.config';


export default libs(lib => ({
  entry: lib.entry.replace('src/', 'demo/').replace('/index', ''),
  dest: lib.dest.replace('dist/', 'dist/demo/'),
  format: 'iife',
  tsconfig: {target: 'es5'}
}));
