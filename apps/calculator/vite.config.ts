import solidSvg from '@solidmaterial/vite-plugin-solid-svg';
// oxlint-disable-next-line import/no-nodejs-modules
import { readFileSync } from 'node:fs';
// oxlint-disable-next-line import/no-nodejs-modules
import path from 'node:path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// oxlint-disable-next-line typescript/no-unsafe-assignment
const packageJson: { version: string } = JSON.parse(
  readFileSync(path.join(import.meta.dirname, 'package.json'), 'utf8')
);

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [solidPlugin(), solidSvg()],
  server: {
    port: 4000
  },
  base: '/calculator',
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
  define: {
    APP_VERSION: JSON.stringify(packageJson.version)
  },
  resolve: {
    conditions: ['browser'],
    extensions: ['.tsx', '.ts', '.js', '.json']
  }
});
