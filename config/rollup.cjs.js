import {all} from './rollup.config';

export default all(entry => ({
  dest: entry.dest.replace('dist/', 'dist/cjs/'),
  format: 'cjs',
  tsconfig: {target: 'es5'}
}))
