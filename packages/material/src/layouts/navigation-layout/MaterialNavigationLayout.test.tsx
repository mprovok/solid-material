import type { FlowComponent } from 'solid-js';

import { Route } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import type { MaterialNavigationItemType } from '../../components/navigation-item/MaterialNavigationItem';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialPane } from '../pane/MaterialPane';

import { MaterialNavigationLayout } from './MaterialNavigationLayout';

import PhotoFillIcon from '@solidmaterial/icons/400/outlined/photo-fill.svg';
import PhotoIcon from '@solidmaterial/icons/400/outlined/photo.svg';
import SpeakerFillIcon from '@solidmaterial/icons/400/outlined/speaker-fill.svg';
import SpeakerIcon from '@solidmaterial/icons/400/outlined/speaker.svg';
import VideocamFillIcon from '@solidmaterial/icons/400/outlined/videocam-fill.svg';
import VideocamIcon from '@solidmaterial/icons/400/outlined/videocam.svg';

// Written by GLM 5.3 Flash

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

// Renders the stories' fixture. The viewport is set explicitly before
// rendering because it persists across tests within this file: the rail
// layout picks its expanded state on first render
const renderComponent = async ({ location = '/' }: { location?: string } = {}) => {
  await page.viewport(1024, 768);

  const { baseElement } = render(
    () => (
      <MaterialNavigationLayout
        show={true}
        items={getItems()}
        menuButton={{ title: 'Expand', titleSelected: 'Collapse' }}
      >
        <MaterialPane />
      </MaterialNavigationLayout>
    ),
    { wrapper: Wrapper, location }
  );

  await document.fonts.ready;

  const screen = page.elementLocator(baseElement);

  // The location option wraps the fixture in a lazy component: wait until the
  // rail is mounted before the tests query it
  await expect.element(screen.getByElement('sm-navigation-rail')).toBeInTheDocument();

  return screen;
};

describe('MaterialNavigationLayout', () => {
  describe('Interaction', () => {
    it('toggles the rail expanded state through the menu button', async () => {
      const screen = await renderComponent();

      // Given the rail is visible with all items
      const rail = screen.getByElement('sm-navigation-rail');
      await expect.element(rail).toBeVisible();

      const menuButton = rail.getByRole('switch');
      const items = rail.getByRole('menuitem');
      expect(items.elements()).toHaveLength(3);

      // Then the menu button is named Expand and the items are collapsed.
      // The vi.waitFor calls absorb the mount animation, whose attribute
      // updates may lag behind the first render
      await expect.element(menuButton).toHaveAccessibleName('Expand');
      await Promise.all(
        items.elements().map(async item =>
          vi.waitFor(async () => {
            await expect.element(item).not.toHaveAttribute('data-expanded');
          })
        )
      );

      // When the menu button is clicked
      await userEvent.click(menuButton);

      // Then the items are expanded and the menu button is named Collapse
      await Promise.all(
        items.elements().map(async item =>
          vi.waitFor(async () => {
            await expect.element(item).toHaveAttribute('data-expanded');
          })
        )
      );
      await expect.element(menuButton).toHaveAccessibleName('Collapse');

      // When the menu button is clicked again
      await userEvent.click(menuButton);

      // Then the items are collapsed again and the menu button is named Expand
      await Promise.all(
        items.elements().map(async item =>
          vi.waitFor(async () => {
            await expect.element(item).not.toHaveAttribute('data-expanded');
          })
        )
      );
      await expect.element(menuButton).toHaveAccessibleName('Expand');
    });
  });
});
