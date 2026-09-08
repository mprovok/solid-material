import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

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
});
