import type { Locator } from 'vitest/browser';

declare module 'vitest/browser' {
  interface LocatorSelectors {
    getByElement: (tag: string) => Locator;
  }
}
