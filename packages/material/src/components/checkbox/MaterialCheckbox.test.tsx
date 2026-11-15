import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { axe } from '../../../vitest.axe';

import { MaterialCheckbox } from './MaterialCheckbox';

describe('MaterialCheckbox', () => {
  describe('Interaction', () => {
    it('can be clicked', async () => {
      const onChange = vi.fn();
      const { baseElement } = render(() => (
        <MaterialCheckbox checked={false} ariaLabel="Label" name="name" onChange={onChange} />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the checkbox is visible
      const checkbox = screen.getByRole('checkbox', { name: 'Label' });
      await expect.element(checkbox).toBeVisible();

      // and unchecked
      await expect.element(checkbox).not.toBeChecked();

      // When the checkbox is clicked
      await userEvent.click(checkbox);

      // Then the checkbox is checked and onChange is called once
      await expect.element(checkbox).toBeChecked();
      expect(onChange).toHaveBeenCalledExactlyOnceWith(true, 'name');

      // When the checkbox is clicked again
      await userEvent.click(checkbox);

      // Then the checkbox is unchecked and onChange is called once
      await expect.element(checkbox).not.toBeChecked();
      expect(onChange).toHaveBeenCalledWith(false, 'name');
    });
  });

  describe('Accessibility', () => {
    it.each([false, true])('has no axe violations when checked = $0', async checked => {
      const { baseElement, container } = render(() => (
        <MaterialCheckbox checked={checked} ariaLabel="Label" name="name" />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the checkbox is visible
      const checkbox = screen.getByRole('checkbox', { name: 'Label' });
      await expect.element(checkbox).toBeVisible();

      // and reflects its checked state
      await (checked ? expect.element(checkbox).toBeChecked() : expect.element(checkbox).not.toBeChecked());

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations when indeterminate (checked omitted)', async () => {
      const { baseElement, container } = render(() => <MaterialCheckbox ariaLabel="Label" name="name" />);
      const screen = page.elementLocator(baseElement);

      // Given omitting `checked` renders an indeterminate checkbox
      const checkbox = screen.getByRole('checkbox', { name: 'Label' });
      await expect.element(checkbox).toBeVisible();

      // and neither checked nor unchecked
      await expect.element(checkbox).toBePartiallyChecked();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { baseElement, container } = render(() => (
        <MaterialCheckbox checked={false} disabled={true} ariaLabel="Label" name="name" />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the disabled checkbox is visible
      const checkbox = screen.getByRole('checkbox', { name: 'Label' });
      await expect.element(checkbox).toBeVisible();

      // and inert and unchecked
      await expect.element(checkbox).toBeDisabled();
      await expect.element(checkbox).not.toBeChecked();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations in the ariaLabel-named render', async () => {
      const { baseElement, container } = render(() => (
        <MaterialCheckbox checked={false} ariaLabel="Custom Label" name="name" />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the checkbox's accessible name comes from ariaLabel
      const checkbox = screen.getByRole('checkbox', { name: 'Custom Label' });
      await expect.element(checkbox).toBeVisible();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
