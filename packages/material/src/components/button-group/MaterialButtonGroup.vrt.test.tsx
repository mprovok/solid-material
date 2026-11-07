import type { FlowComponent } from 'solid-js';
import type { Locator } from 'vitest/browser';

import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import type { MaterialButtonSize } from '../button/MaterialButton';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialButton } from '../button/MaterialButton';

import type { MaterialButtonGroupProps, MaterialButtonGroupVariant } from './MaterialButtonGroup';

import { MaterialButtonGroup } from './MaterialButtonGroup';

// Written by GLM 5.3

const BUTTON_POSITIONS = ['first', 'middle', 'last'] as const;

type ButtonPosition = (typeof BUTTON_POSITIONS)[number];

const BUTTON_LABELS: Record<ButtonPosition, string> = {
  first: 'First',
  middle: 'Second',
  last: 'Third'
};

// How long the pointer stays pressed down when a button is pressed
const HOLD_POINTER_DOWN_MS = 4000;

// How long to wait after the pointer was pressed down until the ripple and
// shape morphing transitions have settled
const SETTLE_TRANSITIONS_MS = 800;

const Wrapper: FlowComponent = props => (
  <MaterialTheme theme="tonal-spot">
    <div style={{ 'background-color': 'white' }}>{props.children}</div>
  </MaterialTheme>
);

// Asserts that the toggle button with the given label renders a switch which
// is selected when `selected` is `true` and unselected otherwise
const expectSwitchSelected = async (screen: Locator, label: string, selected: boolean) => {
  const button = screen.getByRole('switch', { name: label });
  await expect.element(button).toBeVisible();
  await expect.element(button).toHaveAttribute('aria-checked', String(selected));
};

const renderComponent = async (
  props: MaterialButtonGroupProps,
  {
    size = 'medium',
    disabled = false,
    toggledButton,
    disabledButton
  }: {
    size?: MaterialButtonSize;
    disabled?: boolean;
    toggledButton?: ButtonPosition;
    disabledButton?: ButtonPosition;
  } = {}
) => {
  const isDisabled = (position: ButtonPosition) => disabled || disabledButton === position;

  const { baseElement } = render(
    () => (
      <MaterialButtonGroup {...props}>
        <MaterialButton
          variant="tonal"
          shape="round"
          size={size}
          disabled={isDisabled('first')}
          toggle={toggledButton === 'first'}
        >
          {BUTTON_LABELS.first}
        </MaterialButton>
        <MaterialButton
          variant="tonal"
          shape="round"
          size={size}
          disabled={isDisabled('middle')}
          toggle={toggledButton === 'middle'}
        >
          {BUTTON_LABELS.middle}
        </MaterialButton>
        <MaterialButton
          variant="tonal"
          shape="round"
          size={size}
          disabled={isDisabled('last')}
          toggle={toggledButton === 'last'}
        >
          {BUTTON_LABELS.last}
        </MaterialButton>
      </MaterialButtonGroup>
    ),
    { wrapper: Wrapper }
  );
  await document.fonts.ready;

  // Move the pointer to the top-left corner so that hover state from a
  // previous test does not leak into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 0, y: 0 } });

  return page.elementLocator(baseElement);
};

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

  // Wait for the ripple and shape morphing transitions to settle
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

describe('MaterialButtonGroup', () => {
  describe('Visual', () => {
    describe.each(['standard', 'connected'] satisfies MaterialButtonGroupVariant[])('variant = $0', variant => {
      // Sizes — the group gap and the connected inner corner shapes scale with the button size
      it.each(['extra-small', 'small', 'medium', 'large', 'extra-large'] satisfies MaterialButtonSize[])(
        'renders a button group with size $0',
        async size => {
          const screen = await renderComponent({ variant }, { size });

          const group = screen.getByElement('sm-button-group');
          await expect.element(group).toBeVisible();

          const button = screen.getByRole('switch', { name: BUTTON_LABELS.first });
          await expect.element(button).toBeVisible();

          await expect.element(group).toMatchScreenshot();
        }
      );

      // Toggled buttons — the first, middle and last button can be toggled
      it.each(BUTTON_POSITIONS)('renders a button group with the $0 button toggled', async position => {
        const screen = await renderComponent({ variant }, { toggledButton: position });

        const group = screen.getByElement('sm-button-group');
        await expect.element(group).toBeVisible();

        // Given the toggled button is selected and the other buttons are not
        await expectSwitchSelected(screen, BUTTON_LABELS.first, position === 'first');
        await expectSwitchSelected(screen, BUTTON_LABELS.middle, position === 'middle');
        await expectSwitchSelected(screen, BUTTON_LABELS.last, position === 'last');

        await expect.element(group).toMatchScreenshot();
      });

      // Pressed buttons — the pointer is pressed and held down, not clicked and released
      it.for(BUTTON_POSITIONS)('renders a button group with the $0 button pressed', async (position, { skip }) => {
        // Screenshot for middle button is generated incorrectly if there
        // is no screenshot yet, so skip it for now
        skip(position === 'middle');

        const screen = await renderComponent({ variant });

        const group = screen.getByElement('sm-button-group');
        await expect.element(group).toBeVisible();

        const button = screen.getByRole('switch', { name: BUTTON_LABELS[position] });
        await expect.element(button).toBeVisible();

        // When the pointer is pressed and held down on the button
        const pressed = await pressAndHold(button);

        // Then the pressed state is visible while the pointer is held down
        await expect.element(group).toMatchScreenshot();

        // and the pointer was still held down when the screenshot was taken
        pressed.expectPointerStillPressed();
        await pressed.releasePointer;
      });

      it('renders a button group with all buttons disabled', async () => {
        const screen = await renderComponent({ variant }, { disabled: true });

        const group = screen.getByElement('sm-button-group');
        await expect.element(group).toBeVisible();

        // Given every button is disabled
        const button = screen.getByRole('switch', { name: BUTTON_LABELS.first });
        await expect.element(button).toBeDisabled();

        await expect.element(group).toMatchScreenshot();
      });

      it('renders a button group with a disabled button', async () => {
        const screen = await renderComponent({ variant }, { disabledButton: 'middle' });

        const group = screen.getByElement('sm-button-group');
        await expect.element(group).toBeVisible();

        // Given the middle button is disabled and the first button is enabled
        const disabledButton = screen.getByRole('switch', { name: BUTTON_LABELS.middle });
        await expect.element(disabledButton).toBeDisabled();

        const enabledButton = screen.getByRole('switch', { name: BUTTON_LABELS.first });
        await expect.element(enabledButton).toBeEnabled();

        await expect.element(group).toMatchScreenshot();
      });
    });
  });
});
