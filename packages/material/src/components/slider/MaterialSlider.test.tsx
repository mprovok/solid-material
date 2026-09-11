import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import { MaterialSlider } from './MaterialSlider';

describe('MaterialSliderBar', () => {
  describe('Interaction', () => {
    it('calls onChange when the slider is modified', async () => {
      const onChange = vi.fn();

      const { baseElement } = render(() => <MaterialSlider value={[20, 80]} step={10} onChange={onChange} />, {
        wrapper: MaterialTheme
      });

      const screen = page.elementLocator(baseElement);

      // Given the slider is visible
      const input = screen.getByRole('slider', { name: '80' });
      await expect.element(input).toBeVisible();

      expect(onChange).not.toHaveBeenCalled();

      // When value 80 is changed to 90
      await userEvent.fill(input, '90');

      // Then the onChange callback is called with the new values
      expect(onChange).toHaveBeenCalledExactlyOnceWith([20, 90]);
    });
  });
});
