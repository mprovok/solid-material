import type { FlowComponent } from 'solid-js';

import { Route } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialNavigationItemProps } from './MaterialNavigationItem';

import { MaterialNavigationItem } from './MaterialNavigationItem';

import EditFillIcon from '@solidmaterial/icons/400/outlined/edit-fill.svg';
import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

const Wrapper: FlowComponent = props => {
  return (
    <MaterialTheme>
      <Route path="/active" component={() => props.children} />
    </MaterialTheme>
  );
};

const renderComponent = async (props: Omit<MaterialNavigationItemProps, 'icon' | 'activeIcon'>) => {
  const { baseElement } = render(
    () => <MaterialNavigationItem {...props} icon={EditIcon} activeIcon={EditFillIcon} />,
    {
      wrapper: Wrapper,
      location: '/active'
    }
  );
  await document.fonts.ready;
  return page.elementLocator(baseElement);
};

describe('MaterialNavigationItem', () => {
  describe('Visual', () => {
    describe.each([false, true])('expanded = $0', expanded => {
      describe.each([true, false])('active = $0', active => {
        const description = `renders an ${active ? 'active' : 'inactive'} item`;

        const label = active ? 'Active' : 'Inactive';
        const href = active ? '/' : '/inactive';

        // Basic configuration of item
        it(description, async () => {
          const screen = await renderComponent({
            expanded,
            href,
            label
          });

          // Given the navigation item is visible
          const item = screen.getByRole('menuitem', { name: label });
          await expect.element(item).toBeVisible();

          await expect.element(item).toMatchScreenshot();
        });

        // Hovering
        it(`${description} and hovering`, async () => {
          const screen = await renderComponent({
            expanded,
            href,
            label
          });

          // Given the navigation item is visible
          const item = screen.getByRole('menuitem', { name: label });
          await expect.element(item).toBeVisible();

          // and the pointer is hovering over the item
          await userEvent.hover(item);

          await expect.element(item).toMatchScreenshot();
        });

        // Badge
        it(`${description} with badge`, async () => {
          const screen = await renderComponent({
            expanded,
            href,
            label: 'Badge',
            badge: {
              value: 1
            }
          });

          // Given the navigation item is visible
          const item = screen.getByRole('menuitem', { name: 'Badge' });
          await expect.element(item).toBeVisible();

          await expect.element(item).toMatchScreenshot();
        });

        // Disabled
        it(`${description} which is disabled`, async () => {
          const screen = await renderComponent({
            expanded,
            href,
            label: 'Disabled',
            disabled: true
          });

          // Given the navigation item is visible
          const item = screen.getByRole('menuitem', { name: 'Disabled' });
          await expect.element(item).toBeVisible();

          await expect.element(item).toMatchScreenshot();
        });
      });

      // Expected path is /active and actual path is /active (thus active)
      it('renders an active item when path must be exact', async () => {
        const screen = await renderComponent({
          expanded,
          label: 'Active',
          href: '/active',
          end: true
        });

        // Given the navigation item is visible
        const item = screen.getByRole('menuitem', { name: 'Active' });
        await expect.element(item).toBeVisible();

        await expect.element(item).toMatchScreenshot();
      });

      // Expected path is /, but actual path is /active (thus inactive)
      it('renders an inactive item when path is not exact match', async () => {
        const screen = await renderComponent({
          expanded,
          label: 'Inactive',
          href: '/',
          end: true
        });

        // Given the navigation item is visible
        const item = screen.getByRole('menuitem', { name: 'Inactive' });
        await expect.element(item).toBeVisible();

        // oxlint-disable-next-line no-warning-comments
        // TODO Screenshot shows pointer is hovering over item for expanded = false
        await expect.element(item).toMatchScreenshot();
      });
    });
  });
});
