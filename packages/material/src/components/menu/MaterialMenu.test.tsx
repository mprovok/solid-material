import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import { MaterialMenu } from './MaterialMenu';
import { MaterialMenuItem } from './MaterialMenuItem';
import { MaterialSubMenu } from './MaterialSubMenu';

// Written by GLM 5.3 Flash

const emptyFn = () => {
  // Empty
};

// The menu needs an anchor element to position against; a plain button with a
// file-local ref is enough. md-menu sets its menu and menuitem roles via
// element internals, so role queries cannot resolve them and the host
// elements and their texts are asserted instead (see MaterialMenu.vrt.test.tsx)
const OpenMenuFixture: VoidComponent = () => {
  // oxlint-disable-next-line no-unassigned-vars
  let anchorRef!: HTMLButtonElement;

  return (
    <>
      <button type="button" ref={anchorRef}>
        Open menu
      </button>
      <MaterialMenu open={true} ariaLabel="Menu" anchor={anchorRef} onClose={emptyFn}>
        <MaterialMenuItem onClick={emptyFn}>Menu item 1</MaterialMenuItem>
        <MaterialMenuItem disabled onClick={emptyFn}>
          Menu item 2
        </MaterialMenuItem>
        <MaterialSubMenu label="Menu item 3">
          <MaterialMenuItem onClick={emptyFn}>Sub item 1</MaterialMenuItem>
          <MaterialMenuItem onClick={emptyFn}>Sub item 2</MaterialMenuItem>
        </MaterialSubMenu>
      </MaterialMenu>
    </>
  );
};

describe('MaterialMenu', () => {
  describe('Accessibility', () => {
    it('renders an open anchored menu with named items and a submenu', async () => {
      const { baseElement } = render(() => <OpenMenuFixture />, { wrapper: MaterialTheme });
      const screen = page.elementLocator(baseElement);

      // Given the menu is open: its aria-hidden state is lifted and its label is bound
      const menu = screen.getByElement('md-menu[aria-label]');
      await expect.element(menu).not.toHaveAttribute('aria-hidden', 'true');
      await expect.element(menu).toHaveAttribute('aria-label', 'Menu');

      // Then the menu items are visible with their accessible names
      await expect.element(screen.getByText('Menu item 1')).toBeVisible();
      await expect.element(screen.getByText('Menu item 2')).toBeVisible();
      await expect.element(screen.getByText('Menu item 3')).toBeVisible();

      // and the disabled state reaches the disabled item
      await expect.element(screen.getByElement('md-menu-item[disabled]')).toHaveAttribute('disabled');

      // and the submenu wires its trigger item and its own nested menu
      const subMenu = screen.getByElement('md-sub-menu');
      await expect.element(subMenu).toBeVisible();
      // the nested md-menu also lives inside md-sub-menu, so scope the trigger
      // item to the direct child to avoid matching the nested menu's items
      await expect.element(screen.getByElement('md-sub-menu > md-menu-item')).toBeVisible();
      // the nested menu itself is a closed popover, so only its presence is asserted
      await expect.element(subMenu.getByElement('md-menu')).toBeInTheDocument();
    });

    it('has no axe violations when open with items and a submenu', async () => {
      const { baseElement, container } = render(() => <OpenMenuFixture />, { wrapper: MaterialTheme });
      const screen = page.elementLocator(baseElement);

      // Given the menu is open and visible before the scan: the popover surface
      // stays inside the rendered tree, so a container-scoped audit also reaches
      // the md-menu internals through the open shadow roots
      const menu = screen.getByElement('md-menu[aria-label]');
      await expect.element(menu).not.toHaveAttribute('aria-hidden', 'true');
      await expect.element(screen.getByText('Menu item 1')).toBeVisible();
      await expect.element(screen.getByElement('md-sub-menu')).toBeVisible();

      // Then the open menu has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
