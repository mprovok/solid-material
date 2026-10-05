import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import type { MaterialButtonSize } from '../button/MaterialButton';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialSplitButtonProps, MaterialSplitButtonVariant } from './MaterialSplitButton';

import { MaterialSplitButton } from './MaterialSplitButton';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

const emptyFn = () => {
  // Empty
};

// Written by Gemma 4 26B A4B, modified to fix lint warnings

const renderComponent = async (props: Omit<MaterialSplitButtonProps, 'children' | 'onClick' | 'onToggle'>) => {
  const { baseElement } = render(
    () => (
      <MaterialSplitButton {...props} onClick={emptyFn} onToggle={emptyFn}>
        Label
      </MaterialSplitButton>
    ),
    { wrapper: MaterialTheme }
  );
  await document.fonts.ready;
  return page.elementLocator(baseElement);
};

const renderComponentWithIcon = async (props: Omit<MaterialSplitButtonProps, 'children' | 'onClick' | 'onToggle'>) => {
  const { baseElement } = render(
    () => (
      <MaterialSplitButton {...props} icon={<EditIcon />} onClick={emptyFn} onToggle={emptyFn}>
        Label
      </MaterialSplitButton>
    ),
    { wrapper: MaterialTheme }
  );
  await document.fonts.ready;
  return page.elementLocator(baseElement);
};

describe('MaterialSplitButton', () => {
  describe('Visual', () => {
    // Closed and open states
    describe.each([false, true])('open = $0', open => {
      // Variants
      it.each(['elevated', 'filled', 'tonal', 'outlined'] satisfies MaterialSplitButtonVariant[])(
        'renders a split button with variant $0',
        async variant => {
          const screen = await renderComponentWithIcon({ variant, open, size: 'medium' });

          const splitButton = screen.getByElement('sm-split-button');
          await expect.element(splitButton).toBeVisible();

          await expect.element(splitButton).toMatchScreenshot();
        }
      );

      // Sizes
      it.each(['extra-small', 'small', 'medium', 'large', 'extra-large'] satisfies MaterialButtonSize[])(
        'renders a split button with size $0',
        async size => {
          const screen = await renderComponentWithIcon({ variant: 'filled', open, size });

          const splitButton = screen.getByElement('sm-split-button');
          await expect.element(splitButton).toBeVisible();

          await expect.element(splitButton).toMatchScreenshot();
        }
      );

      // Disabled
      it.each(['elevated', 'filled', 'tonal', 'outlined'] satisfies MaterialSplitButtonVariant[])(
        'renders a disabled split button with variant $0',
        async variant => {
          const screen = await renderComponentWithIcon({ variant, open, size: 'medium', disabled: true });

          const splitButton = screen.getByElement('sm-split-button');
          await expect.element(splitButton).toBeVisible();

          await expect.element(splitButton).toMatchScreenshot();
        }
      );
    });

    // Label only
    it('renders a split button with label only', async () => {
      const screen = await renderComponent({ variant: 'filled', size: 'medium', open: false, icon: undefined });

      const splitButton = screen.getByElement('sm-split-button');
      await expect.element(splitButton).toBeVisible();

      const labelButton = screen.getByRole('button', { name: 'Label' });
      await expect.element(labelButton).toBeVisible();

      // Assert that no icon is present in the (first) button
      const icon = labelButton.getByElement('md-icon');
      await expect.element(icon).not.toBeInTheDocument();

      await expect.element(splitButton).toMatchScreenshot();
    });
  });
});
