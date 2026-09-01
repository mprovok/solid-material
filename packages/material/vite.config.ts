import solidPlugin from '@solidjs/vite-plugin';
import solidSvg from '@solidmaterial/vite-plugin-solid-svg';
import { defineConfig } from 'vite';

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [solidPlugin(), solidSvg()],
  build: {
    target: 'esnext'
  },
  resolve: {
    conditions: ['development', 'browser'],
    extensions: ['.tsx', '.ts', '.js', '.json']
  }
});
