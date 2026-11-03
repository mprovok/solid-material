import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialFocusRingProps } from './MaterialFocusRing';

import { MaterialFocusRing } from './MaterialFocusRing';

import styles from './MaterialFocusRing.stories.module.css';

// Written by GLM 5.3 Flash

// How long to wait after rendering or focusing until the focus ring fade-in
// transition has settled
const SETTLE_TRANSITIONS_MS = 800;

// Mirrors the fixture from MaterialFocusRing.stories.tsx, wrapped in a padded
// element so that the outward focus ring is not clipped in screenshots
const FocusRingStory: VoidComponent<Omit<MaterialFocusRingProps, 'attachTo'>> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDivElement;

  return (
    <main style={{ padding: '2rem' }}>
      <div class={styles['container']}>
        {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div ref={ref} class={styles['element']} tabindex={0}>
          <MaterialFocusRing attachTo={ref} visible={props.visible} inward={props.inward} />
        </div>
      </div>
    </main>
  );
};

// Prepares a freshly rendered focus ring for its screenshot: waits for the
// fonts and the fade-in transition to settle and parks the pointer so hover
// state from a previous test cannot leak into the screenshot
const settleRender = async (baseElement: HTMLElement, renderedAt: number) => {
  await document.fonts.ready;

  const screen = page.elementLocator(baseElement);

  // Move the pointer to the top-left corner so that hover state from a
  // previous test does not leak into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 0, y: 0 } });

  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(renderedAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );

  return screen;
};

const renderComponent = async (props: Omit<MaterialFocusRingProps, 'attachTo'>) => {
  const renderedAt = performance.now();

  const { baseElement } = render(() => <FocusRingStory {...props} />, { wrapper: MaterialTheme });

  return settleRender(baseElement, renderedAt);
};

describe('MaterialFocusRing', () => {
  describe('Visual', () => {
    // Outward ring
    it('renders a visible outward ring', async () => {
      const screen = await renderComponent({ visible: true });

      // Given the element with the attached focus ring is visible
      const element = screen.getByElement('[tabindex="0"]');
      await expect.element(element).toBeVisible();

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    // Inward ring
    it('renders a visible inward ring', async () => {
      const screen = await renderComponent({ visible: true, inward: true });

      // Given the element with the attached focus ring is visible
      const element = screen.getByElement('[tabindex="0"]');
      await expect.element(element).toBeVisible();

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    // Keyboard focus — the ring is shown when the element receives keyboard focus
    it('renders a ring when the element is keyboard-focused', async () => {
      const screen = await renderComponent({});

      // Given the element with the attached focus ring is visible
      const element = screen.getByElement('[tabindex="0"]');
      await expect.element(element).toBeVisible();

      // When the element receives keyboard focus
      const focusedAt = performance.now();
      await userEvent.tab();

      // Then the element has focus and the focus ring is shown
      await expect.element(element).toHaveFocus();

      await vi.waitFor(
        () => {
          expect(performance.now()).toBeGreaterThanOrEqual(focusedAt + SETTLE_TRANSITIONS_MS);
        },
        { timeout: 2000 }
      );

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });
  });
});
