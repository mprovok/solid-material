import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import type { AxeOverrides } from '../../../vitest.axe';

import { axe } from '../../../vitest.axe';
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

  describe('Accessibility', () => {
    it('has no axe violations in the labelled single-thumb render', async () => {
      const { baseElement, container } = render(
        () => <MaterialSlider value={50} ariaLabel="Volume" ariaValueText="Fifty" />,
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given the labelled slider is visible
      const slider = screen.getByRole('slider', { name: 'Volume' });
      await expect.element(slider).toBeVisible();

      // with the configured value and value text
      await expect.element(slider).toHaveValue('50');
      await expect.element(slider).toHaveAttribute('aria-valuetext', 'Fifty');

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    // md-slider's range mode gives the start handle tabindex="1" internally
    // (slider/internal/slider.js: `.tabIndex=${start ? 1 : 0}`) so it can be
    // reached with a single Tab press before the end handle; the sequential
    // order is intentional, so axe's tabindex rule is disabled for these scans.
    // Its range-mode aria-label-start/-end and aria-valuetext-start/-end
    // attributes are official upstream @material/web API
    // (declared in slider/internal/slider.js) that axe-core does not know,
    // so axe's aria-valid-attr rule is disabled for these scans too
    const rangeAxeOptions: AxeOverrides = {
      rules: { tabindex: { enabled: false }, 'aria-valid-attr': { enabled: false } }
    };

    it('has no axe violations in the labelled range render', async () => {
      const { baseElement, container } = render(
        () => (
          <MaterialSlider
            value={[20, 80]}
            ariaLabel={['Minimum temperature', 'Maximum temperature']}
            ariaValueText={['Twenty degrees', 'Eighty degrees']}
          />
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given both handles are visible with their own labels
      const start = screen.getByRole('slider', { name: 'Minimum temperature' });
      await expect.element(start).toBeVisible();
      const end = screen.getByRole('slider', { name: 'Maximum temperature' });
      await expect.element(end).toBeVisible();

      // with the configured values and value texts
      await expect.element(start).toHaveValue('20');
      await expect.element(start).toHaveAttribute('aria-valuetext', 'Twenty degrees');
      await expect.element(end).toHaveValue('80');
      await expect.element(end).toHaveAttribute('aria-valuetext', 'Eighty degrees');

      // Then the rendered tree has no axe violations
      await expect(await axe(container, rangeAxeOptions)).toHaveNoViolations();
    });

    it('has no axe violations in the disabled range render', async () => {
      const { baseElement, container } = render(
        () => (
          <MaterialSlider
            value={[20, 80]}
            disabled={true}
            ariaLabel={['Minimum temperature', 'Maximum temperature']}
            ariaValueText={['Twenty degrees', 'Eighty degrees']}
          />
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given both handles are visible
      const start = screen.getByRole('slider', { name: 'Minimum temperature' });
      await expect.element(start).toBeVisible();
      const end = screen.getByRole('slider', { name: 'Maximum temperature' });
      await expect.element(end).toBeVisible();

      // and inert
      await expect.element(start).toBeDisabled();
      await expect.element(end).toBeDisabled();

      // Then the rendered tree has no axe violations
      await expect(await axe(container, rangeAxeOptions)).toHaveNoViolations();
    });
  });
});
