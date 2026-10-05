import type { FlowComponent } from 'solid-js';

import { Route } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialNavigationBarProps } from './MaterialNavigationBar';

import { MaterialNavigationBar } from './MaterialNavigationBar';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

const Wrapper: FlowComponent = props => {
  return (
    <MaterialTheme>
      <Route path="/" component={() => props.children} />
    </MaterialTheme>
  );
};

const renderComponent = async (props: Omit<MaterialNavigationBarProps, 'items'>) => {
  const { baseElement } = render(
    () => (
      <MaterialNavigationBar
        {...props}
        items={[
          {
            label: 'First',
            href: '/',
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
    { wrapper: Wrapper, location: '/' }
  );
  await document.fonts.ready;
  return page.elementLocator(baseElement);
};

describe('MaterialNavigationBar', () => {
  describe('Visual', () => {
    it('renders horizontal items', async () => {
      const screen = await renderComponent({ show: true, expanded: true, ariaLabel: 'Navigation bar' });

      // Given the navigation bar is visible
      const bar = screen.getByRole('menubar', { name: 'Navigation bar' });
      await expect.element(bar).toBeVisible();

      // and the pointer is hovering over the second item
      const item = screen.getByRole('menuitem', { name: 'Second' });
      await userEvent.hover(item);

      await expect.element(bar).toMatchScreenshot();
    });

    it('render vertical items', async () => {
      const screen = await renderComponent({ show: true, expanded: false, ariaLabel: 'Navigation bar' });

      // Given the navigation bar is visible
      const bar = screen.getByRole('menubar', { name: 'Navigation bar' });
      await expect.element(bar).toBeVisible();

      // and the pointer is hovering over the second item
      const item = screen.getByRole('menuitem', { name: 'Second' });
      await userEvent.hover(item);

      await expect.element(bar).toMatchScreenshot();
    });
  });
});
