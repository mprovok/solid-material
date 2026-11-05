import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialSubMenuProps } from './MaterialSubMenu';

// Register md-menu through the library's own module graph: the sub menu shows
// its slotted md-menu on hover, which requires the md-menu element
import './MaterialMenu';
import { MaterialSubMenu } from './MaterialSubMenu';

// Written by GLM 5.3 Flash

const renderComponent = async (props: Omit<MaterialSubMenuProps, 'label'> = {}) => {
  const { baseElement } = render(
    () => (
      <MaterialSubMenu label="Sub menu" {...props}>
        Item
      </MaterialSubMenu>
    ),
    {
      wrapper: MaterialTheme
    }
  );

  await document.fonts.ready;

  return page.elementLocator(baseElement);
};

describe('MaterialSubMenu', () => {
  describe('Interaction', () => {
    it('renders default corner attributes when no placement given', async () => {
      const screen = await renderComponent();

      // Given the sub menu is visible
      const subMenu = screen.getByElement('md-sub-menu');
      await expect.element(subMenu).toBeVisible();

      // Then no anchor or menu corner attribute is rendered
      await expect.element(subMenu).not.toHaveAttribute('anchor-corner');
      await expect.element(subMenu).not.toHaveAttribute('menu-corner');
    });

    it('maps placement to corner attributes', async () => {
      const screen = await renderComponent({ placement: ['right', 'start'] });

      // Given the sub menu with a placement is visible
      const subMenu = screen.getByElement('md-sub-menu');
      await expect.element(subMenu).toBeVisible();

      // Then the placement is mapped to the anchor and menu corners
      await expect.element(subMenu).toHaveAttribute('anchor-corner', 'start-end');
      await expect.element(subMenu).toHaveAttribute('menu-corner', 'start-start');
    });
  });

  describe('Props', () => {
    it('toggles the disabled state', async () => {
      const [getDisabled, setDisabled] = createSignal(false);

      const Fixture: VoidComponent = () => (
        <MaterialSubMenu label="Sub menu" disabled={getDisabled()}>
          Item
        </MaterialSubMenu>
      );

      const { baseElement } = render(() => <Fixture />, { wrapper: MaterialTheme });
      const screen = page.elementLocator(baseElement);

      // Given the sub menu's inner menu item is enabled
      const menuItem = screen.getByElement('md-sub-menu').getByElement('md-menu-item');
      await expect.element(menuItem).toBeVisible();
      await expect.element(menuItem).not.toHaveAttribute('disabled');

      // When the sub menu is disabled
      setDisabled(true);

      // Then the inner menu item carries the disabled attribute
      await expect.element(menuItem).toHaveAttribute('disabled');

      // When the sub menu is enabled again
      setDisabled(false);

      // Then the disabled attribute is gone
      await expect.element(menuItem).not.toHaveAttribute('disabled');
    });
  });
});
