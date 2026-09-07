import { cleanup } from '@solidjs/testing-library';
import { afterEach } from 'vitest';
import { locators } from 'vitest/browser';

import './vitest.setup.d';

locators.extend({
  getByElement(tag: string) {
    return tag;
  }
});

afterEach(() => {
  cleanup();
});
