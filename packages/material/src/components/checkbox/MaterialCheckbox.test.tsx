import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

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
});
