import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';

import type { MaterialProgressProps, MaterialProgressSize } from './MaterialProgress';

import { MaterialProgress } from './MaterialProgress';

import PlayArrowIcon from '@solidmaterial/icons/400/outlined/play_arrow.svg';

// Written by GLM 5.3 Flash

// Only determinate states are captured: the indeterminate (and four color)
// animations are timing dependent, so their screenshots would not be stable

const renderComponent = async (props: MaterialProgressProps) => {
  const { baseElement } = render(() => <MaterialProgress {...props} />, { wrapper: MaterialTheme });
  await document.fonts.ready;
  // Move the pointer to the middle of the page so that hover state from a
  // previous test or the browser's initial pointer position does not leak
  // into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 400, y: 300 } });
  return page.elementLocator(baseElement);
};

// The circular progress wraps the icon button as a centered overlay
const CircularButton: VoidComponent = () => (
  <main style={{ padding: '2rem', width: 'fit-content' }}>
    <MaterialProgress variant="circular" value={0.75}>
      <MaterialIconButton variant="text" ariaLabel="Play" icon={<PlayArrowIcon />} />
    </MaterialProgress>
  </main>
);

const SIZES: MaterialProgressSize[] = ['small', 'medium', 'large', 'extra-large'];

describe('MaterialProgress', () => {
  describe('Visual', () => {
    describe('Linear', () => {
      it('renders a linear progress with a value', async () => {
        const screen = await renderComponent({ variant: 'linear', value: 0.5, maximum: 1 });

        const progress = screen.getByElement('md-linear-progress');
        await expect.element(progress).toBeVisible();

        await expect.element(progress).toMatchScreenshot();
      });

      it('renders a linear progress with a buffer', async () => {
        const screen = await renderComponent({ variant: 'linear', value: 0.6, buffer: 0.8, maximum: 1 });

        const progress = screen.getByElement('md-linear-progress');
        await expect.element(progress).toBeVisible();

        await expect.element(progress).toMatchScreenshot();
      });

      it.each(SIZES)('renders a linear progress with size $0', async size => {
        const screen = await renderComponent({ variant: 'linear', size, value: 0.5 });

        const progress = screen.getByElement('md-linear-progress');
        await expect.element(progress).toBeVisible();

        await expect.element(progress).toMatchScreenshot();
      });
    });

    describe('Circular', () => {
      it('renders a circular progress with a value', async () => {
        const screen = await renderComponent({ variant: 'circular', value: 0.5, maximum: 1 });

        const progress = screen.getByElement('md-circular-progress');
        await expect.element(progress).toBeVisible();

        await expect.element(progress).toMatchScreenshot();
      });

      it.each(SIZES)('renders a circular progress with size $0', async size => {
        const screen = await renderComponent({ variant: 'circular', size, value: 0.5 });

        const progress = screen.getByElement('md-circular-progress');
        await expect.element(progress).toBeVisible();

        await expect.element(progress).toMatchScreenshot();
      });
    });

    it('renders a circular progress with an icon button', async () => {
      const { baseElement } = render(() => <CircularButton />, { wrapper: MaterialTheme });
      await document.fonts.ready;
      // Move the pointer to the middle of the page so that hover state from a
      // previous test or the browser's initial pointer position does not leak
      // into this test's screenshots
      await userEvent.hover(document.body, { position: { x: 400, y: 300 } });
      const screen = page.elementLocator(baseElement);

      // Given the progress is visible
      const progress = screen.getByElement('md-circular-progress');
      await expect.element(progress).toBeVisible();

      // and the icon button is visible inside it
      const button = screen.getByRole('button', { name: 'Play' });
      await expect.element(button).toBeVisible();

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });
  });
});
