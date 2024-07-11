import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: 'rollup-dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'rollup-dist/index.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [resolve(), commonjs(), typescript()]
  },
  {
    input: 'src/index.tsx',
    output: {
      file: 'rollup-dist/index.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];