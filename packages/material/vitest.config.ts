import solidPlugin from '@solidjs/vite-plugin';
import solidSvg from '@solidmaterial/vite-plugin-solid-svg';
import { playwright } from '@vitest/browser-playwright';
import { defaultExclude, defineConfig } from 'vitest/config';

const VISUAL_TESTS_PATTERN = 'src/**/*.vrt.test.{ts,tsx}';

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [solidPlugin(), solidSvg()],
  test: {
    environment: 'node',
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      viewport: {
        width: 1024,
        height: 768
      },

      // Disable subpixel font antialiasing in Chromium so screenshot baselines
      // don't depend on per-distro fontconfig subpixel settings
      instances: [
        {
          browser: 'chromium',
          provider: playwright({
            launchOptions: { args: ['--disable-lcd-text'] }
          })
        },
        { browser: 'webkit' }
      ]
    },
    env: {
      CI: process.env.CI ?? ''
    },
    retry: 1,
    reporters: ['default', 'junit'],
    outputFile: 'coverage/tests.junit.xml',
    coverage: {
      provider: 'istanbul',
      reporter: [['cobertura', { file: 'coverage.xml' }], ['text']],
      reportOnFailure: true
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'visual',
          include: [VISUAL_TESTS_PATTERN],
          setupFiles: 'vitest.setup.ts',
          retry: 0,
          browser: {
            expect: {
              toMatchScreenshot: {
                comparatorOptions: {
                  allowedMismatchedPixelRatio: 0.05
                }
              }
            }
          }
        }
      },
      {
        extends: true,
        test: {
          name: 'components',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: [VISUAL_TESTS_PATTERN, ...defaultExclude],
          setupFiles: ['vitest.setup.ts', 'vitest.axe.ts']
        }
      }
    ]
  }
});
