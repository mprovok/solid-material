import { defineConfig } from 'vitest/config';

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
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
          name: 'scripts',
          include: ['scripts/*.test.ts']
        }
      }
    ]
  }
});
