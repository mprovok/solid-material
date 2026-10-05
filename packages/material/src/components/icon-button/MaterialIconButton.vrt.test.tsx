import type { FlowComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import type { MaterialButtonShape, MaterialButtonSize, MaterialButtonVariant } from '../button/MaterialButton';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialIconButtonProps, MaterialIconButtonWidth } from './MaterialIconButton';

import { MaterialIconButton } from './MaterialIconButton';

import VideocamIcon from '@solidmaterial/icons/400/outlined/videocam.svg';

// Written by Gemma 4 26B A4B, modified to fix lint warnings

const Wrapper: FlowComponent = props => (
  <MaterialTheme>
    <div style={{ 'background-color': 'white' }}>{props.children}</div>
  </MaterialTheme>
);

const renderComponent = async (props: Omit<MaterialIconButtonProps, 'icon'>) => {
  const { baseElement } = render(() => <MaterialIconButton {...props} icon={<VideocamIcon />} />, { wrapper: Wrapper });
  await document.fonts.ready;
  return page.elementLocator(baseElement);
};

describe('MaterialIconButton', () => {
  describe('Visual', () => {
    // Variants
    it.each(['filled', 'tonal', 'outlined', 'text'] satisfies MaterialButtonVariant[])(
      'renders with variant $0',
      async variant => {
        const screen = await renderComponent({ variant });

        const button = screen.getByRole('button');
        await expect.element(button).toBeVisible();

        await expect.element(button).toMatchScreenshot();
      }
    );

    // Sizes
    it.each(['extra-small', 'small', 'medium', 'large', 'extra-large'] satisfies MaterialButtonSize[])(
      'renders with size $0',
      async size => {
        const screen = await renderComponent({ variant: 'tonal', size });

        const button = screen.getByRole('button');
        await expect.element(button).toBeVisible();

        await expect.element(button).toMatchScreenshot();
      }
    );

    // Shapes
    it.each(['round', 'square'] satisfies MaterialButtonShape[])('renders with shape $0', async shape => {
      const screen = await renderComponent({ variant: 'tonal', shape });

      const button = screen.getByRole('button');
      await expect.element(button).toBeVisible();

      await expect.element(button).toMatchScreenshot();
    });

    // Widths
    it.each(['narrow', 'default', 'wide'] satisfies MaterialIconButtonWidth[])('renders with width $0', async width => {
      const screen = await renderComponent({ variant: 'tonal', width });

      const button = screen.getByRole('button');
      await expect.element(button).toBeVisible();

      await expect.element(button).toMatchScreenshot();
    });

    // Unselected and selected toggle buttons
    describe.each([false, true])('toggle = $0', toggle => {
      // Variants
      it.each(['filled', 'tonal', 'outlined', 'text'] satisfies MaterialButtonVariant[])(
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
    it.each(['filled', 'tonal', 'outlined', 'text'] satisfies MaterialButtonVariant[])(
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
