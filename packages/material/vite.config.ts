import solidSvg from '@solid-material/vite-plugin-solid-svg';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

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
