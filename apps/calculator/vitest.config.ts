import solidSvg from '@solid-material/vite-plugin-solid-svg';
import { playwright } from '@vitest/browser-playwright';
import solidPlugin from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [solidPlugin(), solidSvg()],
  test: {
    environment: 'node',
    globals: true,
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      // At least one instance is required
      instances: [{ browser: 'webkit' }]
    },
    coverage: {
      provider: 'istanbul',
      reporter: [['cobertura', { file: 'coverage.xml' }], ['text']],
      reportOnFailure: true
    }
  }
});
