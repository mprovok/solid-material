import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialButton } from '../button/MaterialButton';

import { MaterialMenu } from './MaterialMenu';
import { MaterialMenuAnchor } from './MaterialMenuAnchor';
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

// The keyboard navigation fixture mirrors the Submenus story renderer: a
// toggle-driven switch opens a menu with three top-level items where the third
// item opens a submenu with items 4-6 (5 disabled) and two more nested submenu
// levels (7 → 8, 9 → 10)
const MenuWithSubMenusFixture: VoidComponent = () => {
  const [isOpen, setOpen] = createSignal(false);

  // oxlint-disable-next-line no-unassigned-vars
  let anchorRef!: HTMLDivElement;

  const onClickAnchor = () => {
    setOpen(v => !v);
  };

  const onCloseMenu = () => {
    setOpen(false);
  };

  return (
    <>
      <MaterialMenuAnchor ref={anchorRef}>
        <MaterialButton variant="tonal" toggle={isOpen()} onClick={onClickAnchor}>
          {isOpen() ? 'Close menu' : 'Open menu'}
        </MaterialButton>
      </MaterialMenuAnchor>
      <MaterialMenu
        open={isOpen()}
        ariaLabel="Menu with submenus"
        anchor={anchorRef}
        placement={['bottom', 'start']}
        offset={[0, 4]}
        onClose={onCloseMenu}
      >
        <MaterialMenuItem selected onClick={emptyFn}>
          Menu item 1
        </MaterialMenuItem>
        <MaterialMenuItem onClick={emptyFn}>Menu item 2</MaterialMenuItem>
        <MaterialSubMenu placement={['left', 'start']} label="Menu item 3">
          <MaterialMenuItem onClick={emptyFn}>Menu item 4</MaterialMenuItem>
          <MaterialMenuItem disabled onClick={emptyFn}>
            Menu item 5
          </MaterialMenuItem>
          <MaterialMenuItem onClick={emptyFn}>Menu item 6</MaterialMenuItem>
          <MaterialSubMenu label="Menu item 7">
            <MaterialMenuItem onClick={emptyFn}>Menu item 8</MaterialMenuItem>
            <MaterialSubMenu label="Menu item 9">
              <MaterialMenuItem onClick={emptyFn}>Menu item 10</MaterialMenuItem>
            </MaterialSubMenu>
          </MaterialSubMenu>
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

  describe('Interaction', () => {
    it('navigates the menu, its submenus and back with the keyboard', async () => {
      const { baseElement } = render(() => <MenuWithSubMenusFixture />, { wrapper: MaterialTheme });
      const screen = page.elementLocator(baseElement);

      // md-menu / md-menu-item expose their roles via element internals, so the
      // menu host is located by its aria-label attribute and the items by their
      // texts; exact matching keeps 'Menu item 1' from matching 'Menu item 10'
      const menu = screen.getByElement('md-menu[aria-label="Menu with submenus"]');
      const switchButton = screen.getByRole('switch', { name: 'Open menu' });

      // Menu item 5 is disabled and must be skipped by the arrow keys
      const item1 = screen.getByText('Menu item 1', { exact: true });
      const item2 = screen.getByText('Menu item 2', { exact: true });
      const item3 = screen.getByText('Menu item 3', { exact: true });
      const item4 = screen.getByText('Menu item 4', { exact: true });
      const item6 = screen.getByText('Menu item 6', { exact: true });
      const item7 = screen.getByText('Menu item 7', { exact: true });
      const item8 = screen.getByText('Menu item 8', { exact: true });
      const item9 = screen.getByText('Menu item 9', { exact: true });
      const item10 = screen.getByText('Menu item 10', { exact: true });

      // Given the closed menu hides behind its aria-hidden state
      await vi.waitFor(async () => {
        await expect.element(menu).toHaveAttribute('aria-hidden', 'true');
      });
      await expect.element(switchButton).toBeVisible();

      // When the switch is clicked
      await userEvent.click(switchButton);

      // Then the aria-hidden state lifts, the menu is visible
      await vi.waitFor(async () => {
        await expect.element(menu).not.toHaveAttribute('aria-hidden', 'true');
      });
      await expect.element(menu).toBeVisible();

      // and focus lands asynchronously on the first item
      await vi.waitFor(async () => {
        await expect.element(item1).toHaveFocus();
      });

      // When the last and first items are requested
      await userEvent.keyboard('{End}');
      await vi.waitFor(async () => {
        await expect.element(item3).toHaveFocus();
      });

      await userEvent.keyboard('{Home}');
      await vi.waitFor(async () => {
        await expect.element(item1).toHaveFocus();
      });

      // When the arrow keys walk the items
      await userEvent.keyboard('{ArrowDown}');
      await vi.waitFor(async () => {
        await expect.element(item2).toHaveFocus();
      });

      // and ArrowRight wraps forward to the submenu trigger
      await userEvent.keyboard('{ArrowRight}');
      await vi.waitFor(async () => {
        await expect.element(item3).toHaveFocus();
      });

      // and ArrowLeft and ArrowUp walk back to the first item
      await userEvent.keyboard('{ArrowLeft}');
      await vi.waitFor(async () => {
        await expect.element(item2).toHaveFocus();
      });

      await userEvent.keyboard('{ArrowUp}');
      await vi.waitFor(async () => {
        await expect.element(item1).toHaveFocus();
      });

      // and wrap around the menu edges
      await userEvent.keyboard('{ArrowLeft}');
      await vi.waitFor(async () => {
        await expect.element(item3).toHaveFocus();
      });

      await userEvent.keyboard('{ArrowDown}');
      await vi.waitFor(async () => {
        await expect.element(item1).toHaveFocus();
      });

      await userEvent.keyboard('{ArrowUp}');
      await vi.waitFor(async () => {
        await expect.element(item3).toHaveFocus();
      });

      // When ArrowRight enters the submenu of the focused trigger
      await userEvent.keyboard('{ArrowRight}');
      await vi.waitFor(async () => {
        await expect.element(item4).toHaveFocus();
      });

      // Then End and Home wrap within the submenu
      await userEvent.keyboard('{End}');
      await vi.waitFor(async () => {
        await expect.element(item7).toHaveFocus();
      });

      await userEvent.keyboard('{Home}');
      await vi.waitFor(async () => {
        await expect.element(item4).toHaveFocus();
      });

      // and ArrowDown skips the disabled item 5
      await userEvent.keyboard('{ArrowDown}');
      await vi.waitFor(async () => {
        await expect.element(item6).toHaveFocus();
      });

      // and ArrowRight enters the nested submenu on its trigger
      await userEvent.keyboard('{ArrowRight}');
      await vi.waitFor(async () => {
        await expect.element(item7).toHaveFocus();
      });

      // and ArrowUp walks back, skipping the disabled item again
      await userEvent.keyboard('{ArrowUp}');
      await vi.waitFor(async () => {
        await expect.element(item6).toHaveFocus();
      });

      await userEvent.keyboard('{ArrowUp}');
      await vi.waitFor(async () => {
        await expect.element(item4).toHaveFocus();
      });

      // and wraps around the submenu edges
      await userEvent.keyboard('{ArrowUp}');
      await vi.waitFor(async () => {
        await expect.element(item7).toHaveFocus();
      });

      await userEvent.keyboard('{ArrowDown}');
      await vi.waitFor(async () => {
        await expect.element(item4).toHaveFocus();
      });

      // When ArrowRight chains through the nested submenus down to item 10
      await userEvent.keyboard('{ArrowRight}');
      await vi.waitFor(async () => {
        await expect.element(item6).toHaveFocus();
      });

      await userEvent.keyboard('{ArrowRight}');
      await vi.waitFor(async () => {
        await expect.element(item7).toHaveFocus();
      });

      await userEvent.keyboard('{ArrowRight}');
      await vi.waitFor(async () => {
        await expect.element(item8).toHaveFocus();
      });

      await userEvent.keyboard('{ArrowRight}');
      await vi.waitFor(async () => {
        await expect.element(item9).toHaveFocus();
      });

      await userEvent.keyboard('{ArrowRight}');
      await vi.waitFor(async () => {
        await expect.element(item10).toHaveFocus();
      });

      // Then ArrowLeft pops back one submenu level to its trigger
      await userEvent.keyboard('{ArrowLeft}');
      await vi.waitFor(async () => {
        await expect.element(item9).toHaveFocus();
      });

      // and Escape pops back another level to the nested trigger
      await userEvent.keyboard('{Escape}');
      await vi.waitFor(async () => {
        await expect.element(item7).toHaveFocus();
      });

      // and ArrowLeft returns to the top-level trigger while the menu stays open
      await userEvent.keyboard('{ArrowLeft}');
      await vi.waitFor(async () => {
        await expect.element(item3).toHaveFocus();
      });

      await expect.element(menu).not.toHaveAttribute('aria-hidden', 'true');
      await expect.element(menu).toBeVisible();

      // When Escape closes the whole menu
      await userEvent.keyboard('{Escape}');

      // Then the menu host's aria-hidden state is restored
      await vi.waitFor(async () => {
        await expect.element(menu).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });
});
