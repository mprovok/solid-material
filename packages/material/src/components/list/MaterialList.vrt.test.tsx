import type { JSX, VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';
import { MaterialIcon } from '../icon/MaterialIcon';

import type { MaterialListSelectable } from './MaterialList';
import type { MaterialListItemAlignment } from './MaterialListItem';

import { MaterialList } from './MaterialList';
import { MaterialListItem } from './MaterialListItem';

import FavoriteIcon from '@solidmaterial/icons/400/outlined/favorite.svg';
import OpenInNewIcon from '@solidmaterial/icons/400/outlined/open_in_new.svg';
import StarIcon from '@solidmaterial/icons/400/outlined/star.svg';

// Written by GLM 5.3 Flash

// Mirrors the items from the Example story in MaterialList.stories.tsx
const ExampleList: VoidComponent<{ segmented?: boolean }> = props => (
  <MaterialList segmented={props.segmented}>
    <MaterialListItem
      trailingText="Trailing text"
      start={
        <MaterialIcon>
          <FavoriteIcon />
        </MaterialIcon>
      }
      end={<MaterialIconButton variant="text" icon={<StarIcon />} ariaLabel="Favorite" />}
    >
      Label
    </MaterialListItem>
    <MaterialListItem onClick={vi.fn()} overlineText="Interactive item with overline text">
      Label
    </MaterialListItem>
    <MaterialListItem
      overlineText="Link"
      href={globalThis.location.origin}
      target="_blank"
      end={
        <MaterialIcon>
          <OpenInNewIcon />
        </MaterialIcon>
      }
    >
      Label
    </MaterialListItem>
    <MaterialListItem disabled supportingText="Supporting text">
      Label
    </MaterialListItem>
  </MaterialList>
);

const renderComponent = async (component: () => JSX.Element) => {
  const { baseElement } = render(component, { wrapper: MaterialTheme });
  await document.fonts.ready;

  // Move the pointer to the top-left corner so that hover state from a
  // previous test does not leak into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 0, y: 0 } });

  return page.elementLocator(baseElement);
};

describe('MaterialList', () => {
  describe('Visual', () => {
    // Example story items — segmented and unsegmented
    describe.each([false, true])('segmented = $0', segmented => {
      it('renders a list with the example items', async () => {
        const screen = await renderComponent(() => <ExampleList segmented={segmented} />);

        // Given the list is visible
        const list = screen.getByRole('list');
        await expect.element(list).toBeVisible();

        // and it contains list items
        await expect.element(screen.getByRole('listitem').first()).toBeVisible();

        await expect.element(list).toMatchScreenshot();
      });
    });

    // Selectable — single and multi
    it.each(['single', 'multi'] satisfies MaterialListSelectable[])(
      'renders a list which is selectable = $0',
      async selectable => {
        const screen = await renderComponent(() => (
          <MaterialList selectable={selectable} ariaLabel="Selectable list">
            <MaterialListItem>First item</MaterialListItem>
            <MaterialListItem selected>Selected item</MaterialListItem>
            <MaterialListItem>Last item</MaterialListItem>
          </MaterialList>
        ));

        // Given the listbox is visible
        const listbox = screen.getByRole('listbox', { name: 'Selectable list' });
        await expect.element(listbox).toBeVisible();

        // and the middle item is selected while the others are not
        await expect
          .element(screen.getByRole('option', { name: 'Selected item' }))
          .toHaveAttribute('aria-selected', 'true');
        await expect.element(screen.getByRole('option', { name: 'First item' })).not.toHaveAttribute('aria-selected');

        // and multi-select lists allow multiple selections
        if (selectable === 'multi') {
          await expect.element(listbox).toHaveAttribute('aria-multiselectable', 'true');
        }

        await expect.element(listbox).toMatchScreenshot();
      }
    );

    // Item text variants — overline, supporting and trailing text
    it('renders an item with overline, supporting and trailing text', async () => {
      const screen = await renderComponent(() => (
        <MaterialList ariaLabel="List">
          <MaterialListItem overlineText="Overline text" supportingText="Supporting text" trailingText="Trailing text">
            Label
          </MaterialListItem>
        </MaterialList>
      ));

      // Given the list and its item are visible
      const list = screen.getByRole('list', { name: 'List' });
      await expect.element(list).toBeVisible();

      const item = screen.getByRole('listitem', { name: 'Label' });
      await expect.element(item).toBeVisible();

      await expect.element(list).toMatchScreenshot();
    });

    // Item alignment — top and center with two-line items
    it.each(['top', 'center'] satisfies MaterialListItemAlignment[])(
      'renders two-line items aligned $0',
      async align => {
        const screen = await renderComponent(() => (
          <MaterialList ariaLabel="List">
            <MaterialListItem align={align} supportingText="Supporting text">
              First item
            </MaterialListItem>
            <MaterialListItem align={align} supportingText="Another supporting text">
              Second item
            </MaterialListItem>
          </MaterialList>
        ));

        // Given the list and its items are visible
        const list = screen.getByRole('list', { name: 'List' });
        await expect.element(list).toBeVisible();

        await expect.element(screen.getByRole('listitem', { name: 'First item' })).toBeVisible();

        await expect.element(list).toMatchScreenshot();
      }
    );

    // Item types — button, link and text items
    it('renders button, link and text items', async () => {
      const screen = await renderComponent(() => (
        <MaterialList ariaLabel="List">
          <MaterialListItem onClick={vi.fn()}>Button item</MaterialListItem>
          <MaterialListItem href={globalThis.location.origin} target="_blank">
            Link item
          </MaterialListItem>
          <MaterialListItem>Text item</MaterialListItem>
        </MaterialList>
      ));

      // Given the list is visible
      const list = screen.getByRole('list', { name: 'List' });
      await expect.element(list).toBeVisible();

      // and the button and link items are interactive
      await expect.element(screen.getByRole('button', { name: 'Button item' })).toBeVisible();
      await expect.element(screen.getByRole('link', { name: 'Link item' })).toBeVisible();

      // and the text item is non-interactive: it renders no ripple and is not focusable
      const textItem = screen.getByRole('listitem', { name: 'Text item' });
      await expect.element(textItem).toBeVisible();
      expect(textItem.element().querySelectorAll('md-ripple')).toHaveLength(0);
      expect(textItem.element().querySelector('[tabindex="0"]')).toBeNull();

      await expect.element(list).toMatchScreenshot();
    });
  });
});
