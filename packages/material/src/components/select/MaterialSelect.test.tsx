import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { axe } from '../../../vitest.axe';

import type { MaterialSelectProps } from './MaterialSelect';

import { MaterialSelect } from './MaterialSelect';

const OPTIONS: MaterialSelectProps['options'] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Kiwi', value: 'kiwi' }
];

describe('MaterialSelect', () => {
  describe('Accessibility', () => {
    it('exposes the label as the accessible name of the closed combobox and has no axe violations', async () => {
      const { baseElement, container } = render(() => (
        <MaterialSelect variant="filled" label="Fruit" options={OPTIONS} />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the closed select is visible with its label attribute
      const select = screen.getByElement('md-filled-select');
      await expect.element(select).toBeVisible();
      await expect.element(select).toHaveAttribute('label', 'Fruit');

      // and the combobox inside md-select's shadow root is closed and named by the label
      const combobox = screen.getByRole('combobox', { name: 'Fruit' });
      await expect.element(combobox).toBeVisible();
      await expect.element(combobox).toHaveAttribute('aria-expanded', 'false');

      // and the options are rendered inside the select while it is closed
      expect(screen.getByElement('md-select-option').elements()).toHaveLength(OPTIONS.length);

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('exposes the error state and has no axe violations when showError and errorText are set', async () => {
      const { baseElement, container } = render(() => (
        <MaterialSelect variant="outlined" label="Fruit" showError={true} errorText="Pick a fruit" options={OPTIONS} />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the select is visible and in the error state
      const select = screen.getByElement('md-outlined-select');
      await expect.element(select).toBeVisible();
      await expect.element(select).toHaveAttribute('error');
      await expect.element(select).toHaveAttribute('error-text', 'Pick a fruit');

      // and the combobox is still named by the label
      await expect.element(screen.getByRole('combobox', { name: 'Fruit' })).toBeVisible();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('names the combobox from ariaLabel instead of the label and has no axe violations', async () => {
      const { baseElement, container } = render(() => (
        <MaterialSelect variant="filled" label="Fruit" ariaLabel="Fruit picker" options={OPTIONS} />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the select is visible (the aria-label is delegated onto the
      // internal combobox by @material/web's mixinDelegatesAria, so it is not
      // present on the host element)
      const select = screen.getByElement('md-filled-select');
      await expect.element(select).toBeVisible();

      // Then the combobox's accessible name comes from the aria-label, not the visible label
      await expect.element(screen.getByRole('combobox', { name: 'Fruit picker' })).toBeVisible();

      // and the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
