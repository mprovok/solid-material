import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { axe } from '../../../vitest.axe';

import { MaterialSwitch } from './MaterialSwitch';

describe('MaterialSwitch', () => {
  describe('Interaction', () => {
    it('can be clicked', async () => {
      const onChange = vi.fn();
      const { baseElement } = render(() => (
        <MaterialSwitch selected={false} ariaLabel="Label" name="name" onChange={onChange} />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the switch is visible
      const switchElement = screen.getByRole('switch', { name: 'Label' });
      await expect.element(switchElement).toBeVisible();

      // and unchecked
      await expect.element(switchElement).not.toBeChecked();

      // When the switch is clicked
      await userEvent.click(switchElement);

      // Then the switch is checked and onChange is called once
      await expect.element(switchElement).toBeChecked();
      expect(onChange).toHaveBeenCalledExactlyOnceWith(true, 'name');

      // When the switch is clicked again
      await userEvent.click(switchElement);

      // Then the switch is unchecked and onChange is called once
      await expect.element(switchElement).not.toBeChecked();
      expect(onChange).toHaveBeenCalledWith(false, 'name');
    });
  });

  describe('Accessibility', () => {
    it.each([false, true])('has no axe violations when selected = $0', async selected => {
      const { baseElement, container } = render(() => (
        <MaterialSwitch selected={selected} ariaLabel="Label" name="name" />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the labelled switch is visible
      const switchElement = screen.getByRole('switch', { name: 'Label' });
      await expect.element(switchElement).toBeVisible();

      // and reflects the selected state
      await (selected ? expect.element(switchElement).toBeChecked() : expect.element(switchElement).not.toBeChecked());

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { baseElement, container } = render(() => (
        <MaterialSwitch selected={false} disabled={true} ariaLabel="Label" name="name" />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the disabled switch is visible
      const switchElement = screen.getByRole('switch', { name: 'Label' });
      await expect.element(switchElement).toBeVisible();

      // and inert
      await expect.element(switchElement).toBeDisabled();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
