import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialSliderProps } from './MaterialSlider';

import { MaterialSlider } from './MaterialSlider';

// Written by GLM 5.3 Flash

// How long to wait after hovering or focusing the slider until the value
// label bubble and handle state transitions have settled
const SETTLE_TRANSITIONS_MS = 800;

// The value label bubble paints above the track, so the slider is rendered
// with a fixed width inside the padded wrapper element which is the screenshot
// target
const renderComponent = async (props: MaterialSliderProps) => {
  const { baseElement } = render(
    () => (
      <main style={{ padding: '2rem' }}>
        <div style={{ width: '400px' }}>
          <MaterialSlider {...props} />
        </div>
      </main>
    ),
    { wrapper: MaterialTheme }
  );
  await document.fonts.ready;

  // Move the pointer to the middle of the page so that hover state from a
  // previous test or the browser's initial pointer position does not leak
  // into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 400, y: 300 } });

  return page.elementLocator(baseElement);
};

const settle = async (stateChangedAt: number) => {
  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(stateChangedAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );
};

describe('MaterialSlider', () => {
  describe('Visual', () => {
    it('renders a slider with a value', async () => {
      const screen = await renderComponent({ value: 40 });

      // Given the slider is visible with its single handle
      const slider = screen.getByElement('md-slider');
      await expect.element(slider).toBeVisible();
      await expect.element(screen.getByRole('slider')).toBeVisible();

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders a labeled slider', async () => {
      const screen = await renderComponent({ value: 50, labeled: true });

      const slider = screen.getByElement('md-slider');
      await expect.element(slider).toBeVisible();
      await expect.element(screen.getByRole('slider')).toBeVisible();

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders a slider with a step', async () => {
      const screen = await renderComponent({ value: 60, step: 10, labeled: true });

      const slider = screen.getByElement('md-slider');
      await expect.element(slider).toBeVisible();
      await expect.element(screen.getByRole('slider')).toBeVisible();

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders a slider with ticks', async () => {
      const screen = await renderComponent({ value: 70, step: 10, labeled: true, ticks: true });

      const slider = screen.getByElement('md-slider');
      await expect.element(slider).toBeVisible();
      await expect.element(screen.getByRole('slider')).toBeVisible();

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders a slider with a scale', async () => {
      const screen = await renderComponent({ value: 60, scale: [40, 60], labeled: true });

      // Given the slider is visible with the scale as its bounds
      const slider = screen.getByElement('md-slider');
      await expect.element(slider).toBeVisible();
      await expect.element(screen.getByRole('slider')).toBeVisible();
      await expect.element(slider).toHaveAttribute('min', '40');
      await expect.element(slider).toHaveAttribute('max', '60');

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders a disabled slider', async () => {
      const screen = await renderComponent({ value: 50, labeled: true, disabled: true });

      // Given the slider is visible and disabled
      const slider = screen.getByElement('md-slider');
      await expect.element(slider).toBeVisible();
      await expect.element(slider).toHaveAttribute('disabled');

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders a range slider', async () => {
      const screen = await renderComponent({ value: [20, 80], step: 10, labeled: true });

      // Given the slider is visible with its two handles
      const slider = screen.getByElement('md-slider');
      await expect.element(slider).toBeVisible();
      await expect.element(slider).toHaveAttribute('range');
      await expect.element(screen.getByRole('slider').first()).toBeVisible();
      await expect.element(screen.getByRole('slider').last()).toBeVisible();

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders a slider with a label and ARIA attributes', async () => {
      const screen = await renderComponent({
        value: 50,
        labeled: true,
        label: 'Value',
        ariaLabel: 'ARIA label for slider',
        ariaValueText: 'ARIA value text'
      });

      // Given the slider input is visible with its ARIA label
      const slider = screen.getByElement('md-slider');
      await expect.element(slider).toBeVisible();
      await expect.element(screen.getByRole('slider', { name: 'ARIA label for slider' })).toBeVisible();

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders a range slider with labels and ARIA attributes', async () => {
      const screen = await renderComponent({
        value: [20, 80],
        step: 10,
        labeled: true,
        label: ['Start', 'End'],
        ariaLabel: ['ARIA label for start of slider', 'ARIA label for end of slider'],
        ariaValueText: ['ARIA value text for start', 'ARIA value text for end']
      });

      // Given both slider inputs are visible with their ARIA labels
      const slider = screen.getByElement('md-slider');
      await expect.element(slider).toBeVisible();
      await expect.element(screen.getByRole('slider', { name: 'ARIA label for start of slider' })).toBeVisible();
      await expect.element(screen.getByRole('slider', { name: 'ARIA label for end of slider' })).toBeVisible();

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders a slider with a hovered handle', async () => {
      const screen = await renderComponent({ value: 50, labeled: true });

      // Given the handle is at the middle of the track
      const slider = screen.getByElement('md-slider');
      await expect.element(slider).toBeVisible();
      await expect.element(screen.getByRole('slider')).toBeVisible();

      // When the handle is hovered
      const hoveredAt = performance.now();
      await userEvent.hover(screen.getByRole('slider'));

      // Then the hover state is visible while the pointer stays parked on the
      // handle so the hover state is deterministic
      await settle(hoveredAt);

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders a slider with a focused handle', async () => {
      const screen = await renderComponent({ value: 50, labeled: true });

      // Given the slider is visible
      const slider = screen.getByElement('md-slider');
      await expect.element(slider).toBeVisible();

      // When the slider receives keyboard focus (the host delegates focus to
      // its handle input, so the host is the focused element)
      const focusedAt = performance.now();
      const sliderElement = slider.element();
      if (sliderElement instanceof HTMLElement) {
        sliderElement.focus();
      }

      // Then the slider has focus and the handle focus ring is shown
      await expect.element(slider).toHaveFocus();

      // Move the pointer to the top-left corner so that hover state from a
      // previous test does not leak into this test's screenshots
      await userEvent.hover(document.body, { position: { x: 0, y: 0 } });

      await settle(focusedAt);

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });
  });
});
