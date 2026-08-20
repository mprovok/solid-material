import solidSvg from '@solidmaterial/vite-plugin-solid-svg';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [solidPlugin(), solidSvg()],
  server: {
    port: 4000
  },
  build: {
    license: true,
    target: 'es2025',

    // Minification using Lightning CSS breaks animations in carousel
    cssMinify: 'esbuild'
  },
  resolve: {
    conditions: ['browser'],
    extensions: ['.tsx', '.ts', '.js', '.json']
  }
});
