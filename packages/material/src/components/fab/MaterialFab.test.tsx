import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { axe } from '../../../vitest.axe';

import { MaterialFab } from './MaterialFab';

import EditFillIcon from '@solidmaterial/icons/400/outlined/edit-fill.svg';

describe('MaterialFab', () => {
  describe('Accessibility', () => {
    it('falls back to the title for the accessible name of an icon-only fab', async () => {
      const { baseElement, container } = render(() => <MaterialFab icon={<EditFillIcon />} title="Edit" />);
      const screen = page.elementLocator(baseElement);

      // Given the icon-only fab is visible and its accessible name comes from the title
      const fab = screen.getByRole('button', { name: 'Edit' });
      await expect.element(fab).toBeVisible();

      // and the plain tooltip is rendered closed for hover/focus
      const tooltip = screen.getByElement('sm-tooltip');
      await expect.element(tooltip).toHaveAttribute('popover', 'auto');
      await expect.element(tooltip).toHaveTextContent('Edit');
      await expect.element(tooltip).not.toBeVisible();

      // and the anchor references the tooltip through aria-controls
      const anchor = fab.element().closest('[aria-controls]');
      expect(anchor?.getAttribute('aria-controls')).toBe(tooltip.element().id);

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('maps ariaLabel to the accessible name of an icon-only fab without rendering a tooltip', async () => {
      const { baseElement, container } = render(() => (
        <MaterialFab icon={<EditFillIcon />} ariaLabel="Create contact" />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the icon-only fab is visible and its accessible name comes from ariaLabel
      const fab = screen.getByRole('button', { name: 'Create contact' });
      await expect.element(fab).toBeVisible();

      // and no tooltip is rendered when no title is given
      expect(container.querySelectorAll('sm-tooltip')).toHaveLength(0);

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('names an extended fab from its visible label', async () => {
      const { baseElement, container } = render(() => <MaterialFab icon={<EditFillIcon />}>Create</MaterialFab>);
      const screen = page.elementLocator(baseElement);

      // Given the extended fab is visible with its label text as the accessible name
      const fab = screen.getByRole('button', { name: 'Create' });
      await expect.element(fab).toBeVisible();
      await expect.element(fab).toHaveTextContent('Create');

      // and it is marked as extended
      await expect.element(screen.getByElement('sm-fab[data-extended]')).toBeInTheDocument();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
