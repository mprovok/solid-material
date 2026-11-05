import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialNavigationRailFabButtonProps } from './MaterialNavigationRailFabButton';

import { MaterialNavigationRailFabButton } from './MaterialNavigationRailFabButton';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

// Written by GLM 5.3 Flash

const renderComponent = async (props: Omit<MaterialNavigationRailFabButtonProps, 'icon'>) => {
  const { baseElement } = render(() => <MaterialNavigationRailFabButton {...props} icon={EditIcon} />, {
    wrapper: MaterialTheme
  });
  await document.fonts.ready;

  // Move the pointer to the top-left corner so that hover state from a
  // previous test does not leak into this test
  await userEvent.hover(document.body, { position: { x: 0, y: 0 } });

  return page.elementLocator(baseElement);
};

describe('MaterialNavigationRailFabButton', () => {
  describe('A11y', () => {
    it('falls back to label for the accessible name when collapsed', async () => {
      const screen = await renderComponent({ label: 'Edit', expanded: false });

      // Given the collapsed fab is visible
      const button = screen.getByRole('button', { name: 'Edit' });
      await expect.element(button).toBeVisible();

      // Then its accessible name comes from the label fallback via aria-label
      await expect.element(button).toHaveAttribute('aria-label', 'Edit');

      // and no visible label text is rendered (the tooltip's hidden label is
      // present in the DOM, so the button's own text content is asserted)
      await expect.element(button).toHaveTextContent('');

      // When hovering the fab
      await userEvent.hover(button);

      // Then the plain tooltip shows the label
      await expect.element(screen.getByRole('tooltip', { name: 'Edit' })).toBeVisible();
    });

    it('uses the explicit title for the tooltip when collapsed', async () => {
      const screen = await renderComponent({ label: 'Edit', title: 'Expand', expanded: false });

      // Given the collapsed fab is visible
      const button = screen.getByRole('button', { name: 'Edit' });
      await expect.element(button).toBeVisible();

      // Then its accessible name still comes from the ariaLabel ?? label fallback
      await expect.element(button).toHaveAttribute('aria-label', 'Edit');

      // When hovering the fab
      await userEvent.hover(button);

      // Then the plain tooltip shows the title
      await expect.element(screen.getByRole('tooltip', { name: 'Expand' })).toBeVisible();
    });

    it('drops aria-label and title and shows the label when expanded', async () => {
      const screen = await renderComponent({
        label: 'Edit',
        title: 'Expand',
        ariaLabel: 'Edit button',
        expanded: true
      });

      // Given the expanded fab is visible
      const button = screen.getByRole('button', { name: 'Edit' });
      await expect.element(button).toBeVisible();

      // Then its accessible name comes from the visible label text
      await expect.element(button).toHaveTextContent('Edit');
      await expect.element(button).not.toHaveAttribute('aria-label');

      // When hovering the fab
      await userEvent.hover(button);

      // Then no tooltip is shown
      await expect.element(screen.getByRole('tooltip')).not.toBeInTheDocument();
    });
  });
});
