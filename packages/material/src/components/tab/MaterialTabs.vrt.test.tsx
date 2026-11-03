import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialTabsProps } from './MaterialTabs';

import { MaterialTabs } from './MaterialTabs';

import MusicIcon from '@solidmaterial/icons/400/rounded/music_note.svg';
import PhotoIcon from '@solidmaterial/icons/400/rounded/photo.svg';
import VideocamIcon from '@solidmaterial/icons/400/rounded/videocam.svg';

// Written by GLM 5.3 Flash

// How long to wait after rendering until the active indicator's initial
// positioning animation has settled
const SETTLE_TRANSITIONS_MS = 800;

// Mirrors the Photos/Videos/Music fixture from MaterialTabs.stories.tsx
//
// The fixture is returned by a factory which `renderComponent` calls inside
// the render root: instantiating the icons' JSX outside of `render()` makes
// Solid's dev-mode `spread` create render effects with no owner, printing
// "computations created outside a `createRoot` or `render` will never be
// disposed" for each of them (and leaking those computations)
const getTabs = (): MaterialTabsProps['tabs'] => [
  {
    label: 'Photos',
    icon: <PhotoIcon />,
    panel: () => <div>Photos panel</div>
  },
  {
    label: 'Videos',
    icon: <VideocamIcon />,
    panel: () => <div>Videos panel</div>
  },
  {
    label: 'Music',
    icon: <MusicIcon />,
    panel: () => <div>Music panel</div>
  }
];

const PANEL_TEXTS = ['Photos panel', 'Videos panel', 'Music panel'];

// The tabs stretch to the width of their container, so they are rendered
// inside a fixed-width wrapper which is the screenshot target
const renderComponent = async (
  props: Omit<MaterialTabsProps, 'tabs' | 'ariaLabel'>,
  getTabsFixture: () => MaterialTabsProps['tabs'] = getTabs
) => {
  const renderedAt = performance.now();

  const { baseElement } = render(
    () => (
      <main style={{ padding: '1rem', width: '600px' }}>
        <MaterialTabs {...props} tabs={getTabsFixture()} ariaLabel="Tabs" />
      </main>
    ),
    { wrapper: MaterialTheme }
  );
  await document.fonts.ready;
  // Move the pointer to the middle of the page so that hover state from a
  // previous test or the browser's initial pointer position does not leak
  // into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 400, y: 300 } });
  const screen = page.elementLocator(baseElement);

  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(renderedAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );

  return screen;
};

// Asserts that the tabs and the active panel are visible before the
// screenshot. md-tabs sets its tablist role via element internals, so
// getByRole('tablist') cannot resolve it and the tabs element is used instead
const expectTabsScreenshot = async (screen: ReturnType<typeof page.elementLocator>, activePanelText: string) => {
  const tabs = screen.getByElement('md-tabs');
  await expect.element(tabs).toBeVisible();

  // Given the active panel is visible
  const panel = screen.getByRole('tabpanel');
  await expect.element(panel).toBeVisible();
  await expect.element(screen.getByText(activePanelText)).toBeVisible();

  await expect.element(screen.getByElement('main')).toMatchScreenshot();
};

describe('MaterialTabs', () => {
  describe('Visual', () => {
    it('renders primary tabs with icons above labels', async () => {
      const screen = await renderComponent({ variant: 'primary', inlineIcons: false });

      await expectTabsScreenshot(screen, PANEL_TEXTS[0]!);
    });

    it('renders primary tabs with inline icons', async () => {
      const screen = await renderComponent({ variant: 'primary', inlineIcons: true });

      await expectTabsScreenshot(screen, PANEL_TEXTS[0]!);
    });

    it('renders secondary tabs with the second tab active', async () => {
      const screen = await renderComponent({ variant: 'secondary', activeTabIndex: 1 });

      await expectTabsScreenshot(screen, PANEL_TEXTS[1]!);
    });

    it.each([0, 1, 2])('renders primary tabs with activeTabIndex $0', async activeTabIndex => {
      const screen = await renderComponent({ variant: 'primary', activeTabIndex });

      await expectTabsScreenshot(screen, PANEL_TEXTS[activeTabIndex]!);
    });

    it('renders primary tabs aligned to the start', async () => {
      const screen = await renderComponent({ variant: 'primary', alignment: 'start' });

      await expectTabsScreenshot(screen, PANEL_TEXTS[0]!);
    });

    it('renders icon-only primary tabs', async () => {
      const getIconOnlyTabs = (): MaterialTabsProps['tabs'] => [
        {
          icon: <PhotoIcon />,
          ariaLabel: 'Photos',
          panel: () => <div>Photos panel</div>
        },
        {
          icon: <VideocamIcon />,
          ariaLabel: 'Videos',
          panel: () => <div>Videos panel</div>
        },
        {
          icon: <MusicIcon />,
          ariaLabel: 'Music',
          panel: () => <div>Music panel</div>
        }
      ];
      const screen = await renderComponent({ variant: 'primary' }, getIconOnlyTabs);

      await expectTabsScreenshot(screen, PANEL_TEXTS[0]!);
    });
  });
});
