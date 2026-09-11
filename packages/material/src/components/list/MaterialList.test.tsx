import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import { MaterialList } from './MaterialList';
import { MaterialListItem } from './MaterialListItem';

describe('MaterialList', () => {
  describe('Visual', () => {
    it('shows a list with list items when not selectable', async () => {
      const { baseElement } = render(
        () => (
          <MaterialList segmented={true} ariaLabel="Unselectable list">
            <MaterialListItem>First</MaterialListItem>
            <MaterialListItem>Second</MaterialListItem>
            <MaterialListItem>Third</MaterialListItem>
          </MaterialList>
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      // Given the listbox is visible
      const list = screen.getByRole('list', { name: 'Unselectable list' });
      await expect.element(list).toBeVisible();

      // Then the list contains a list item
      await expect.element(screen.getByRole('listitem').first()).toBeInTheDocument();
    });

    it('shows a listbox with options when selectable', async () => {
      const { baseElement } = render(
        () => (
          <MaterialList segmented={true} selectable="single" ariaLabel="Selectable list">
            <MaterialListItem>First</MaterialListItem>
            <MaterialListItem>Second</MaterialListItem>
            <MaterialListItem selected={true}>Third</MaterialListItem>
          </MaterialList>
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      // Given the listbox is visible
      const list = screen.getByRole('listbox', { name: 'Selectable list' });
      await expect.element(list).toBeVisible();

      // Then the selected item is selected
      await expect.element(screen.getByRole('option').last()).toHaveAttribute('aria-selected');
    });
  });

  describe('Interaction', () => {
    it('can move focus to its items using keyboard', async () => {
      const onClick = vi.fn();

      const { baseElement } = render(
        () => (
          <MaterialList segmented={true}>
            <MaterialListItem onClick={onClick}>First</MaterialListItem>
            <MaterialListItem onClick={onClick}>Second</MaterialListItem>
            <MaterialListItem onClick={onClick}>Third</MaterialListItem>
          </MaterialList>
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      const items = screen.getByRole('button');

      // Given the list is visible
      const list = screen.getByRole('list');
      await expect.element(list).toBeVisible();

      // and the first item has focus
      items.nth(0).element().focus();
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing arrow down, then move focus to item below it
      await userEvent.keyboard('{ArrowDown}');
      await expect.element(items.nth(1)).toHaveFocus();

      // When pressing arrow up, then move focus to item above it
      await userEvent.keyboard('{ArrowUp}');
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing arrow up when first item has focus
      await userEvent.keyboard('{ArrowUp}');
      // Then move focus to last item
      await expect.element(items.nth(2)).toHaveFocus();

      // When pressing arrow down when last item has focus
      await userEvent.keyboard('{ArrowDown}');
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
