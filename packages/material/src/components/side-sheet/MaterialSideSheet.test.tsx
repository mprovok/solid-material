import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialSideSheetProps, MaterialSideSheetVariant } from './MaterialSideSheet';

import { MaterialSideSheet } from './MaterialSideSheet';

const renderComponent = (props: Omit<MaterialSideSheetProps, 'open' | 'variant'>, variant: MaterialSideSheetVariant) =>
  render(
    () => (
      <MaterialSideSheet {...props} variant={variant} open={true}>
        <p>Side sheet content</p>
      </MaterialSideSheet>
    ),
    { wrapper: MaterialTheme }
  );

describe('MaterialSideSheet', () => {
  describe('Accessibility', () => {
    it('exposes the open sheet as a complementary landmark with a level 1 title heading', async () => {
      const { baseElement } = renderComponent({ title: 'Filter settings' }, 'standard');
      const screen = page.elementLocator(baseElement);

      // Given the standard sheet is open and visible
      const sheet = screen.getByRole('complementary');
      await expect.element(sheet).toBeVisible();

      // Then the title is rendered as a level 1 heading with the given name
      const heading = screen.getByRole('heading', { level: 1, name: 'Filter settings' });
      await expect.element(heading).toBeVisible();
    });

    it('exposes the back and close header buttons with their accessible names', async () => {
      const onClickBack = vi.fn();
      const onClickClose = vi.fn();

      const { baseElement } = renderComponent(
        {
          title: 'Filter settings',
          backButtonAriaLabel: 'Navigate back',
          closeButtonAriaLabel: 'Close',
          onClickBack,
          onClickClose
        },
        'standard'
      );
      const screen = page.elementLocator(baseElement);

      // Given the standard sheet is open and visible
      const sheet = screen.getByRole('complementary');
      await expect.element(sheet).toBeVisible();

      // and neither header callback has fired yet
      expect(onClickBack).not.toHaveBeenCalled();
      expect(onClickClose).not.toHaveBeenCalled();

      // Then the back and close buttons are visible with their accessible names
      await expect.element(screen.getByRole('button', { name: 'Navigate back' })).toBeVisible();
      await expect.element(screen.getByRole('button', { name: 'Close' })).toBeVisible();
    });

    it.each(['standard', 'modal'] satisfies MaterialSideSheetVariant[])(
      'has no axe violations when open as a $0 sheet',
      async variant => {
        const onClickBack = vi.fn();
        const onClickClose = vi.fn();

        const { baseElement, container } = renderComponent(
          {
            title: 'Filter settings',
            backButtonAriaLabel: 'Navigate back',
            closeButtonAriaLabel: 'Close',
            onClickBack,
            onClickClose
          },
          variant
        );
        const screen = page.elementLocator(baseElement);

        // Given the open sheet is visible
        const sheet = screen.getByRole('complementary');
        await expect.element(sheet).toBeVisible();

        // and its title, named header buttons and content children are visible
        await expect.element(screen.getByRole('heading', { level: 1, name: 'Filter settings' })).toBeVisible();
        await expect.element(screen.getByRole('button', { name: 'Navigate back' })).toBeVisible();
        await expect.element(screen.getByRole('button', { name: 'Close' })).toBeVisible();
        await expect.element(screen.getByText('Side sheet content')).toBeVisible();

        // Then the rendered tree has no axe violations
        await expect(await axe(container)).toHaveNoViolations();
      }
    );
  });
});
