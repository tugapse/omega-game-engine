import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

// Check if we are in production environment
const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: './src/index.ts',
  output: {
    file: `dist/omega-game-engine.${isProduction ? 'min.js' : 'js'}`,
    format: 'umd',
    name: 'OmegaGameEngine',
    sourcemap: true, 
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    // Conditionally add terser based on environment
    isProduction && terser({
      keep_classnames: true,
      keep_fnames: true,
    }),
  ],
};