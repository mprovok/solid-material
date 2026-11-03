import type { VoidComponent } from 'solid-js';
import type { Locator } from 'vitest/browser';

import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialRippleProps } from './MaterialRipple';

import { MaterialRipple } from './MaterialRipple';

import styles from './MaterialRipple.stories.module.css';

// Written by GLM 5.3 Flash

// How long the pointer stays pressed down when the element is pressed
const HOLD_POINTER_DOWN_MS = 4000;

// How long to wait after the pointer was pressed down (or after hovering)
// until the ripple fade-in transition has settled
const SETTLE_TRANSITIONS_MS = 800;

// Mirrors the fixture from MaterialRipple.stories.tsx; the container colors
// the ripple primary so that the hover and pressed states are visible
const RippleStory: VoidComponent<Omit<MaterialRippleProps, 'attachTo'>> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDivElement;

  return (
    <main style={{ padding: '2rem' }}>
      <div class={styles['container']}>
        <div ref={ref} class={styles['element']}>
          <MaterialRipple attachTo={ref} disabled={props.disabled} />
        </div>
      </div>
    </main>
  );
};

// Prepares a freshly rendered ripple for its screenshot: waits for the fonts
// and parks the pointer so hover state from a previous test cannot leak into
// the screenshot
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

const renderComponent = async (props: Omit<MaterialRippleProps, 'attachTo'> = {}) => {
  const renderedAt = performance.now();

  const { baseElement } = render(() => <RippleStory {...props} />, { wrapper: MaterialTheme });

  return settleRender(baseElement, renderedAt);
};

// The ripple overlays the element it is attached to, which is the ripple's
// parent element in the fixture
const getElement = (screen: Locator) => page.elementLocator(screen.getByElement('md-ripple').element().parentElement!);

// Presses the pointer down on the given locator and keeps it pressed down
// while screenshots are taken. `releasePointer` must be awaited to release the
// pointer again.
const pressAndHold = async (locator: Locator) => {
  const element = locator.element();

  // Record the times the real pointerdown and pointerup events are received
  let pointerDownAt = 0;
  let pointerUpAt = Number.POSITIVE_INFINITY;
  element.addEventListener(
    'pointerdown',
    () => {
      pointerDownAt = performance.now();
    },
    { once: true }
  );
  element.addEventListener(
    'pointerup',
    () => {
      pointerUpAt = performance.now();
    },
    { once: true }
  );

  // The pointer stays pressed down while the click waits for its delay to
  // pass. Vitest only starts the command once its promise is used, so the
  // click is raced against waiting for the real pointerdown event instead of
  // being awaited directly.
  const releasePointer = userEvent.click(locator, { delay: HOLD_POINTER_DOWN_MS });
  await Promise.race([
    releasePointer,
    vi.waitFor(
      () => {
        expect(pointerDownAt).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    )
  ]);

  // Wait for the ripple fade-in transition to settle
  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(pointerDownAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );

  return {
    // Fails when the pointer was released before the screenshot was taken
    expectPointerStillPressed() {
      expect(performance.now()).toBeLessThan(pointerUpAt);
    },
    releasePointer
  };
};

describe('MaterialRipple', () => {
  describe('Visual', () => {
    // Idle element
    it('renders an idle element with an attached ripple', async () => {
      const screen = await renderComponent();

      // Given the element with the attached ripple is visible
      const element = getElement(screen);
      await expect.element(element).toBeVisible();

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    // Hover — the hover state layer fades in
    it('renders an element with a hovered ripple', async () => {
      const screen = await renderComponent();

      // Given the element with the attached ripple is visible
      const element = getElement(screen);
      await expect.element(element).toBeVisible();

      // When the pointer hovers over the element
      const hoveredAt = performance.now();
      await userEvent.hover(element);

      await vi.waitFor(
        () => {
          expect(performance.now()).toBeGreaterThanOrEqual(hoveredAt + SETTLE_TRANSITIONS_MS);
        },
        { timeout: 2000 }
      );

      // Then the hover state layer is visible
      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    // Pressed — the pointer is pressed and held down, not clicked and released
    it('renders an element with a pressed ripple', async () => {
      const screen = await renderComponent();

      // Given the element with the attached ripple is visible
      const element = getElement(screen);
      await expect.element(element).toBeVisible();

      // When the pointer is pressed and held down on the element
      const pressed = await pressAndHold(element);

      // Then the pressed ripple is visible while the pointer is held down
      await expect.element(screen.getByElement('main')).toMatchScreenshot();

      // and the pointer was still held down when the screenshot was taken
      pressed.expectPointerStillPressed();
      await pressed.releasePointer;
    });

    // Disabled — no ripple appears even when the element is pressed
    it('renders a disabled element without a ripple when pressed', async () => {
      const screen = await renderComponent({ disabled: true });

      // Given the element with the disabled ripple attached is visible
      const element = getElement(screen);
      await expect.element(element).toBeVisible();
      await expect.element(screen.getByElement('md-ripple')).toHaveAttribute('disabled');

      // When the pointer is pressed and held down on the element
      const pressed = await pressAndHold(element);

      // Then no ripple appears
      await expect.element(screen.getByElement('main')).toMatchScreenshot();

      // and the pointer was still held down when the screenshot was taken
      pressed.expectPointerStillPressed();
      await pressed.releasePointer;
    });
  });
});
