import {all} from './rollup.config';

export default all(entry => ({
  tsconfig: {target: 'es5'},
  output: {
    file: entry.output.file.replace('dist/', 'dist/cjs/'),
    format: 'cjs',
  },
}))
