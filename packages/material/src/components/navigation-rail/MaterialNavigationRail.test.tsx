import type { FlowComponent, VoidComponent } from 'solid-js';

import { Route } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import type { MaterialNavigationItemType } from '../navigation-item/MaterialNavigationItem';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialNavigationRailProps } from './MaterialNavigationRail';

import { MaterialNavigationRail } from './MaterialNavigationRail';

import PhotoFillIcon from '@solidmaterial/icons/400/outlined/photo-fill.svg';
import PhotoIcon from '@solidmaterial/icons/400/outlined/photo.svg';
import SpeakerFillIcon from '@solidmaterial/icons/400/outlined/speaker-fill.svg';
import SpeakerIcon from '@solidmaterial/icons/400/outlined/speaker.svg';
import VideocamFillIcon from '@solidmaterial/icons/400/outlined/videocam-fill.svg';
import VideocamIcon from '@solidmaterial/icons/400/outlined/videocam.svg';

// Written by GLM 5.3 Flash

// Fixtures copied from MaterialNavigationRail.vrt.test.tsx
const getItems = (): MaterialNavigationItemType[] => [
  {
    label: 'Photos',
    icon: PhotoIcon,
    activeIcon: PhotoFillIcon,
    href: '/photos',
    badge: {
      value: 2_000,
      ariaLabel: '2000 new photos'
    }
  },
  {
    label: 'Videos',
    icon: VideocamIcon,
    activeIcon: VideocamFillIcon,
    href: '/videos'
  },
  {
    label: 'Music',
    icon: SpeakerIcon,
    activeIcon: SpeakerFillIcon,
    href: '/music'
  }
];

const Wrapper: FlowComponent = props => {
  return (
    <MaterialTheme>
      <Route path="*" component={() => props.children} />
    </MaterialTheme>
  );
};

// A rail whose visibility (and appearance) is controlled by a signal, so the
// hide-while-hidden appearance behavior can be observed. Only show and the
// appearance props flip; the menu button stays so that the rail keeps its
// hidden-when-collapsed appearance
const HiddenRailFixture: VoidComponent<{ visible: boolean }> = props => (
  <MaterialNavigationRail
    show={props.visible}
    expanded={props.visible}
    modal={props.visible}
    center={props.visible}
    hideWhenCollapsed={props.visible}
    menuButton={{ title: 'Show', titleSelected: 'Hide' }}
    items={getItems()}
    ariaLabel="Navigation rail"
  />
);

const renderRail = async ({
  location = '/',
  ...props
}: Omit<MaterialNavigationRailProps, 'items'> & { location?: string }) => {
  await page.viewport(1024, 768);

  const { baseElement } = render(() => <MaterialNavigationRail {...props} items={getItems()} />, {
    wrapper: Wrapper,
    location
  });

  await document.fonts.ready;

  const screen = page.elementLocator(baseElement);

  // The location option wraps the fixture in a lazy component: wait until the
  // rail is mounted before the tests query it
  await expect.element(screen.getByElement('sm-navigation-rail')).toBeInTheDocument();

  return screen;
};

describe('MaterialNavigationRail', () => {
  describe('Interaction', () => {
    it('can move focus to its items using keyboard', async () => {
      const screen = await renderRail({ show: true, ariaLabel: 'Navigation rail' });

      // Given the rail's menubar is visible with three items
      const menubar = screen.getByRole('menubar');
      await expect.element(menubar).toBeVisible();

      const items = menubar.getByRole('menuitem');
      expect(items.elements()).toHaveLength(3);

      // and the first item has focus
      items.nth(0).element().focus();
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing arrow down, then focus moves to the item below
      await userEvent.keyboard('{ArrowDown}');
      await expect.element(items.nth(1)).toHaveFocus();

      // When pressing arrow up, then focus moves back to the item above
      await userEvent.keyboard('{ArrowUp}');
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing arrow up when the first item has focus
      await userEvent.keyboard('{ArrowUp}');
      // Then focus wraps around to the last item
      await expect.element(items.nth(2)).toHaveFocus();

      // When pressing arrow down when the last item has focus
      await userEvent.keyboard('{ArrowDown}');
      // Then focus wraps around to the first item
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing End, then focus moves to the last item
      await userEvent.keyboard('{End}');
      await expect.element(items.nth(2)).toHaveFocus();

      // When pressing Home, then focus moves to the first item
      await userEvent.keyboard('{Home}');
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing Enter on the focused item
      await userEvent.keyboard('{Enter}');

      // Then the item is activated (navigated to) instead of focused past
      await expect.element(items.nth(0)).toHaveAttribute('aria-current', 'page');
    });

    it('keeps its appearance while hidden', async () => {
      const [getVisible, setVisible] = createSignal(true);

      const { baseElement } = render(() => <HiddenRailFixture visible={getVisible()} />, {
        wrapper: Wrapper,
        location: '/'
      });
      const screen = page.elementLocator(baseElement);

      // Given the visible rail shows its modal, centered, always-expanded
      // appearance
      const rail = screen.getByElement('sm-navigation-rail');
      await expect.element(rail).toBeVisible();
      await expect.element(rail).toHaveAttribute('data-modal');
      await expect.element(rail).toHaveAttribute('data-center');
      await expect.element(rail).toHaveAttribute('data-always-expanded');
      await expect.element(rail).toHaveAttribute('data-show');

      // and its inner rail div is expanded
      const railDiv = screen.getByRole('menubar').element().parentElement?.parentElement;
      expect(railDiv?.dataset['expanded']).toBe('');

      // When the rail is hidden
      setVisible(false);

      // Then the rail keeps its previous appearance while it moves out of view
      await expect.element(rail).toHaveAttribute('data-modal');
      await expect.element(rail).toHaveAttribute('data-center');
      await expect.element(rail).toHaveAttribute('data-always-expanded');
      await expect.element(rail).toHaveAttribute('data-show');
      expect(railDiv?.dataset['expanded']).toBe('');
    });
  });

  describe('Secondary items', () => {
    it('does not render the secondary header when the items list is empty', async () => {
      const screen = await renderRail({
        show: true,
        expanded: true,
        secondary: { label: 'Secondary items', items: [] },
        ariaLabel: 'Navigation rail'
      });

      // Given the rail is visible
      const rail = screen.getByRole('navigation', { name: 'Navigation rail' });
      await expect.element(rail).toBeVisible();

      // Then the secondary header is not rendered
      await expect.element(screen.getByText('Secondary items')).not.toBeInTheDocument();

      // and only the three primary items exist
      expect(screen.getByRole('menuitem').elements()).toHaveLength(3);
    });

    it('renders a disabled secondary item', async () => {
      const screen = await renderRail({
        show: true,
        expanded: true,
        secondary: {
          label: 'Secondary items',
          items: [
            { label: 'Archive', icon: PhotoIcon, activeIcon: PhotoFillIcon, href: '/archive', disabled: true },
            { label: 'Trash', icon: VideocamIcon, activeIcon: VideocamFillIcon, href: '/trash' }
          ]
        },
        ariaLabel: 'Navigation rail'
      });

      // Given the expanded rail is visible
      const rail = screen.getByRole('navigation', { name: 'Navigation rail' });
      await expect.element(rail).toBeVisible();

      // Then the disabled secondary item is marked as disabled
      const disabledItem = screen.getByRole('menuitem', { name: 'Archive' });
      await expect.element(disabledItem).toHaveAttribute('data-disabled');

      // and the enabled secondary item is not
      const enabledItem = screen.getByRole('menuitem', { name: 'Trash' });
      await expect.element(enabledItem).not.toHaveAttribute('data-disabled');
    });
  });
});
