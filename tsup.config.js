import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  dts: true,
  sourcemap: true,
  format: ['cjs', 'esm'],
  outDir: 'tsup-dist'
});
