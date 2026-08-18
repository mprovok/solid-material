import solidSvg from '@solid-material/vite-plugin-solid-svg';
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

    rolldownOptions: {
      input: {
        index: 'index.html',
        sw: 'src/sw.ts'
      },
      output: {
        entryFileNames: info => {
          return info.name === 'sw' ? 'sw.js' : 'assets/[name]-[hash].js';
        }
      }
    },

    // Minification using Lightning CSS breaks animations in carousel
    cssMinify: 'esbuild'
  },
  resolve: {
    conditions: ['browser'],
    extensions: ['.tsx', '.ts', '.js', '.json']
  }
});
