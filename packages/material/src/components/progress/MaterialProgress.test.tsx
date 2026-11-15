import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialProgressVariant } from './MaterialProgress';

import { MaterialProgress } from './MaterialProgress';

interface ProgressCase {
  variant: MaterialProgressVariant;
  indeterminate: boolean;
}

const CASES: ProgressCase[] = [
  { variant: 'linear', indeterminate: false },
  { variant: 'linear', indeterminate: true },
  { variant: 'circular', indeterminate: false },
  { variant: 'circular', indeterminate: true }
];

describe('MaterialProgress', () => {
  describe('Accessibility', () => {
    it.each(CASES)(
      'renders an accessible $variant progressbar when indeterminate = $indeterminate',
      async ({ variant, indeterminate }) => {
        const { baseElement, container } = render(
          () => (
            <MaterialProgress
              variant={variant}
              indeterminate={indeterminate}
              value={indeterminate ? undefined : 1}
              maximum={2}
              ariaLabel="Loading"
            />
          ),
          { wrapper: MaterialTheme }
        );
        const screen = page.elementLocator(baseElement);

        // Given the progressbar is visible and its accessible name comes from ariaLabel
        const progress = screen.getByRole('progressbar', { name: 'Loading' });
        await expect.element(progress).toBeVisible();

        // and the maximum is exposed
        await expect.element(progress).toHaveAttribute('aria-valuemax', '2');

        // Then the current value is exposed only when the progress is determinate
        await (indeterminate
          ? expect.element(progress).not.toHaveAttribute('aria-valuenow')
          : expect.element(progress).toHaveAttribute('aria-valuenow', '1'));

        // Then the rendered tree has no axe violations
        await expect(await axe(container)).toHaveNoViolations();
      }
    );
  });
});
