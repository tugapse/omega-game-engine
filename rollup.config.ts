
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/omega-game-engine.min.js',
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
    terser(), 
  ],
};