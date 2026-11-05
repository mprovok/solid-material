import { render } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialMenuItemProps } from './MaterialMenuItem';

import { MaterialMenuItem } from './MaterialMenuItem';

// Written by GLM 5.3 Flash

describe('MaterialMenuItem', () => {
  describe('Interaction', () => {
    it('fires onClick on pointer click', async () => {
      const onClick = vi.fn();
      const { baseElement } = render(() => <MaterialMenuItem onClick={onClick}>Item</MaterialMenuItem>, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);

      // Given the menu item is visible and its click handler has not fired yet
      const item = screen.getByElement('md-menu-item');
      await expect.element(item).toBeVisible();
      expect(onClick).not.toHaveBeenCalled();

      // When the menu item is clicked
      await userEvent.click(item);

      // Then onClick is called once
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('fires onClick on Enter and Space keys', async () => {
      const onClick = vi.fn();
      const { baseElement } = render(() => <MaterialMenuItem onClick={onClick}>Item</MaterialMenuItem>, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);

      // Given the menu item is focused
      const item = screen.getByElement('md-menu-item');
      await expect.element(item).toBeVisible();
      item.element().focus();
      expect(document.activeElement).toBe(item.element());

      // When pressing Enter
      await userEvent.keyboard('{Enter}');

      // Then onClick is called once with the keyboard event
      expect(onClick).toHaveBeenCalledOnce();
      expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(KeyboardEvent);

      // When pressing Space
      await userEvent.keyboard(' ');

      // Then onClick is called a second time
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('ignores non-activation keys', async () => {
      const onClick = vi.fn();
      const { baseElement } = render(() => <MaterialMenuItem onClick={onClick}>Item</MaterialMenuItem>, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);

      // Given the menu item is focused
      const item = screen.getByElement('md-menu-item');
      await expect.element(item).toBeVisible();
      item.element().focus();
      expect(document.activeElement).toBe(item.element());

      // When pressing the arrow down and tab keys
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Tab}');

      // Then onClick is not called
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Props', () => {
    it('renders with all props set and without them', async () => {
      const [getProps, setProps] = createSignal<MaterialMenuItemProps>({
        selected: true,
        keepOpen: true,
        disabled: true,
        href: '/item',
        target: '_blank',
        ariaLabel: 'Item'
      });

      const { baseElement } = render(() => <MaterialMenuItem {...getProps()}>Item</MaterialMenuItem>, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);

      // Given the menu item is visible
      const item = screen.getByElement('md-menu-item');
      await expect.element(item).toBeVisible();

      // Then all props are bound to host attributes
      await expect.element(item).toHaveAttribute('selected');
      await expect.element(item).toHaveAttribute('keep-open');
      await expect.element(item).toHaveAttribute('disabled');
      await expect.element(item).toHaveAttribute('href', '/item');
      await expect.element(item).toHaveAttribute('target', '_blank');
      // md-menu-item shifts the aria-label attribute to data-aria-label and
      // exposes it through getAttribute only, so read it via getAttribute
      await expect.poll(() => item.element().getAttribute('aria-label')).toBe('Item');

      // When all props are removed
      setProps({});

      // Then the host attributes are gone
      await expect.element(item).not.toHaveAttribute('selected');
      await expect.element(item).not.toHaveAttribute('keep-open');
      await expect.element(item).not.toHaveAttribute('disabled');
      await expect.element(item).not.toHaveAttribute('href');
      await expect.element(item).not.toHaveAttribute('target');
      await expect.poll(() => item.element().getAttribute('aria-label')).toBeNull();
    });
  });
});
