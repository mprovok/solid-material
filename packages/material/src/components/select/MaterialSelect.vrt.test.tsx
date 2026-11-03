import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialSelectProps, MaterialSelectVariant } from './MaterialSelect';

import { MaterialSelect } from './MaterialSelect';

// Written by GLM 5.3 Flash

// The options from the Example story
const OPTIONS: MaterialSelectProps['options'] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana', disabled: true },
  { label: 'Kiwi', value: 'kiwi' },
  { label: 'Pineapple', value: 'pineapple' }
];

const SELECT_TAGS: Record<MaterialSelectVariant, string> = {
  filled: 'md-filled-select',
  outlined: 'md-outlined-select'
};

// The select stretches to the width of its container, so it is rendered
// inside a fixed-width wrapper which keeps its box deterministic
const renderComponent = async (props: Omit<MaterialSelectProps, 'options' | 'ariaLabel'>) => {
  const { baseElement } = render(
    () => (
      <main style={{ padding: '1rem', width: '320px' }}>
        <MaterialSelect {...props} options={OPTIONS} ariaLabel="Select" />
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

describe('MaterialSelect', () => {
  describe('Visual', () => {
    describe.each(['filled', 'outlined'] satisfies MaterialSelectVariant[])('variant = $0', variant => {
      const selectTag = SELECT_TAGS[variant];

      it('renders a select with a label, value and supporting text', async () => {
        const screen = await renderComponent({
          variant,
          label: 'Fruit',
          value: 'kiwi',
          supportingText: 'Eat 2 pieces a day'
        });

        // Given the select is visible with the selected value
        const select = screen.getByElement(selectTag);
        await expect.element(select).toBeVisible();
        await expect.element(select).toHaveAttribute('value', 'kiwi');

        // and it renders a combobox
        await expect.element(screen.getByRole('combobox')).toBeVisible();

        await expect.element(select).toMatchScreenshot();
      });

      it('renders a select with a label', async () => {
        const screen = await renderComponent({ variant, label: 'Label' });

        const select = screen.getByElement(selectTag);
        await expect.element(select).toBeVisible();

        await expect.element(select).toMatchScreenshot();
      });

      it('renders a select with supporting text', async () => {
        const screen = await renderComponent({ variant, supportingText: 'Supporting text' });

        const select = screen.getByElement(selectTag);
        await expect.element(select).toBeVisible();

        await expect.element(select).toMatchScreenshot();
      });

      it('renders a select with an error', async () => {
        const screen = await renderComponent({ variant, label: 'Label', showError: true, errorText: 'Error text' });

        // Given the select is visible with the error state
        const select = screen.getByElement(selectTag);
        await expect.element(select).toBeVisible();
        await expect.element(select).toHaveAttribute('error');
        await expect.element(select).toHaveAttribute('error-text', 'Error text');

        await expect.element(select).toMatchScreenshot();
      });

      it('renders a disabled select', async () => {
        const screen = await renderComponent({ variant, label: 'Label', disabled: true });

        // Given the select is visible and disabled
        const select = screen.getByElement(selectTag);
        await expect.element(select).toBeVisible();
        await expect.element(select).toHaveAttribute('disabled');

        await expect.element(select).toMatchScreenshot();
      });

      it('renders a required select', async () => {
        const screen = await renderComponent({ variant, label: 'Label', required: true });

        // Given the select is visible and required, showing the asterisk
        const select = screen.getByElement(selectTag);
        await expect.element(select).toBeVisible();
        await expect.element(select).toHaveAttribute('required');

        await expect.element(select).toMatchScreenshot();
      });

      it('renders a required select without an asterisk', async () => {
        const screen = await renderComponent({ variant, label: 'Label', required: true, noAsterisk: true });

        // Given the select is visible and required without the asterisk
        const select = screen.getByElement(selectTag);
        await expect.element(select).toBeVisible();
        await expect.element(select).toHaveAttribute('required');
        await expect.element(select).toHaveAttribute('no-asterisk');

        await expect.element(select).toMatchScreenshot();
      });
    });
  });
});
