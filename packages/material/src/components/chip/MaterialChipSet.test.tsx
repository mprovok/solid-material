import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { axe } from '../../../vitest.axe';

import { MaterialChip } from './MaterialChip';
import { MaterialChipSet } from './MaterialChipSet';

const emptyFn = () => {
  // Empty
};

describe('MaterialChipSet', () => {
  describe('Accessibility', () => {
    // md-chip-set exposes its toolbar role via element internals, so
    // getByRole('toolbar') cannot resolve it and the host element is queried
    // instead while axe resolves the role itself during the scan
    it('labels a set of filter chips for assistive technology', async () => {
      const { baseElement, container } = render(() => (
        <MaterialChipSet ariaLabel="Filter options">
          <MaterialChip variant="filter" onClick={emptyFn}>
            First
          </MaterialChip>
          <MaterialChip variant="filter" selected={true} onClick={emptyFn}>
            Second
          </MaterialChip>
          <MaterialChip variant="filter" onRemove={emptyFn}>
            Third
          </MaterialChip>
        </MaterialChipSet>
      ));
      const screen = page.elementLocator(baseElement);

      // Given the set is visible and carries its ariaLabel attribute
      const chipSet = screen.getByElement('md-chip-set');
      await expect.element(chipSet).toBeVisible();
      await expect.element(chipSet).toHaveAttribute('aria-label', 'Filter options');

      // and its filter chips are exposed as named buttons
      await expect.element(screen.getByRole('button', { name: 'First', exact: true })).toBeVisible();
      await expect.element(screen.getByRole('button', { name: 'Second', exact: true })).toBeVisible();
      await expect.element(screen.getByRole('button', { name: 'Third', exact: true })).toBeVisible();

      // Then the selected chip exposes its pressed state
      await expect
        .element(screen.getByRole('button', { name: 'Second', exact: true }))
        .toHaveAttribute('aria-pressed', 'true');
      await expect.element(screen.getByElement('md-filter-chip[selected]')).toBeVisible();

      // and the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
