import type { FlowComponent } from 'solid-js';
import type { SetStoreFunction } from 'solid-js/store';

import { Route } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import { createStore } from 'solid-js/store';
import { Dynamic } from 'solid-js/web';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import type { MaterialIconSvg } from '../../components/icon/MaterialIcon';
import type { MaterialNavigationItemType } from '../../components/navigation-item/MaterialNavigationItem';
import type { MaterialNavigationRailFab } from '../../components/navigation-rail/MaterialNavigationRailFabButton';
import type { MaterialSnack } from '../../components/snackbar/MaterialSnackbarContext';

import { MaterialFab } from '../../components/fab/MaterialFab';
import { MaterialSnackbarContext } from '../../components/snackbar/MaterialSnackbarContext';
import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialPane } from '../pane/MaterialPane';

import type { MaterialNavigationLayoutProps } from './MaterialNavigationLayout.types';

import { MaterialNavigationLayout } from './MaterialNavigationLayout';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';
import PhotoFillIcon from '@solidmaterial/icons/400/outlined/photo-fill.svg';
import PhotoIcon from '@solidmaterial/icons/400/outlined/photo.svg';
import SpeakerFillIcon from '@solidmaterial/icons/400/outlined/speaker-fill.svg';
import SpeakerIcon from '@solidmaterial/icons/400/outlined/speaker.svg';
import ToastIcon from '@solidmaterial/icons/400/outlined/toast.svg';
import VideocamFillIcon from '@solidmaterial/icons/400/outlined/videocam-fill.svg';
import VideocamIcon from '@solidmaterial/icons/400/outlined/videocam.svg';

// Written by GLM 5.3 Flash

// How long to wait after rendering or interacting until the rail width and
// item gap springs and the snackbar enter transition have settled
const SETTLE_TRANSITIONS_MS = 800;

// Breakpoint-driven viewport sizes: compact < 600, medium 600-839, expanded
// 840-1199. Never request more than 1280x720 — larger sizes would be scaled
// down by the test orchestrator
const COMPACT_VIEWPORT = { width: 375, height: 667 };
const MEDIUM_VIEWPORT = { width: 800, height: 720 };
const EXPANDED_VIEWPORT = { width: 1024, height: 768 };

// Fixtures copied from MaterialNavigationLayout.stories.tsx
const getItems = (): MaterialNavigationItemType[] => [
  {
    label: 'Photos',
    icon: PhotoIcon,
    activeIcon: PhotoFillIcon,
    href: '/',
    end: true,
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

const Wrapper: FlowComponent = props => (
  <MaterialTheme>
    <Route path="*" component={() => props.children} />
  </MaterialTheme>
);

interface SnackbarStore {
  get: MaterialSnack[];
  set: SetStoreFunction<MaterialSnack[]>;
}

interface BarFabFixture {
  icon: MaterialIconSvg;
  label: string;
  onClick?: () => void;
}

interface RenderLayoutProps extends Omit<MaterialNavigationLayoutProps, 'items' | 'fab'> {
  location?: string;
  viewport?: { width: number; height: number };
  // Plain-value fixtures for the FABs: the bar FAB JSX must be constructed
  // inside the render accessor
  railFab?: MaterialNavigationRailFab;
  barFab?: BarFabFixture;
  // Wraps the layout in a fresh snackbar context store so the module-level
  // default store cannot leak state between tests
  snackbarStore?: SnackbarStore;
}

// Prepares a freshly rendered layout for its screenshot: waits for the fonts,
// parks the pointer so hover state from a previous test cannot leak into the
// screenshot, and waits for the rail width and item gap springs to settle
const settleRender = async (
  baseElement: HTMLElement,
  renderedAt: number,
  viewport: { width: number; height: number }
) => {
  await document.fonts.ready;

  const screen = page.elementLocator(baseElement);

  // Move the pointer to the center of the content area so that hover state
  // from a previous test cannot leak into this test's screenshots: the rail,
  // bar, and FAB hug the edges, the center is always plain content
  await userEvent.hover(document.body, {
    position: { x: Math.round(viewport.width / 2), y: Math.round(viewport.height / 2) }
  });

  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(renderedAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );

  return screen;
};

// Waits for the rail width and item gap springs after an interaction and
// parks the pointer so hover state from the interaction cannot leak into the
// screenshot
const settleTransitions = async (interactedAt: number, viewport: { width: number; height: number }) => {
  // Move the pointer to the center of the content area so that hover state
  // from the interaction does not leak into this test's screenshots
  await userEvent.hover(document.body, {
    position: { x: Math.round(viewport.width / 2), y: Math.round(viewport.height / 2) }
  });

  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(interactedAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );
};

// Renders the stories' fixture. The viewport is set explicitly before
// rendering because it persists across tests within this file: the rail
// layout picks its expanded state on first render
const renderComponent = async ({
  location = '/',
  viewport = EXPANDED_VIEWPORT,
  menuButton = { title: 'Expand', titleSelected: 'Collapse' },
  railFab,
  barFab,
  snackbarStore,
  ...props
}: RenderLayoutProps) => {
  await page.viewport(viewport.width, viewport.height);

  const renderedAt = performance.now();

  const { baseElement } = render(
    () => {
      const fab =
        railFab === undefined && barFab === undefined
          ? undefined
          : {
              ...(railFab !== undefined ? { rail: railFab } : {}),
              bar:
                barFab !== undefined ? (
                  <MaterialFab icon={<Dynamic component={barFab.icon} />} onClick={barFab.onClick}>
                    {barFab.label}
                  </MaterialFab>
                ) : undefined
            };

      // The layout must be rendered as a component so that it executes
      // inside the snackbar context provider: a pre-constructed element
      // would run the tree before the provider exists, and the snackbar
      // container would read the module-level default store
      const Layout = () => (
        <MaterialNavigationLayout {...props} items={getItems()} fab={fab} menuButton={menuButton}>
          <MaterialPane>
            <main>Main content</main>
          </MaterialPane>
        </MaterialNavigationLayout>
      );

      return snackbarStore !== undefined ? (
        <MaterialSnackbarContext.Provider value={[snackbarStore.get, snackbarStore.set]}>
          <Layout />
        </MaterialSnackbarContext.Provider>
      ) : (
        <Layout />
      );
    },
    { wrapper: Wrapper, location }
  );

  return settleRender(baseElement, renderedAt, viewport);
};

describe('MaterialNavigationLayout', () => {
  describe('Visual', () => {
    describe('Expanded width', () => {
      it('renders a collapsed rail', async () => {
        const screen = await renderComponent({ show: true, ariaLabel: 'Navigation layout' });

        // Given the rail is visible with all items
        const rail = screen.getByElement('sm-navigation-rail');
        await expect.element(rail).toBeVisible();
        await expect.element(rail.getByRole('menuitem', { name: '[Photos] 2000 new photos' })).toBeVisible();
        await expect.element(rail.getByRole('menuitem', { name: 'Videos' })).toBeVisible();
        await expect.element(rail.getByRole('menuitem', { name: 'Music' })).toBeVisible();

        await expect.element(screen.getByElement('sm-nav-bar-layout')).toMatchScreenshot();
      });

      it('renders a rail with an active item', async () => {
        const screen = await renderComponent({ show: true, ariaLabel: 'Navigation layout', location: '/videos' });

        // Given the rail is visible
        const rail = screen.getByElement('sm-navigation-rail');
        await expect.element(rail).toBeVisible();

        // Then the item matching the current location is active
        const videos = rail.getByRole('menuitem', { name: 'Videos' });
        await expect.element(videos).toHaveAttribute('aria-current', 'page');

        // and the other items are not
        await expect
          .element(rail.getByRole('menuitem', { name: '[Photos] 2000 new photos' }))
          .not.toHaveAttribute('aria-current');

        await expect.element(screen.getByElement('sm-nav-bar-layout')).toMatchScreenshot();
      });

      it('renders an expanded rail', async () => {
        const screen = await renderComponent({ show: true, ariaLabel: 'Navigation layout' });

        // Given the rail is visible
        const rail = screen.getByElement('sm-navigation-rail');
        await expect.element(rail).toBeVisible();

        // When clicking the menu button
        const interactedAt = performance.now();
        const menuButton = rail.getByRole('switch');
        await expect.element(menuButton).toBeVisible();
        await expect.element(menuButton).toHaveAccessibleName('Expand');
        await userEvent.click(menuButton);
        await userEvent.unhover(menuButton);

        // Then the items are expanded
        await expect
          .element(rail.getByRole('menuitem', { name: '[Photos] 2000 new photos' }))
          .toHaveAttribute('data-expanded');
        await expect.element(rail.getByRole('menuitem', { name: 'Videos' })).toHaveAttribute('data-expanded');

        // and the menu button is selected
        await expect.element(menuButton).toHaveAccessibleName('Collapse');

        await settleTransitions(interactedAt, EXPANDED_VIEWPORT);

        await expect.element(screen.getByElement('sm-nav-bar-layout')).toMatchScreenshot();
      });

      it('renders a rail fab', async () => {
        const screen = await renderComponent({
          show: true,
          ariaLabel: 'Navigation layout',
          railFab: { label: 'Edit', icon: EditIcon, ariaLabel: 'Edit' },
          barFab: { icon: PhotoIcon, label: 'Above bar' }
        });

        // Given the rail is visible
        const rail = screen.getByElement('sm-navigation-rail');
        await expect.element(rail).toBeVisible();

        // and the rail fab is visible
        const fab = rail.getByRole('button', { name: 'Edit' });
        await expect.element(fab).toBeVisible();

        // and the bar fab is hidden while the bar is hidden
        await expect.element(screen.getByRole('button', { name: 'Above bar', includeHidden: true })).not.toBeVisible();

        await expect.element(screen.getByElement('sm-nav-bar-layout')).toMatchScreenshot();
      });

      it('renders a modal rail', async () => {
        const screen = await renderComponent({ show: true, ariaLabel: 'Navigation layout', preferSpace: 'horizontal' });

        // Given the rail is visible and modal
        const rail = screen.getByElement('sm-navigation-rail');
        await expect.element(rail).toBeVisible();
        await expect.element(rail).toHaveAttribute('data-modal');

        await expect.element(screen.getByElement('sm-nav-bar-layout')).toMatchScreenshot();
      });
    });

    describe('Medium width', () => {
      it('renders a modal rail with centered items', async () => {
        const screen = await renderComponent({
          show: true,
          ariaLabel: 'Navigation layout',
          viewport: MEDIUM_VIEWPORT
        });

        // Given the rail is visible, modal, and centered
        const rail = screen.getByElement('sm-navigation-rail');
        await expect.element(rail).toBeVisible();
        await expect.element(rail).toHaveAttribute('data-modal');
        await expect.element(rail).toHaveAttribute('data-center');

        await expect.element(screen.getByElement('sm-nav-bar-layout')).toMatchScreenshot();
      });

      it('renders a navigation bar with labels when preferSpace = horizontal', async () => {
        const screen = await renderComponent({
          show: true,
          ariaLabel: 'Navigation layout',
          preferSpace: 'horizontal',
          viewport: MEDIUM_VIEWPORT
        });

        // Given the navigation bar is visible
        const bar = screen.getByElement('sm-navigation-bar');
        await expect.element(bar).toBeVisible();

        await expect.element(screen.getByElement('sm-nav-bar-layout')).toMatchScreenshot();
      });
    });

    describe('Compact width', () => {
      it('renders a navigation bar', async () => {
        const screen = await renderComponent({
          show: true,
          ariaLabel: 'Navigation layout',
          viewport: COMPACT_VIEWPORT
        });

        // Given the navigation bar is visible
        const bar = screen.getByElement('sm-navigation-bar');
        await expect.element(bar).toBeVisible();

        // and the rail is out of view
        const rail = screen.getByElement('sm-navigation-rail');
        await expect.element(rail).not.toHaveAttribute('data-show');

        await expect.element(screen.getByElement('sm-nav-bar-layout')).toMatchScreenshot();
      });

      it('renders a fab above the navigation bar', async () => {
        const screen = await renderComponent({
          show: true,
          ariaLabel: 'Navigation layout',
          viewport: COMPACT_VIEWPORT,
          barFab: { icon: PhotoIcon, label: 'Above bar' }
        });

        // Given the navigation bar is visible
        const bar = screen.getByElement('sm-navigation-bar');
        await expect.element(bar).toBeVisible();

        // and the fab is visible above the bar
        const fab = screen.getByRole('button', { name: 'Above bar' });
        await expect.element(fab).toBeVisible();

        await expect.element(screen.getByElement('sm-nav-bar-layout')).toMatchScreenshot();
      });

      it('renders a modal rail which is hidden when collapsed', async () => {
        const screen = await renderComponent({
          show: true,
          ariaLabel: 'Navigation layout',
          preferSpace: 'vertical',
          viewport: COMPACT_VIEWPORT
        });

        // Given the rail is always expanded while hidden
        const rail = screen.getByElement('sm-navigation-rail');
        await expect.element(rail).toBeVisible();
        await expect.element(rail).toHaveAttribute('data-always-expanded');
        await expect.element(rail).not.toHaveAttribute('data-show');

        // Then the rail is moved out of view: the menu button is hidden
        const menuButton = rail.getByRole('switch', { name: 'Expand', includeHidden: true });
        expect(getComputedStyle(menuButton.element()).visibility).toBe('hidden');

        await expect.element(screen.getByElement('sm-nav-bar-layout')).toMatchScreenshot();
      });
    });

    // The snackbar is a popover anchored above the fab; it is enqueued
    // through a fresh context store so the module-level store cannot leak
    // state between tests, and it is the last test in this file as an extra
    // guard against store leaks
    it('renders a snackbar above the fab', async () => {
      const [get, set] = createStore<MaterialSnack[]>([]);

      const screen = await renderComponent({
        show: true,
        ariaLabel: 'Navigation layout',
        snackbarCloseTitle: 'Close',
        viewport: COMPACT_VIEWPORT,
        snackbarStore: { get, set },
        barFab: {
          icon: ToastIcon,
          label: 'Show snackbar',
          onClick: () => set(get.length, { text: 'Supporting text', dismissable: true, duration: 'indefinite' })
        }
      });

      // Given the fab is visible
      const fab = screen.getByRole('button', { name: 'Show snackbar' });
      await expect.element(fab).toBeVisible();

      // When clicking the fab
      const interactedAt = performance.now();
      await userEvent.click(fab);
      await userEvent.unhover(fab);

      // Then the snackbar has entered the screen as a popover
      const status = screen.getByRole('status');
      await vi.waitFor(
        async () => {
          await expect.element(status).toBeVisible();
        },
        { timeout: 5000 }
      );

      // and its close button is visible
      const close = screen.getByRole('button', { name: 'Close' });
      await expect.element(close).toBeVisible();

      await settleTransitions(interactedAt, COMPACT_VIEWPORT);

      // and the snackbar sits above the fab
      const snackbarRect = status.element().getBoundingClientRect();
      const fabRect = fab.element().getBoundingClientRect();
      expect(snackbarRect.bottom).toBeLessThanOrEqual(fabRect.top);

      await expect.element(screen.getByElement('sm-nav-bar-layout')).toMatchScreenshot();
    });
  });
});
