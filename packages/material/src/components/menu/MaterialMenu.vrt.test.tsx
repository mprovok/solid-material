import type { VoidComponent } from 'solid-js';
import type { Locator } from 'vitest/browser';

import { render } from '@solidjs/testing-library';
import { Show, createSignal } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialButton } from '../button/MaterialButton';

import type { MaterialMenuPlacement } from './MaterialMenu';

import { MaterialMenu } from './MaterialMenu';
import { MaterialMenuAnchor } from './MaterialMenuAnchor';
import { MaterialMenuItem } from './MaterialMenuItem';
import { MaterialSubMenu } from './MaterialSubMenu';

// Written by GLM 5.3 Flash

const emptyFn = () => {
  // Empty
};

// How long to wait after opening the menu until the opening transition has
// settled
const SETTLE_TRANSITIONS_MS = 800;

// Mirrors the MaterialMenuRenderer fixture from MaterialMenu.stories.tsx: an
// anchor button and the controlled menu, flex-centered inside the wrapper
// element which is the screenshot target and large enough for every placement
const MenuRenderer: VoidComponent<{
  ariaLabel?: string;
  offset?: [number, number];
  placement?: MaterialMenuPlacement;
  withLink?: boolean;
}> = props => {
  const [isOpen, setOpen] = createSignal(false);

  // oxlint-disable-next-line no-unassigned-vars
  let menuRef!: HTMLDivElement;

  const onCloseMenu = () => setOpen(false);

  return (
    <main style={{ padding: '1rem' }}>
      <div
        style={{
          width: '800px',
          height: '600px',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center'
        }}
      >
        <MaterialMenuAnchor ref={menuRef}>
          <MaterialButton variant="tonal" toggle={isOpen()} onClick={() => setOpen(v => !v)}>
            Open menu
          </MaterialButton>
        </MaterialMenuAnchor>
        <MaterialMenu
          open={isOpen()}
          ariaLabel={props.ariaLabel}
          anchor={menuRef}
          placement={props.placement}
          offset={props.offset}
          onClose={onCloseMenu}
        >
          <MaterialMenuItem selected onClick={emptyFn}>
            Menu item 1
          </MaterialMenuItem>
          <MaterialMenuItem onClick={emptyFn}>Menu item 2</MaterialMenuItem>
          <MaterialMenuItem disabled onClick={emptyFn}>
            Menu item 3
          </MaterialMenuItem>
          <Show when={props.withLink}>
            <MaterialMenuItem href="/" onClick={emptyFn}>
              Link item
            </MaterialMenuItem>
          </Show>
        </MaterialMenu>
      </div>
    </main>
  );
};

// Mirrors the Submenus story fixture: menu item 3 is a submenu with items 4 to
// 6, where item 5 is disabled
const SubmenuRenderer: VoidComponent = () => {
  const [isOpen, setOpen] = createSignal(false);

  // oxlint-disable-next-line no-unassigned-vars
  let menuRef!: HTMLDivElement;

  const onCloseMenu = () => setOpen(false);

  return (
    <main style={{ padding: '1rem' }}>
      <div
        style={{
          width: '800px',
          height: '600px',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center'
        }}
      >
        <MaterialMenuAnchor ref={menuRef}>
          <MaterialButton variant="tonal" toggle={isOpen()} onClick={() => setOpen(v => !v)}>
            Open menu
          </MaterialButton>
        </MaterialMenuAnchor>
        <MaterialMenu
          open={isOpen()}
          ariaLabel="Menu with submenus"
          anchor={menuRef}
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
          </MaterialSubMenu>
        </MaterialMenu>
      </div>
    </main>
  );
};

const renderComponent = async (
  props: { ariaLabel?: string; offset?: [number, number]; placement?: MaterialMenuPlacement; withLink?: boolean } = {}
) => {
  const { baseElement } = render(() => <MenuRenderer {...props} />, { wrapper: MaterialTheme });
  await document.fonts.ready;
  // Move the pointer to the middle of the page so that hover state from a
  // previous test or the browser's initial pointer position does not leak
  // into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 400, y: 300 } });
  return page.elementLocator(baseElement);
};

// Opens the menu with the anchor button and settles the opening transition,
// parking the pointer afterwards so hover state from the click cannot leak
// into the screenshot. md-menu sets its menu role via element internals, so
// getByRole('menu') cannot resolve it and the element and its items are used
// instead
const openMenu = async (screen: Locator) => {
  const button = screen.getByRole('switch', { name: 'Open menu' });
  await expect.element(button).toBeVisible();

  await userEvent.click(button);
  await userEvent.unhover(button);

  // Given the menu has opened
  const menu = screen.getByElement('md-menu[aria-label]');
  await expect.element(menu).not.toHaveAttribute('aria-hidden', 'true');
  await expect.element(screen.getByText('Menu item 1')).toBeVisible();

  // Move the pointer to the top-left corner so that hover state from the
  // click does not leak into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 0, y: 0 } });

  const openedAt = performance.now();
  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(openedAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );

  return menu;
};

describe('MaterialMenu', () => {
  describe('Visual', () => {
    it('renders the menu closed', async () => {
      const screen = await renderComponent();

      // Move the pointer to the top-left corner: the pointer is parked at the
      // middle of the page where the centered anchor button is, which would
      // show its hover state in this at-rest capture
      await userEvent.hover(document.body, { position: { x: 0, y: 0 } });

      // Given the anchor button is visible
      const button = screen.getByRole('switch', { name: 'Open menu' });
      await expect.element(button).toBeVisible();

      // and the menu is in the DOM but hidden
      const menu = screen.getByElement('md-menu');
      await expect.element(menu).toHaveAttribute('aria-hidden', 'true');

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders an open menu with selected, normal and disabled items', async () => {
      const screen = await renderComponent({ ariaLabel: 'Menu', withLink: true });

      await openMenu(screen);

      // Given the menu contains a link item (the link role does not resolve
      // through the menu item, so the item is asserted by its attributes)
      const linkItem = screen.getByElement('md-menu-item[href]');
      await expect.element(linkItem).toBeVisible();
      await expect.element(linkItem).toHaveAttribute('href', '/');

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it.each([
      ['left', 'start'],
      ['left', 'end'],
      ['right', 'start'],
      ['right', 'end'],
      ['top', 'start'],
      ['top', 'end'],
      ['bottom', 'start'],
      ['bottom', 'end']
    ] satisfies MaterialMenuPlacement[])('renders an open menu with placement $0 $1', async (side, alignment) => {
      const screen = await renderComponent({ ariaLabel: 'Menu', placement: [side, alignment] });

      await openMenu(screen);

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders an open menu with an offset', async () => {
      const screen = await renderComponent({ ariaLabel: 'Menu', placement: ['right', 'start'], offset: [4, 0] });

      await openMenu(screen);

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders an open menu with an open submenu', async () => {
      const { baseElement } = render(() => <SubmenuRenderer />, { wrapper: MaterialTheme });
      await document.fonts.ready;
      // Move the pointer to the middle of the page so that hover state from a
      // previous test or the browser's initial pointer position does not leak
      // into this test's screenshots
      await userEvent.hover(document.body, { position: { x: 400, y: 300 } });
      const screen = page.elementLocator(baseElement);

      await openMenu(screen);

      // When the submenu item is hovered
      const submenuItem = screen.getByText('Menu item 3');
      await userEvent.hover(submenuItem);

      // Then the submenu opens with its items visible, while the pointer
      // stays parked on the submenu item so the hover state is deterministic
      await expect.element(screen.getByText('Menu item 4')).toBeVisible();
      await expect.element(screen.getByText('Menu item 6')).toBeVisible();

      const openedAt = performance.now();
      await vi.waitFor(
        () => {
          expect(performance.now()).toBeGreaterThanOrEqual(openedAt + SETTLE_TRANSITIONS_MS);
        },
        { timeout: 2000 }
      );

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });
  });
});
