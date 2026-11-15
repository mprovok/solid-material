import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { axe } from '../../../vitest.axe';

import { MaterialSplitButton } from './MaterialSplitButton';
import { MaterialSplitButtonMenu } from './MaterialSplitButtonMenu';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

describe('MaterialSplitButtonMenu', () => {
  describe('Visual', () => {
    it('renders the split button', async () => {
      const { baseElement } = render(() => (
        <MaterialSplitButton
          open={false}
          variant="filled"
          size="medium"
          icon={<EditIcon />}
          menuButtonAriaLabel="items"
          onClick={vi.fn()}
          onToggle={vi.fn()}
        >
          Label
        </MaterialSplitButton>
      ));
      const screen = page.elementLocator(baseElement);

      const labelButton = screen.getByRole('button', { name: 'Label' });
      const iconButton = screen.getByRole('switch', { name: 'items' });

      await expect.element(labelButton).toBeVisible();
      await expect.element(iconButton).toBeVisible();

      const icon = labelButton.getByElement('md-icon');
      await expect.element(icon).toBeVisible();
    });
  });

  describe('Accessibility', () => {
    it('is expanded when open', async () => {
      const { baseElement } = render(() => (
        <MaterialSplitButton open={true} variant="filled" size="medium" onClick={vi.fn()} onToggle={vi.fn()}>
          Label
        </MaterialSplitButton>
      ));
      const screen = page.elementLocator(baseElement);

      const iconButton = screen.getByRole('switch');
      await expect.element(iconButton).toHaveAttribute('aria-expanded');
    });

    it.each([false, true])('exposes the menu open state on the arrow switch when open = $0', async open => {
      const { baseElement, container } = render(() => (
        <MaterialSplitButton
          open={open}
          variant="filled"
          size="medium"
          menuButtonAriaLabel="items"
          onClick={vi.fn()}
          onToggle={vi.fn()}
        >
          Label
        </MaterialSplitButton>
      ));
      const screen = page.elementLocator(baseElement);

      // Given the arrow button is wired as a switch with its expanded state exposed
      const switchButton = screen.getByRole('switch', { name: 'items' });
      await expect.element(switchButton).toBeVisible();
      await expect.element(switchButton).toHaveAttribute('aria-checked', String(open));
      await expect.element(switchButton).toHaveAttribute('aria-expanded', String(open));

      // and the label button is a plain button
      const labelButton = screen.getByRole('button', { name: 'Label' });
      await expect.element(labelButton).toBeVisible();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations when the menu is open', async () => {
      const onMenuItemClick = vi.fn();
      const { baseElement, container } = render(() => (
        <MaterialSplitButtonMenu
          variant="filled"
          size="medium"
          icon={<EditIcon />}
          menuButtonAriaLabel="items"
          menuAriaLabel="Item actions"
          onClick={vi.fn()}
          menuItems={[
            { label: 'Cut', onClick: onMenuItemClick },
            { label: 'Copy', onClick: onMenuItemClick }
          ]}
        >
          Label
        </MaterialSplitButtonMenu>
      ));
      const screen = page.elementLocator(baseElement);

      // Given the arrow switch is visible
      const switchButton = screen.getByRole('switch', { name: 'items' });
      await expect.element(switchButton).toBeVisible();

      // When the menu is opened via the arrow switch
      await userEvent.click(switchButton);

      // Then the menu is visible with named items
      // md-menu / md-menu-item expose their roles via element internals, so
      // role queries cannot resolve them and the host elements and their
      // texts are asserted instead (see MaterialMenu.test.tsx)
      const menu = screen.getByElement('md-menu[aria-label]');
      await expect.element(menu).toBeVisible();
      await expect.element(menu).toHaveAttribute('aria-label', 'Item actions');
      await expect.element(screen.getByText('Cut')).toBeVisible();
      await expect.element(screen.getByText('Copy')).toBeVisible();

      // and the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('Interaction', () => {
    it('can be clicked', async () => {
      const onClick = vi.fn();
      const onToggle = vi.fn();

      const { baseElement } = render(() => (
        <MaterialSplitButton open={false} variant="filled" size="medium" onClick={onClick} onToggle={onToggle}>
          Label
        </MaterialSplitButton>
      ));
      const screen = page.elementLocator(baseElement);

      const labelButton = screen.getByRole('button');
      const iconButton = screen.getByRole('switch');

      await expect.element(labelButton).toBeVisible();
      await expect.element(iconButton).toBeVisible();

      await userEvent.click(labelButton);

      expect(onClick).toHaveBeenCalledOnce();

      await userEvent.click(iconButton);

      expect(onToggle).toHaveBeenCalledExactlyOnceWith(true);
    });

    it('activates the first menu item with Enter when the menu opens', async () => {
      const onFirstItemClick = vi.fn();

      const { baseElement } = render(() => (
        <MaterialSplitButtonMenu
          variant="filled"
          size="medium"
          icon={<EditIcon />}
          menuButtonAriaLabel="items"
          menuAriaLabel="Split button menu"
          onClick={vi.fn()}
          menuItems={[
            { label: 'First', onClick: onFirstItemClick },
            { label: 'Second', onClick: vi.fn() },
            { label: 'Third', onClick: vi.fn() }
          ]}
        >
          Label
        </MaterialSplitButtonMenu>
      ));
      const screen = page.elementLocator(baseElement);

      // Given the closed menu is hidden
      // md-menu / md-menu-item expose their roles via element internals, so
      // role queries cannot resolve them and the host elements and their
      // texts are asserted instead (see MaterialMenu.test.tsx)
      const menu = screen.getByElement('md-menu[aria-label]');
      await expect.element(menu).toHaveAttribute('aria-hidden', 'true');

      const switchButton = screen.getByRole('switch', { name: 'items' });
      await expect.element(switchButton).toBeVisible();

      // When the menu is opened via the arrow switch
      await userEvent.click(switchButton);

      // Then the menu is no longer hidden
      await vi.waitFor(async () => {
        await expect.element(menu).not.toHaveAttribute('aria-hidden', 'true');
      });
      await expect.element(menu).toBeVisible();

      // and the first menu item receives focus
      const firstItem = screen.getByText('First');
      await expect.element(firstItem).toBeVisible();
      await vi.waitFor(async () => {
        await expect.element(firstItem).toHaveFocus();
      });

      // When Enter is pressed
      expect(onFirstItemClick).not.toHaveBeenCalled();
      await userEvent.keyboard('{Enter}');

      // Then the first menu item's onClick is called
      await vi.waitFor(() => expect(onFirstItemClick).toHaveBeenCalledOnce());
    });
  });
});
