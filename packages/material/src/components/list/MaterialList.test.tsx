import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
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

  describe('Accessibility', () => {
    it('exposes a plain list with listitem roles and has no axe violations', async () => {
      const { baseElement, container } = render(
        () => (
          <MaterialList ariaLabel="Plain list">
            <MaterialListItem>First</MaterialListItem>
            <MaterialListItem>Second</MaterialListItem>
            <MaterialListItem>Third</MaterialListItem>
          </MaterialList>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given the list is visible with its list role
      const list = screen.getByRole('list', { name: 'Plain list' });
      await expect.element(list).toBeVisible();
      await expect.element(list).not.toHaveAttribute('aria-multiselectable');

      // and each item is a named listitem
      await expect.element(screen.getByRole('listitem', { name: 'First' })).toBeInTheDocument();
      await expect.element(screen.getByRole('listitem', { name: 'Second' })).toBeInTheDocument();
      await expect.element(screen.getByRole('listitem', { name: 'Third' })).toBeInTheDocument();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('exposes a single-select listbox with option roles and has no axe violations', async () => {
      const { baseElement, container } = render(
        () => (
          <MaterialList selectable="single" ariaLabel="Single-select list">
            <MaterialListItem>First</MaterialListItem>
            <MaterialListItem selected={true}>Second</MaterialListItem>
          </MaterialList>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given the listbox is visible with its listbox role
      const listbox = screen.getByRole('listbox', { name: 'Single-select list' });
      await expect.element(listbox).toBeVisible();

      // and it is not marked multiselectable
      await expect.element(listbox).not.toHaveAttribute('aria-multiselectable');

      // and each option is a named option, the selected one exposing its state
      await expect.element(screen.getByRole('option', { name: 'First' })).toBeInTheDocument();
      await expect.element(screen.getByRole('option', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('exposes a multi-select listbox with aria-multiselectable and has no axe violations', async () => {
      const { baseElement, container } = render(
        () => (
          <MaterialList selectable="multi" ariaLabel="Multi-select list">
            <MaterialListItem selected={true}>First</MaterialListItem>
            <MaterialListItem selected={true}>Second</MaterialListItem>
          </MaterialList>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given the listbox is visible with its listbox role
      const listbox = screen.getByRole('listbox', { name: 'Multi-select list' });
      await expect.element(listbox).toBeVisible();

      // and marked multiselectable
      await expect.element(listbox).toHaveAttribute('aria-multiselectable', 'true');

      // and each option is a named option exposing its selected state
      await expect.element(screen.getByRole('option', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
      await expect.element(screen.getByRole('option', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
