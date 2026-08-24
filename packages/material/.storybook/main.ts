import { defineMain } from 'storybook-solidjs-vite';

// oxlint-disable-next-line import/no-default-export
export default defineMain({
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-vitest', '@storybook/addon-a11y'],
  framework: {
    name: 'storybook-solidjs-vite'
  },
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true
  },
  viteFinal: (config, options) => ({
    ...config,
    base: options.configType === 'PRODUCTION' ? '/storybook/' : '/',
    build: {
      ...config.build,
      // Minification using Lightning CSS breaks animations in carousel
      cssMinify: 'esbuild'
    }
  })
});
