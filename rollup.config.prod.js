import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/modify.js',
  format: 'cjs',
  dest: 'dist/bundle.js',
  plugins: [resolve({
    // pass custom options to the resolve plugin
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    }
  }),
  babel({
    exclude: 'node_modules/**'
  })],
  external: ['underscore']
};