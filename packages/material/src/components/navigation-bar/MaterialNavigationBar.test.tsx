import type { FlowComponent } from 'solid-js';

import { MemoryRouter, Route } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import { MaterialNavigationBar } from './MaterialNavigationBar';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

const Wrapper: FlowComponent = props => {
  return (
    <MaterialTheme>
      <MemoryRouter>
        <Route path="/" component={() => props.children} />
      </MemoryRouter>
    </MaterialTheme>
  );
};

describe('MaterialNavigationBar', () => {
  describe('Interaction', () => {
    it('can move focus to its items using keyboard', async () => {
      const { baseElement } = render(
        () => (
          <MaterialNavigationBar
            show={true}
            ariaLabel="Navigation bar"
            items={[
              {
                label: 'First',
                href: '/first',
                icon: EditIcon,
                activeIcon: EditIcon
              },
              {
                label: 'Second',
                href: '/second',
                icon: EditIcon,
                activeIcon: EditIcon
              },
              {
                label: 'Third',
                href: '/third',
                icon: EditIcon,
                activeIcon: EditIcon
              }
            ]}
          />
        ),
        { wrapper: Wrapper }
      );

      const screen = page.elementLocator(baseElement);

      // Given the navigation bar is visible
      const bar = screen.getByRole('menubar', { name: 'Navigation bar' });
      await expect.element(bar).toBeVisible();

      const items = screen.getByRole('menuitem');

      // and the first item has focus
      items.nth(0).element().focus();
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing arrow down, then move focus to item below it
      await userEvent.keyboard('{ArrowRight}');
      await expect.element(items.nth(1)).toHaveFocus();

      // When pressing arrow up, then move focus to item above it
      await userEvent.keyboard('{ArrowLeft}');
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing arrow up when first item has focus
      await userEvent.keyboard('{ArrowLeft}');
      // Then move focus to last item
      await expect.element(items.nth(2)).toHaveFocus();

      // When pressing arrow down when last item has focus
      await userEvent.keyboard('{ArrowRight}');
      // Then move focus to first item
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing End, then move focus to last item
      await userEvent.keyboard('{End}');
      await expect.element(items.nth(2)).toHaveFocus();

      // When pressing Home, then move focus to first item
      await userEvent.keyboard('{Home}');
      await expect.element(items.nth(0)).toHaveFocus();
    });
  });
});
