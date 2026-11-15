import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialTabsProps } from './MaterialTabs';

import { MaterialTabs } from './MaterialTabs';

import MusicIcon from '@solidmaterial/icons/400/rounded/music_note.svg';
import PhotoIcon from '@solidmaterial/icons/400/rounded/photo.svg';
import VideocamIcon from '@solidmaterial/icons/400/rounded/videocam.svg';

const TAB_NAMES = ['Photos', 'Videos', 'Music'];
const PANEL_TEXTS = ['Photos panel', 'Videos panel', 'Music panel'];

// Mirrors the Photos/Videos/Music fixture from the VRT file. The fixture is
// created inside the render accessor: instantiating the icons' JSX outside of
// `render()` makes Solid's dev-mode `spread` create render effects with no
// owner, which are never disposed (see the VRT file for details).
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

const renderTabs = (activeTabIndex: number) => {
  const { baseElement, container } = render(
    () => <MaterialTabs variant="primary" tabs={getTabs()} activeTabIndex={activeTabIndex} ariaLabel="Media" />,
    { wrapper: MaterialTheme }
  );
  return { screen: page.elementLocator(baseElement), container };
};

describe('MaterialTabs', () => {
  describe('Accessibility', () => {
    it.each([0, 1, 2])(
      'wires each tab to its panel and hides the others while tab $0 is active',
      async activeTabIndex => {
        const { screen, container } = renderTabs(activeTabIndex);

        // Given the tablist and its three named tabs are visible
        // (md-tabs and md-primary-tab expose their roles via element
        // internals, so getByRole('tablist')/getByRole('tab') cannot resolve
        // them and the elements are queried instead; the tabs' accessible
        // names stay covered by the tabpanel aria-labelledby wiring and the
        // axe scan below)
        const tablist = screen.getByElement('md-tabs');
        await expect.element(tablist).toBeVisible();
        const tabs = screen.getByElement('md-primary-tab');
        expect(tabs.elements()).toHaveLength(TAB_NAMES.length);
        await Promise.all(
          TAB_NAMES.map(async (name, index) => {
            const tab = tabs.nth(index);
            await expect.element(tab).toBeVisible();
            await expect.element(tab).toHaveTextContent(name);
          })
        );

        // Then each tab's aria-controls points at its panel's id and each panel
        // is labelled by its tab's id (the hosts of the shadow role="tab"
        // elements carry the wiring attributes)
        const tabHosts = screen.getByElement('md-primary-tab').elements();
        const panels = screen.getByElement('[role="tabpanel"]').elements();
        expect(tabHosts).toHaveLength(TAB_NAMES.length);
        expect(panels).toHaveLength(TAB_NAMES.length);
        for (const [index, tabHost] of tabHosts.entries()) {
          expect(tabHost.getAttribute('aria-controls')).toBe(panels[index]!.id);
          expect(panels[index]!.getAttribute('aria-labelledby')).toBe(tabHost.id);
        }

        // and only the active panel is exposed while the inactive ones are hidden
        for (const [index, panel] of panels.entries()) {
          expect(panel.hasAttribute('hidden')).toBe(index !== activeTabIndex);
        }
        const activePanel = screen.getByRole('tabpanel');
        await expect.element(activePanel).toBeVisible();
        await expect.element(activePanel).toHaveTextContent(PANEL_TEXTS[activeTabIndex]!);

        // Then the assembled tablist with all tabs and panels has no axe violations
        await expect(await axe(container)).toHaveNoViolations();
      }
    );
  });
});
