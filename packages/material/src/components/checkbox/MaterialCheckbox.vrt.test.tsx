import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialCheckboxProps } from './MaterialCheckbox';

import { MaterialCheckbox } from './MaterialCheckbox';

// Written by GLM 5.3 Flash

const renderComponent = async (props: MaterialCheckboxProps) => {
  const { baseElement } = render(() => <MaterialCheckbox {...props} />, { wrapper: MaterialTheme });
  await document.fonts.ready;
  // Move the pointer to the middle of the page so that hover state from a
  // previous test or the browser's initial pointer position does not leak
  // into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 400, y: 300 } });
  return page.elementLocator(baseElement);
};

describe('MaterialCheckbox', () => {
  describe('Visual', () => {
    it('renders an unchecked checkbox', async () => {
      const screen = await renderComponent({ checked: false, ariaLabel: 'Checkbox' });

      // Given the checkbox is visible and unchecked
      const checkbox = screen.getByRole('checkbox', { name: 'Checkbox' });
      await expect.element(checkbox).toBeVisible();
      await expect.element(checkbox).not.toBeChecked();

      await expect.element(screen.getByElement('md-checkbox')).toMatchScreenshot();
    });

    it('renders a checked checkbox', async () => {
      const screen = await renderComponent({ checked: true, ariaLabel: 'Checkbox' });

      // Given the checkbox is visible and checked
      const checkbox = screen.getByRole('checkbox', { name: 'Checkbox' });
      await expect.element(checkbox).toBeVisible();
      await expect.element(checkbox).toBeChecked();

      await expect.element(screen.getByElement('md-checkbox')).toMatchScreenshot();
    });

    it('renders an indeterminate checkbox', async () => {
      // checked = undefined renders the indeterminate state
      const screen = await renderComponent({ ariaLabel: 'Checkbox' });

      // Given the checkbox is visible and indeterminate
      const checkbox = screen.getByRole('checkbox', { name: 'Checkbox' });
      await expect.element(checkbox).toBeVisible();
      await expect.element(checkbox).toBePartiallyChecked();

      await expect.element(screen.getByElement('md-checkbox')).toMatchScreenshot();
    });

    describe.each([
      { state: 'unchecked', checked: false },
      { state: 'checked', checked: true },
      { state: 'indeterminate', checked: undefined }
    ] satisfies { state: string; checked: MaterialCheckboxProps['checked'] }[])('$state', ({ checked }) => {
      it('renders a disabled checkbox', async () => {
        const screen = await renderComponent({ checked, disabled: true, ariaLabel: 'Checkbox' });

        // Given the checkbox is visible and disabled
        const checkbox = screen.getByRole('checkbox', { name: 'Checkbox' });
        await expect.element(checkbox).toBeVisible();
        await expect.element(checkbox).toBeDisabled();

        await expect.element(screen.getByElement('md-checkbox')).toMatchScreenshot();
      });
    });
  });
});
