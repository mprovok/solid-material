import type { FlowComponent, VoidComponent } from 'solid-js';

import { Route } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import type { MaterialNavigationItemType } from '../../components/navigation-item/MaterialNavigationItem';
import type { MaterialNavigationRailFab } from '../../components/navigation-rail/MaterialNavigationRailFabButton';
import type { MaterialNavigationLayoutProps } from '../navigation-layout/MaterialNavigationLayout.types';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialPane } from '../pane/MaterialPane';

import { MaterialNavigationRailLayout } from './MaterialNavigationRailLayout';
import { MaterialNavigationRailLayoutMenuButton } from './MaterialNavigationRailLayoutMenuButton';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';
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
    href: '/photos'
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

const getSecondaryItems = () => ({
  label: 'Secondary items',
  items: [
    {
      label: 'Archive',
      icon: PhotoIcon,
      activeIcon: PhotoFillIcon,
      href: '/archive'
    },
    {
      label: 'Trash',
      icon: VideocamIcon,
      activeIcon: VideocamFillIcon,
      href: '/trash'
    }
  ]
});

const getFab = (): MaterialNavigationRailFab => ({
  label: 'Edit',
  icon: EditIcon,
  onClick: vi.fn()
});

// A fourth item so the rail layout counts as having many items
const getManyItems = (): MaterialNavigationItemType[] => [
  ...getItems(),
  {
    label: 'Podcasts',
    icon: SpeakerIcon,
    activeIcon: SpeakerFillIcon,
    href: '/podcasts'
  }
];

const Wrapper: FlowComponent = props => {
  return (
    <MaterialTheme>
      <Route path="*" component={() => props.children} />
    </MaterialTheme>
  );
};

interface LayoutFixtureProps extends Omit<MaterialNavigationLayoutProps, 'children'> {
  menuButtonAriaLabel?: string;
}

const LayoutFixture: VoidComponent<LayoutFixtureProps> = props => (
  <MaterialNavigationRailLayout {...props}>
    <MaterialPane>
      <main>Main content</main>
      <MaterialNavigationRailLayoutMenuButton ariaLabel={props.menuButtonAriaLabel ?? 'Menu button'} />
    </MaterialPane>
  </MaterialNavigationRailLayout>
);

// The viewport is set explicitly before rendering because it persists across
// tests within this file: the layout picks its rendering on first render
const renderLayout = async ({
  location = '/',
  viewport = { width: 1024, height: 768 },
  ...props
}: LayoutFixtureProps & { location?: string; viewport?: { width: number; height: number } }) => {
  await page.viewport(viewport.width, viewport.height);

  const { baseElement } = render(() => <LayoutFixture {...props} />, { wrapper: Wrapper, location });

  await document.fonts.ready;

  const screen = page.elementLocator(baseElement);

  // The location option wraps the fixture in a lazy component: wait until the
  // layout is mounted before the tests query it
  await expect.element(screen.getByElement('sm-nav-rail-layout')).toBeInTheDocument();

  return screen;
};

describe('MaterialNavigationRailLayout', () => {
  describe('Visual', () => {
    it('renders rail with items, secondary items and children', async () => {
      const screen = await renderLayout({ items: getItems(), secondary: getSecondaryItems() });

      // Given the rail and the children are visible
      const rail = screen.getByElement('sm-navigation-rail');
      await expect.element(rail).toBeVisible();

      await expect.element(screen.getByText('Main content')).toBeVisible();

      // Then the primary and secondary items exist. The rail starts collapsed,
      // and the layout fades out the secondary items while collapsed, so the
      // secondary items are asserted including hidden elements
      expect(screen.getByRole('menuitem', { includeHidden: true }).elements()).toHaveLength(5);
      await expect.element(screen.getByText('Secondary items')).toBeInTheDocument();

      // and the rail is shown
      expect(rail.element().parentElement?.dataset['show'], 'expected the rail wrapper to carry data-show').toBe('');
    });

    it('hides rail when show is false', async () => {
      const screen = await renderLayout({ items: getItems(), show: false });

      // Given the rail is rendered
      const rail = screen.getByElement('sm-navigation-rail');

      // Then the rail wrapper does not carry data-show and the rail is hidden
      expect(rail.element().parentElement?.dataset['show']).toBeUndefined();
      await expect.element(rail).not.toBeVisible();
    });
  });

  describe('Interaction', () => {
    it('menu button toggles expanded state', async () => {
      const screen = await renderLayout({
        items: getItems(),
        menuButton: { title: 'Expand', titleSelected: 'Collapse' }
      });

      // Given the collapsed rail with its menu button
      const menuButton = screen.getByRole('switch', { name: 'Expand' });
      await expect.element(menuButton).toBeVisible();

      const firstItem = screen.getByRole('menuitem').nth(0);
      await expect.element(firstItem).not.toHaveAttribute('data-expanded');

      // When the menu button is clicked
      await userEvent.click(menuButton);

      // Then the rail expands and the menu button's name flips
      await expect.element(screen.getByRole('switch', { name: 'Collapse' })).toBeVisible();
      await expect.element(firstItem).toHaveAttribute('data-expanded');

      // When the menu button is clicked again
      await userEvent.click(screen.getByRole('switch', { name: 'Collapse' }));

      // Then the rail collapses again
      await expect.element(screen.getByRole('switch', { name: 'Expand' })).toBeVisible();
      await expect.element(firstItem).not.toHaveAttribute('data-expanded');
    });
  });

  describe('Context defaults', () => {
    it('context defaults are inert without a provider', async () => {
      const { baseElement } = render(() => <MaterialNavigationRailLayoutMenuButton ariaLabel="Menu button" />, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);

      // Then the menu button is not rendered and nothing crashes
      await expect.element(screen.getByRole('switch', { name: 'Menu button' })).not.toBeInTheDocument();
    });
  });

  describe('Compact height', () => {
    it('counts many items with a fab as modal on compact height', async () => {
      const screen = await renderLayout({
        items: getManyItems(),
        menuButton: { title: 'Expand', titleSelected: 'Collapse' },
        fab: { rail: getFab(), bar: <div>Fab bar</div> },
        viewport: { width: 1024, height: 400 }
      });

      // Given the compact height viewport with a fab and four items
      // Then the rail is modal and hidden when collapsed, so the layout's menu
      // button placed in the children is rendered
      await expect.element(screen.getByRole('switch', { name: 'Menu button' })).toBeVisible();
    });

    it('does not count many items without a fab on compact height', async () => {
      const screen = await renderLayout({
        items: getManyItems(),
        viewport: { width: 1024, height: 400 }
      });

      // Given the compact height viewport with four items but no fab
      // Then the rail is not modal, so the layout's menu button in the
      // children is not rendered
      await expect.element(screen.getByRole('switch', { name: 'Menu button' })).not.toBeInTheDocument();
    });
  });
});
