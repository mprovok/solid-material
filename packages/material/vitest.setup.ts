import { cleanup } from '@solidjs/testing-library';
import { afterEach } from 'vitest';
import { locators } from 'vitest/browser';

import './vitest.setup.d';

// Suppress annoying "Lit is in dev mode" warning from Lit (from https://github.com/lit/lit/issues/4877#issuecomment-3190989270)
// oxlint-disable-next-line typescript/no-unsafe-type-assertion
(globalThis as { litIssuedWarnings?: Set<string> }).litIssuedWarnings = new Set([
  'Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.'
]);

locators.extend({
  getByElement(tag: string) {
    return tag;
  }
});

afterEach(() => {
  cleanup();
});
