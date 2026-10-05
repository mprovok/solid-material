import type { FlowComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type {
  MaterialButtonProps,
  MaterialButtonShape,
  MaterialButtonSize,
  MaterialButtonVariant
} from './MaterialButton';

import { MaterialButton } from './MaterialButton';

import PlayArrowIcon from '@solidmaterial/icons/400/outlined/play_arrow.svg';

const Wrapper: FlowComponent = props => (
  <MaterialTheme theme="tonal-spot">
    <div style={{ 'background-color': 'white' }}>{props.children}</div>
  </MaterialTheme>
);

const renderComponent = async (props: MaterialButtonProps) => {
  const { baseElement } = render(() => <MaterialButton {...props}>Label</MaterialButton>, { wrapper: Wrapper });
  await document.fonts.ready;
  return page.elementLocator(baseElement);
};

describe('MaterialButton', () => {
  describe('Visual', () => {
    it.each([false, true])('functions as a switch when toggle = $0', async toggled => {
      const screen = await renderComponent({ toggle: toggled, variant: 'filled' });

      const button = screen.getByRole('switch');
      await expect.element(button).toBeVisible();

      await expect.element(button).toMatchScreenshot();
    });

    it('functions as a link when href is defined', async () => {
      const screen = await renderComponent({ href: '/', variant: 'filled' });

      // Given when rendered as a visible link
      const button = screen.getByRole('link');
      await expect.element(button).toBeVisible();

      // Then href is equal to the given URL
      await expect.element(button).toHaveAttribute('href', '/');

      await expect.element(button).toMatchScreenshot();
    });

    it.each([false, undefined])('renders a button which is enabled when disabled = $0', async disabled => {
      const screen = await renderComponent({ disabled, variant: 'filled' });

      // Given the button is visible
      const button = screen.getByRole('button');
      await expect.element(button).toBeVisible();

      // Then the button is enabled
      await expect.element(button).toBeEnabled();

      await expect.element(button).toMatchScreenshot();
    });

    it('renders a disabled button', async () => {
      const screen = await renderComponent({ disabled: true, variant: 'filled' });

      // Given the button is visible
      const button = screen.getByRole('button');
      await expect.element(button).toBeVisible();

      // Then the button is disabled
      await expect.element(button).toBeDisabled();

      await expect.element(button).toMatchScreenshot();
    });

    // Variants
    it.each(['elevated', 'filled', 'tonal', 'outlined', 'text'] satisfies MaterialButtonVariant[])(
      'renders a button with variant $0',
      async variant => {
        const screen = await renderComponent({ variant, size: 'medium', icon: <PlayArrowIcon /> });

        const button = screen.getByRole('button');
        await expect.element(button).toBeVisible();

        await expect.element(button).toMatchScreenshot();
      }
    );

    // Sizes
    it.each(['extra-small', 'small', 'medium', 'large', 'extra-large'] satisfies MaterialButtonSize[])(
      'renders a button with size $0',
      async size => {
        const screen = await renderComponent({ variant: 'tonal', size, icon: <PlayArrowIcon /> });

        const button = screen.getByRole('button');
        await expect.element(button).toBeVisible();

        await expect.element(button).toMatchScreenshot();
      }
    );

    // Shapes
    it.each(['round', 'square'] satisfies MaterialButtonShape[])('renders a button with shape $0', async shape => {
      const screen = await renderComponent({ variant: 'tonal', shape });

      const button = screen.getByRole('button');
      await expect.element(button).toBeVisible();

      await expect.element(button).toMatchScreenshot();
    });

    // Unselected and selected toggle buttons
    describe.each([false, true])('toggle = $0', toggle => {
      // Variants
      it.each(['elevated', 'filled', 'tonal', 'outlined'] satisfies MaterialButtonVariant[])(
        `renders a toggle button with variant $0 and toggle = ${toggle}`,
        async variant => {
          const screen = await renderComponent({ variant, toggle });

          const button = screen.getByRole('switch');
          await expect.element(button).toBeVisible();

          await expect.element(button).toMatchScreenshot();
        }
      );

      // Shapes
      it.each(['round', 'square'] satisfies MaterialButtonShape[])(
        `renders a toggle button with shape $0 and toggle = ${toggle}`,
        async shape => {
          const screen = await renderComponent({ variant: 'tonal', toggle, shape });

          const button = screen.getByRole('switch');
          await expect.element(button).toBeVisible();

          await expect.element(button).toMatchScreenshot();
        }
      );
    });

    // Disabled button variants
    it.each(['elevated', 'filled', 'tonal', 'outlined', 'text'] satisfies MaterialButtonVariant[])(
      `renders a disabled button with variant $0`,
      async variant => {
        const screen = await renderComponent({ variant, disabled: true });

        // Given the button is visible
        const button = screen.getByRole('button');
        await expect.element(button).toBeVisible();

        // Then the button is disabled
        await expect.element(button).toBeDisabled();

        await expect.element(button).toMatchScreenshot();
      }
    );
  });
});
