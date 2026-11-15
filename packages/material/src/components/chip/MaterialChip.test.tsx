import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { axe } from '../../../vitest.axe';

import type { MaterialChipVariant } from './MaterialChip';

import { MaterialChip } from './MaterialChip';

const emptyFn = () => {
  // Empty
};

describe('MaterialChip', () => {
  describe('Accessibility', () => {
    it.each(['assist', 'filter', 'input', 'suggestion'] satisfies MaterialChipVariant[])(
      'maps the ariaLabel of a $0 chip to its accessible name',
      async variant => {
        const { baseElement, container } = render(() => (
          <MaterialChip variant={variant} ariaLabel="Chip label">
            Chip
          </MaterialChip>
        ));
        const screen = page.elementLocator(baseElement);

        // Given the chip's primary action is visible as a button
        const chip = screen.getByRole('button', { name: 'Chip label', exact: true });
        await expect.element(chip).toBeVisible();

        // Then the rendered tree has no axe violations
        await expect(await axe(container)).toHaveNoViolations();
      }
    );

    it.each(['assist', 'filter', 'input', 'suggestion'] satisfies MaterialChipVariant[])(
      'renders a disabled $0 chip',
      async variant => {
        const { baseElement, container } = render(() => (
          <MaterialChip variant={variant} ariaLabel="Chip label" disabled={true}>
            Chip
          </MaterialChip>
        ));
        const screen = page.elementLocator(baseElement);

        // Given the chip's primary action is visible as a button
        const chip = screen.getByRole('button', { name: 'Chip label', exact: true });
        await expect.element(chip).toBeVisible();

        // Then the chip is inert on both the host element and its primary action
        await expect.element(screen.getByElement(`md-${variant}-chip`)).toHaveAttribute('disabled');
        await expect.element(chip).toBeDisabled();

        // and the rendered tree has no axe violations
        await expect(await axe(container)).toHaveNoViolations();
      }
    );

    it.each([false, true])('exposes the selected state of a filter chip when selected = $0', async selected => {
      const { baseElement, container } = render(() => (
        <MaterialChip variant="filter" ariaLabel="Chip label" selected={selected}>
          Chip
        </MaterialChip>
      ));
      const screen = page.elementLocator(baseElement);

      // Given the filter chip is visible as a pressed button
      const chip = screen.getByRole('button', { name: 'Chip label', exact: true });
      await expect.element(chip).toBeVisible();
      await expect.element(chip).toHaveAttribute('aria-pressed', String(selected));

      // and the selection is reflected on the host element
      if (selected) {
        await expect.element(screen.getByElement('md-filter-chip')).toHaveAttribute('selected');
      }

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('renders a removable filter chip whose remove button is named from the ariaLabel', async () => {
      const { baseElement, container } = render(() => (
        <MaterialChip variant="filter" ariaLabel="Chip label" onRemove={emptyFn}>
          Chip
        </MaterialChip>
      ));
      const screen = page.elementLocator(baseElement);

      // Given the removable filter chip is visible
      const chip = screen.getByRole('button', { name: 'Chip label', exact: true });
      await expect.element(chip).toBeVisible();

      // Then the trailing remove button is named from the chip's ariaLabel
      const removeButton = screen.getByRole('button', { name: 'Remove Chip label' });
      await expect.element(removeButton).toBeVisible();

      // and the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('renders a remove-only input chip without a primary action button', async () => {
      const { baseElement, container } = render(() => (
        <MaterialChip variant="input" ariaLabel="Chip label" removeOnly={true}>
          Chip
        </MaterialChip>
      ));
      const screen = page.elementLocator(baseElement);

      // Given the input chip is remove-only
      const chip = screen.getByElement('md-input-chip');
      await expect.element(chip).toBeVisible();
      await expect.element(chip).toHaveAttribute('remove-only');

      // Then the remove button is the only exposed button and is named from the
      // chip's ariaLabel
      const removeButton = screen.getByRole('button', { name: 'Remove Chip label' });
      await expect.element(removeButton).toBeVisible();
      expect(screen.getByRole('button').elements()).toHaveLength(1);

      // and the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('renders an input chip as a link', async () => {
      const { baseElement, container } = render(() => (
        <MaterialChip variant="input" ariaLabel="Chip label" href="/" target="_blank">
          Chip
        </MaterialChip>
      ));
      const screen = page.elementLocator(baseElement);

      // Given the input chip renders as a link
      const link = screen.getByRole('link', { name: 'Chip label' });
      await expect.element(link).toBeVisible();

      // Then the link points at the given URL
      await expect.element(link).toHaveAttribute('href', '/');
      await expect.element(link).toHaveAttribute('target', '_blank');

      // and the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
