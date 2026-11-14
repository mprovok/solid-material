import axeCore from 'axe-core';
import { expect } from 'vitest';

export type AxeOverrides = axeCore.RunOptions;

// Mirror the accepted baseline in .storybook/preview.tsx so component tests don't
// fail for rules the project already decided to ignore at the Storybook level
const DEFAULT_DISABLED_RULES: axeCore.RuleObject = {
  'button-name': { enabled: false },
  'empty-heading': { enabled: false },
  region: { enabled: false }
};

/**
 * Runs axe-core against the given element and its subtree with the project's
 * default configuration. Pass `overrides` to adjust options per call, e.g.
 * `axe(container, { rules: { 'label-content-name-mismatch': { enabled: false } } })`.
 */
export const axe = async (element: Element, overrides: AxeOverrides = {}): Promise<axeCore.AxeResults> =>
  axeCore.run(element, {
    ...overrides,
    rules: {
      ...DEFAULT_DISABLED_RULES,
      ...overrides.rules
    }
  });

const formatViolation = (violation: axeCore.Result): string =>
  violation.nodes
    .map(node =>
      [
        `Expected the HTML found at $('${node.target.join(', ')}') to have no violations:\n`,
        node.html,
        '',
        'Received:\n',
        `"${violation.help} (${violation.id})"\n`,
        node.failureSummary,
        '',
        violation.helpUrl ? `For more information see ${violation.helpUrl}` : undefined
      ]
        .filter(line => line !== undefined)
        .join('\n')
    )
    .join('\n');

expect.extend({
  // Vitest reverses `pass` for negated assertions, so `isNot` is intentionally not checked here
  // The input is already-resolved axe results, so there is nothing to await; `async` keeps the
  // runtime return type a Promise, matching the matcher's declared type below
  // oxlint-disable-next-line typescript/require-await
  async toHaveNoViolations(received: axeCore.AxeResults) {
    if (received === null || typeof received !== 'object' || !Array.isArray(received.violations)) {
      throw new Error(
        'toHaveNoViolations expects axe results: use `await expect(await axe(element)).toHaveNoViolations()`'
      );
    }

    const { violations } = received;

    return {
      // "Needs review" (incomplete) results are ignored, mirroring the Storybook a11y addon
      pass: violations.length === 0,
      message: () =>
        violations.length === 0
          ? 'Expected axe results to contain violations, but none were found'
          : violations.map(formatViolation).join('\n──────────\n')
    };
  }
});

declare module 'vitest' {
  interface Matchers<
    // Mirrors the default of the original Matchers interface in @vitest/expect
    // oxlint-disable-next-line typescript/no-explicit-any
    T = any
  > {
    toHaveNoViolations: () => Promise<void>;
  }
}
