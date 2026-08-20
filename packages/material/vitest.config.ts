import solidSvg from '@solidmaterial/vite-plugin-solid-svg';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
// oxlint-disable-next-line import/no-nodejs-modules
import path from 'node:path';
import solidPlugin from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [
    solidPlugin(),
    solidSvg(),
    // The plugin will run tests for the stories defined in your Storybook config
    // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
    storybookTest({
      configDir: path.join(import.meta.dirname, '.storybook'),
      storybookScript: 'pnpm storybook --no-open'
    })
  ],
  test: {
    name: 'storybook',
    environment: 'node',
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,

      // At least one instance is required
      instances: [{ browser: 'chromium' }, { browser: 'webkit' }]
    },
    coverage: {
      provider: 'istanbul',
      reporter: [['cobertura', { file: 'coverage.xml' }], ['text']]
    }
  }
});
