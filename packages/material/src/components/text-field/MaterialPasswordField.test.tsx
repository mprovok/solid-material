import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { axe } from '../../../vitest.axe';

import type { MaterialPasswordFieldProps } from './MaterialPasswordField';

import { MaterialPasswordField } from './MaterialPasswordField';

const FIELD_TAGS: Record<MaterialPasswordFieldProps['variant'], string> = {
  filled: 'md-filled-text-field',
  outlined: 'md-outlined-text-field'
};

const renderField = (props: MaterialPasswordFieldProps) => render(() => <MaterialPasswordField {...props} />);

describe('MaterialPasswordField', () => {
  describe('Accessibility', () => {
    describe.each(['filled', 'outlined'] satisfies MaterialPasswordFieldProps['variant'][])('variant = $0', variant => {
      const fieldTag = FIELD_TAGS[variant];

      it('exposes the label as the accessible name of the textbox', async () => {
        const { baseElement, container } = renderField({ variant, label: 'Password' });
        const screen = page.elementLocator(baseElement);

        // Given the labelled password field renders a visible textbox
        const textbox = screen.getByRole('textbox', { name: 'Password' });
        await expect.element(textbox).toBeVisible();

        // Then the rendered tree has no axe violations
        await expect(await axe(container)).toHaveNoViolations();
      });

      it('names the visibility toggle click to show while the password is hidden', async () => {
        const { baseElement, container } = renderField({ variant, label: 'Password' });
        const screen = page.elementLocator(baseElement);

        // Given the password is hidden behind a visible textbox
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toHaveAttribute('type', 'password');
        const textbox = screen.getByRole('textbox', { name: 'Password' });
        await expect.element(textbox).toBeVisible();

        // Then the toggle resolves by its 'Click to show' accessible name
        const toggle = screen.getByRole('switch', { name: 'Click to show' });
        await expect.element(toggle).toBeVisible();

        // and the rendered tree has no axe violations
        await expect(await axe(container)).toHaveNoViolations();
      });

      it('renames the visibility toggle to click to hide and reveals the password when it is clicked', async () => {
        const { baseElement, container } = renderField({ variant, label: 'Password' });
        const screen = page.elementLocator(baseElement);

        // Given the password is hidden
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toHaveAttribute('type', 'password');
        const toggle = screen.getByRole('switch', { name: 'Click to show' });
        await expect.element(toggle).toBeVisible();

        // When the toggle is clicked
        await userEvent.click(toggle);

        // Then the toggle is renamed to 'Click to hide' and the field type flips to text
        await expect.element(screen.getByRole('switch', { name: 'Click to hide' })).toBeVisible();
        await expect.element(field).toHaveAttribute('type', 'text');
        await expect.element(screen.getByRole('textbox', { name: 'Password' })).toBeVisible();

        // and the revealed tree has no axe violations
        await expect(await axe(container)).toHaveNoViolations();
      });
    });
  });
});
