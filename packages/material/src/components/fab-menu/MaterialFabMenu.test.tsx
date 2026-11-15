import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import { MaterialFabMenu } from './MaterialFabMenu';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

const getTwoItems = () => {
  return [
    {
      label: 'First',
      onClick: vi.fn()
    },
    {
      label: 'Second',
      onClick: vi.fn()
    }
  ];
};

describe('MaterialFabMenu', () => {
  describe('Interaction', () => {
    it('shows a tooltip when hovering over the FAB', async () => {
      const { baseElement } = render(() => <MaterialFabMenu title="Tooltip" icon={<EditIcon />} items={[]} />, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('button');
      const tooltip = screen.getByRole('tooltip', { name: 'Tooltip' });

      // Given the FAB is visible
      await expect.element(button).toBeVisible();

      // When hovering over the FAB
      await userEvent.hover(button);

      // Then the tooltip appears
      await expect.element(tooltip).toBeVisible();
    });

    it('toggles a menu when clicking on the FAB', async () => {
      const { baseElement } = render(
        () => (
          <MaterialFabMenu title="Tooltip" closeButtonAriaLabel="Close" icon={<EditIcon />} items={getTwoItems()} />
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('button').first();
      const menu = screen.getByRole('menu');

      // Given the FAB is visible
      await expect.element(button).toBeVisible();
      await expect.element(button).toHaveAccessibleName('Tooltip');

      // and the menu is hidden
      await expect.element(menu).not.toBeInTheDocument();

      // When clicking on the FAB
      await userEvent.click(button);

      // Then the menu is visible
      await expect.element(menu).toBeVisible();

      // and the FAB changes to a close button
      await expect.element(button).toHaveAccessibleName('Close');

      // When clicking on the close button
      await userEvent.click(button);

      // Then the menu is hidden
      await expect.element(menu).not.toBeInTheDocument();

      // and the close button changes to a FAB
      await expect.element(button).toHaveAccessibleName('Tooltip');
    });

    it('closes the menu when clicking on a menu item', async () => {
      const onClickMenuItem = vi.fn();
      const { baseElement } = render(
        () => (
          <MaterialFabMenu
            title="Tooltip"
            closeButtonAriaLabel="Close"
            icon={<EditIcon />}
            items={[
              {
                label: 'First',
                onClick: onClickMenuItem
              }
            ]}
          />
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('button').first();
      const menu = screen.getByRole('menu');
      const menuItems = screen.getByRole('menuitem');

      // Given the FAB is visible and is clicked
      await expect.element(button).toBeVisible();
      await userEvent.click(button);

      // and the menu is visible
      await expect.element(menu).toBeVisible();

      // and the FAB changes to a close button
      await expect.element(button).toHaveAccessibleName('Close');

      expect(onClickMenuItem).not.toHaveBeenCalled();

      // When clicking on the first menu item
      await userEvent.click(menuItems.first());

      expect(onClickMenuItem).toHaveBeenCalledOnce();

      // Then the menu is hidden
      await expect.element(menu).not.toBeInTheDocument();

      // and the close button changes to a FAB
      await expect.element(button).toHaveAccessibleName('Tooltip');
    });

    it.skipIf(Boolean(import.meta.env['CI']))('pressing Tab when menu is open cycles through items', async () => {
      const { baseElement } = render(
        () => (
          <MaterialFabMenu title="Tooltip" closeButtonAriaLabel="Close" icon={<EditIcon />} items={getTwoItems()} />
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('button').first();
      const menu = screen.getByRole('menu');
      const menuItems = screen.getByRole('menuitem');

      // Given the FAB is visible and is clicked
      await expect.element(button).toBeVisible();
      await userEvent.click(button);

      // and the menu is visible
      await expect.element(menu).toBeVisible();

      await expect.element(button).toHaveFocus();

      // When pressing the Tab key
      await userEvent.tab();

      // Then the focus is moved to the first menu item
      await expect.element(menuItems.nth(0).getByRole('button')).toHaveFocus();

      // When pressing the Tab key again
      await userEvent.tab();

      // Then the focus is moved to the second menu item
      await expect.element(menuItems.nth(1).getByRole('button')).toHaveFocus();

      // When pressing Shift + Tab same number of times
      await userEvent.tab({ shift: true });
      await userEvent.tab({ shift: true });

      // Then focus is moved back to the close button
      await expect.element(button).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations when the menu is closed', async () => {
      const { baseElement, container } = render(
        () => (
          <MaterialFabMenu
            ariaLabel="Open menu"
            closeButtonAriaLabel="Close menu"
            icon={<EditIcon />}
            items={getTwoItems()}
          />
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      // Given the FAB is visible and named for opening
      const fab = screen.getByRole('button', { name: 'Open menu' });
      await expect.element(fab).toBeVisible();

      // and the menu is hidden
      await expect.element(screen.getByRole('menu')).not.toBeInTheDocument();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('exposes a labelled menu with menuitem buttons and switches the FAB aria state when open', async () => {
      const { baseElement, container } = render(
        () => (
          <MaterialFabMenu
            ariaLabel="Open menu"
            closeButtonAriaLabel="Close menu"
            icon={<EditIcon />}
            items={[
              {
                label: 'First',
                onClick: vi.fn()
              },
              {
                label: 'Second',
                ariaLabel: 'Second item',
                onClick: vi.fn()
              }
            ]}
          />
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      // Given the FAB is visible, named for opening, and not expanded
      const fab = screen.getByRole('button', { name: 'Open menu' });
      await expect.element(fab).toBeVisible();
      await expect.element(fab).toHaveAttribute('aria-expanded', 'false');

      // When clicking on the FAB
      await userEvent.click(fab);

      // Then the menu is visible
      const menu = screen.getByRole('menu');
      await expect.element(menu).toBeVisible();

      // and the FAB is named for closing and marked expanded
      await expect.element(screen.getByRole('button', { name: 'Close menu' })).toBeVisible();
      await expect.element(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');

      // and each item is wired as a menuitem with a named button
      const menuItems = screen.getByRole('menuitem');
      expect(menuItems.elements()).toHaveLength(2);
      await expect.element(menuItems.nth(0).getByRole('button', { name: 'First' })).toBeVisible();
      await expect.element(menuItems.nth(1).getByRole('button', { name: 'Second item' })).toBeVisible();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
