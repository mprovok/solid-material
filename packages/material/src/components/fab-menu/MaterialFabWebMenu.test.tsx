import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import { MaterialFabWebMenu } from './MaterialFabWebMenu';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

// Written by GLM 5.3 Flash

const getItems = () => [
  {
    label: 'First',
    onClick: vi.fn()
  },
  {
    label: 'Second',
    onClick: vi.fn()
  },
  {
    label: 'Third',
    onClick: vi.fn()
  }
];

describe('MaterialFabWebMenu', () => {
  describe('Interaction', () => {
    it('opens the menu and activates the first item with Enter', async () => {
      const items = getItems();

      const { baseElement } = render(
        () => (
          <MaterialFabWebMenu color="primary" size="small" icon={<EditIcon />} items={items} menuAriaLabel="FAB menu">
            Label
          </MaterialFabWebMenu>
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('button', { name: 'Label' });
      // md-menu / md-menu-item expose their roles via element internals, so
      // role queries cannot resolve them and the host element and the item
      // texts are asserted instead (see MaterialMenu.test.tsx)
      const menu = screen.getByElement('md-menu[aria-label]');

      // Given the FAB is visible
      await expect.element(button).toBeVisible();

      // and the menu is closed
      await expect.element(menu).toHaveAttribute('aria-hidden', 'true');

      // When clicking on the FAB
      await userEvent.click(button);

      // Then the menu is open and visible
      await expect.element(menu).not.toHaveAttribute('aria-hidden', 'true');
      await expect.element(menu).toBeVisible();

      // and the first item is focused
      const firstItem = screen.getByText('First');
      await vi.waitFor(async () => expect.element(firstItem).toHaveFocus());

      // When pressing Enter
      expect(items[0]?.onClick).not.toHaveBeenCalled();
      await userEvent.keyboard('{Enter}');

      // Then the first item's click handler is called
      await vi.waitFor(() => expect(items[0]?.onClick).toHaveBeenCalled());
    });
  });
});
