import type { FlowComponent, VoidComponent } from 'solid-js';

import { Route } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import type { MaterialNavigationItemType } from '../navigation-item/MaterialNavigationItem';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialNavigationRailProps, MaterialNavigationRailSecondaryItems } from './MaterialNavigationRail';

import { MaterialNavigationRail } from './MaterialNavigationRail';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';
import PhotoFillIcon from '@solidmaterial/icons/400/outlined/photo-fill.svg';
import PhotoIcon from '@solidmaterial/icons/400/outlined/photo.svg';
import SpeakerFillIcon from '@solidmaterial/icons/400/outlined/speaker-fill.svg';
import SpeakerIcon from '@solidmaterial/icons/400/outlined/speaker.svg';
import VideocamFillIcon from '@solidmaterial/icons/400/outlined/videocam-fill.svg';
import VideocamIcon from '@solidmaterial/icons/400/outlined/videocam.svg';

// Written by GLM 5.3 Flash

// Fixtures copied from MaterialNavigationRail.stories.tsx
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

const getSecondaryItems = (): MaterialNavigationRailSecondaryItems => ({
  label: 'Secondary items',
  items: [
    {
      label: 'Photos',
      icon: PhotoIcon,
      activeIcon: PhotoFillIcon,
      href: '/photos'
    },
    {
      label: 'Music',
      icon: SpeakerIcon,
      activeIcon: SpeakerFillIcon,
      href: '/music'
    }
  ]
});

const getFab = () => ({
  label: 'Edit',
  icon: EditIcon,
  ariaLabel: 'Edit button in navigation rail',
  onClick: vi.fn()
});

// How long to wait after rendering until the rail width and item row-gap
// spring transitions have settled
const SETTLE_TRANSITIONS_MS = 800;

const Wrapper: FlowComponent = props => {
  return (
    <MaterialTheme>
      <Route path="*" component={() => props.children} />
    </MaterialTheme>
  );
};

const RailFixture: VoidComponent<Omit<MaterialNavigationRailProps, 'items'>> = props => (
  <MaterialNavigationRail {...props} items={getItems()} />
);

// Prepares a freshly rendered rail for its screenshot: waits for the fonts
// and the width/row-gap spring transitions to settle and parks the pointer so
// hover state from a previous test cannot leak into the screenshot
const settleRender = async (baseElement: HTMLElement, renderedAt: number) => {
  await document.fonts.ready;

  const screen = page.elementLocator(baseElement);

  // Move the pointer to the top-left corner so that hover state from a
  // previous test does not leak into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 0, y: 0 } });

  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(renderedAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );

  return screen;
};

const renderComponent = async ({
  location = '/',
  ...props
}: Omit<MaterialNavigationRailProps, 'items'> & { location?: string }) => {
  const renderedAt = performance.now();

  const { baseElement } = render(() => <RailFixture {...props} />, { wrapper: Wrapper, location });

  return settleRender(baseElement, renderedAt);
};

describe('MaterialNavigationRail', () => {
  describe('Visual', () => {
    // Collapsed
    it('renders a collapsed rail', async () => {
      const screen = await renderComponent({ show: true, expanded: false, ariaLabel: 'Navigation rail' });

      // Given the rail is visible
      const rail = screen.getByRole('navigation', { name: 'Navigation rail' });
      await expect.element(rail).toBeVisible();

      await expect.element(screen.getByElement('sm-navigation-rail')).toMatchScreenshot();
    });

    // Expanded
    it('renders an expanded rail', async () => {
      const screen = await renderComponent({ show: true, expanded: true, ariaLabel: 'Navigation rail' });

      // Given the rail is visible
      const rail = screen.getByRole('navigation', { name: 'Navigation rail' });
      await expect.element(rail).toBeVisible();

      await expect.element(screen.getByElement('sm-navigation-rail')).toMatchScreenshot();
    });

    // Centered items
    it('renders a rail with centered items', async () => {
      const screen = await renderComponent({ show: true, center: true, ariaLabel: 'Navigation rail' });

      // Given the rail is visible
      const rail = screen.getByRole('navigation', { name: 'Navigation rail' });
      await expect.element(rail).toBeVisible();

      await expect.element(screen.getByElement('sm-navigation-rail')).toMatchScreenshot();
    });

    // Menu button
    it('renders a rail with a menu button', async () => {
      const screen = await renderComponent({
        show: true,
        menuButton: { title: 'Expand', titleSelected: 'Collapse' },
        ariaLabel: 'Navigation rail'
      });

      // Given the rail and its menu button are visible
      const rail = screen.getByRole('navigation', { name: 'Navigation rail' });
      await expect.element(rail).toBeVisible();

      const menuButton = screen.getByRole('switch', { name: 'Expand' });
      await expect.element(menuButton).toBeVisible();

      await expect.element(screen.getByElement('sm-navigation-rail')).toMatchScreenshot();
    });

    // FAB — icon-only when collapsed
    it('renders a rail with an icon-only fab', async () => {
      const screen = await renderComponent({ show: true, fab: getFab(), ariaLabel: 'Navigation rail' });

      // Given the rail is visible
      const rail = screen.getByRole('navigation', { name: 'Navigation rail' });
      await expect.element(rail).toBeVisible();

      // and the icon-only fab is visible
      const fab = screen.getByRole('button', { name: 'Edit button in navigation rail' });
      await expect.element(fab).toBeVisible();

      await expect.element(screen.getByElement('sm-navigation-rail')).toMatchScreenshot();
    });

    // FAB — with label when expanded
    it('renders an expanded rail with a labeled fab', async () => {
      const screen = await renderComponent({
        show: true,
        expanded: true,
        fab: getFab(),
        ariaLabel: 'Navigation rail'
      });

      // Given the rail is visible
      const rail = screen.getByRole('navigation', { name: 'Navigation rail' });
      await expect.element(rail).toBeVisible();

      // and the labeled fab is visible
      const fab = screen.getByRole('button', { name: 'Edit' });
      await expect.element(fab).toBeVisible();

      await expect.element(screen.getByElement('sm-navigation-rail')).toMatchScreenshot();
    });

    // Secondary items — they require an expanded rail
    it('renders an expanded rail with secondary items', async () => {
      const screen = await renderComponent({
        show: true,
        expanded: true,
        secondary: getSecondaryItems(),
        ariaLabel: 'Navigation rail'
      });

      // Given the rail is visible
      const rail = screen.getByRole('navigation', { name: 'Navigation rail' });
      await expect.element(rail).toBeVisible();

      // and the secondary header is visible
      await expect.element(screen.getByText('Secondary items')).toBeVisible();

      // and the rail contains the three primary and two secondary items
      expect(screen.getByRole('menuitem').elements()).toHaveLength(5);

      await expect.element(screen.getByElement('sm-navigation-rail')).toMatchScreenshot();
    });

    // Modal rail
    it('renders a modal rail with a menu button', async () => {
      const screen = await renderComponent({
        show: true,
        modal: true,
        menuButton: { title: 'Expand', titleSelected: 'Collapse' },
        fab: getFab(),
        ariaLabel: 'Navigation rail'
      });

      // Given the rail is visible
      const rail = screen.getByRole('navigation', { name: 'Navigation rail' });
      await expect.element(rail).toBeVisible();

      await expect.element(screen.getByElement('sm-navigation-rail')).toMatchScreenshot();
    });

    // Hidden when collapsed — a modal rail with a menu button and
    // hideWhenCollapsed is moved out of view while it is collapsed
    it('renders a modal rail which is hidden when collapsed', async () => {
      const screen = await renderComponent({
        show: true,
        modal: true,
        hideWhenCollapsed: true,
        expanded: false,
        menuButton: { title: 'Show', titleSelected: 'Hide' },
        ariaLabel: 'Navigation rail'
      });

      // Given the rail is always expanded while hidden
      const rail = screen.getByRole('navigation', { name: 'Navigation rail' });
      await expect.element(rail).toBeVisible();
      await expect.element(rail).toHaveAttribute('data-always-expanded');
      await expect.element(rail).not.toHaveAttribute('data-show');

      // Then the rail is moved out of view: the menu button is hidden
      const menuButton = screen.getByRole('switch', { name: 'Show', includeHidden: true });
      expect(getComputedStyle(menuButton.element()).visibility).toBe('hidden');
    });

    // Hidden when collapsed — shown when expanded
    it('renders a modal rail which is shown when expanded', async () => {
      const screen = await renderComponent({
        show: true,
        modal: true,
        hideWhenCollapsed: true,
        expanded: true,
        menuButton: { title: 'Show', titleSelected: 'Hide' },
        ariaLabel: 'Navigation rail'
      });

      // Given the rail is shown
      const rail = screen.getByRole('navigation', { name: 'Navigation rail' });
      await expect.element(rail).toBeVisible();
      await expect.element(rail).toHaveAttribute('data-show');

      await expect.element(screen.getByElement('sm-navigation-rail')).toMatchScreenshot();
    });

    // Active item — the item matching the current location is active
    it('renders a rail with an active item', async () => {
      const screen = await renderComponent({ show: true, ariaLabel: 'Navigation rail', location: '/photos' });

      // Given the rail is visible
      const rail = screen.getByRole('navigation', { name: 'Navigation rail' });
      await expect.element(rail).toBeVisible();

      // Then the item matching the current location is active
      const activeItem = screen.getByRole('menuitem', { name: '[Photos] 2000 new photos' });
      await expect.element(activeItem).toHaveAttribute('aria-current', 'page');

      // and the other items are not
      await expect.element(screen.getByRole('menuitem', { name: 'Videos' })).not.toHaveAttribute('aria-current');

      await expect.element(screen.getByElement('sm-navigation-rail')).toMatchScreenshot();
    });
  });
});
