import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialPasswordFieldProps } from './MaterialPasswordField';
import type {
  MaterialTextFieldIconPosition,
  MaterialTextFieldProps,
  MaterialTextFieldVariant
} from './MaterialTextField';

import { MaterialPasswordField } from './MaterialPasswordField';
import { MaterialTextField } from './MaterialTextField';

import SearchIcon from '@solidmaterial/icons/400/outlined/search.svg';

// Written by GLM 5.3 Flash

const FIELD_TAGS: Record<MaterialTextFieldVariant, string> = {
  filled: 'md-filled-text-field',
  outlined: 'md-outlined-text-field'
};

// The text field stretches to the width of its container, so it is rendered
// inside a fixed-width wrapper which keeps its box deterministic. The icon is
// passed separately so that the JSX is constructed inside the render accessor.
// No test focuses the field, so no caret is captured.
const renderComponent = async (
  props: Omit<MaterialTextFieldProps, 'icon'>,
  iconPosition?: MaterialTextFieldIconPosition
) => {
  const { baseElement } = render(
    () => (
      <main style={{ padding: '1rem', width: '320px' }}>
        <MaterialTextField
          {...props}
          icon={iconPosition !== undefined ? <SearchIcon /> : undefined}
          iconPosition={iconPosition}
        />
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

const renderPasswordComponent = async (props: Omit<MaterialPasswordFieldProps, 'type'>) => {
  const { baseElement } = render(
    () => (
      <main style={{ padding: '1rem', width: '320px' }}>
        <MaterialPasswordField {...props} />
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

describe('MaterialTextField', () => {
  describe('Visual', () => {
    describe.each(['filled', 'outlined'] satisfies MaterialTextFieldVariant[])('variant = $0', variant => {
      const fieldTag = FIELD_TAGS[variant];

      it('renders a text field with a label', async () => {
        const screen = await renderComponent({ variant, label: 'Label' });

        // Given the text field is visible with its labelled input
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toBeVisible();
        await expect.element(screen.getByRole('textbox', { name: 'Label' })).toBeVisible();

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a text field with a label and a value', async () => {
        const screen = await renderComponent({ variant, label: 'Label', value: 'Value' });

        // Given the text field is visible with the given value
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('value', 'Value');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a text field with a placeholder', async () => {
        const screen = await renderComponent({ variant, placeholder: 'Placeholder', ariaLabel: 'Text field' });

        // Given the text field is visible with the placeholder
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('placeholder', 'Placeholder');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a text field with prefix and suffix text', async () => {
        const screen = await renderComponent({
          variant,
          label: 'Prefix and suffix',
          prefixText: '€',
          suffixText: '.00'
        });

        // Given the text field is visible with the prefix and suffix texts
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('prefix-text', '€');
        await expect.element(field).toHaveAttribute('suffix-text', '.00');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a text field with supporting text', async () => {
        const screen = await renderComponent({ variant, label: 'Label', supportingText: 'Supporting text' });

        const field = screen.getByElement(fieldTag);
        await expect.element(field).toBeVisible();

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a text field with an error', async () => {
        const screen = await renderComponent({
          variant,
          label: 'Label',
          showError: true,
          errorText: 'This field is invalid'
        });

        // Given the text field is visible with the error state
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('error');
        await expect.element(field).toHaveAttribute('error-text', 'This field is invalid');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a disabled text field', async () => {
        const screen = await renderComponent({ variant, label: 'Label', disabled: true });

        // Given the text field is visible and disabled
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('disabled');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a required text field', async () => {
        const screen = await renderComponent({ variant, label: 'Label', required: true });

        // Given the text field is visible and required, showing the asterisk
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('required');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a required text field without an asterisk', async () => {
        const screen = await renderComponent({ variant, label: 'Label', required: true, noAsterisk: true });

        // Given the text field is visible and required without the asterisk
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('required');
        await expect.element(field).toHaveAttribute('no-asterisk');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a read-only text field with a value', async () => {
        const screen = await renderComponent({ variant, label: 'Read only', readOnly: true, value: 'Not editable' });

        // Given the text field is visible and read-only
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('readonly');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a text field with a leading icon', async () => {
        const screen = await renderComponent({ variant, label: 'Label' }, 'start');

        const field = screen.getByElement(fieldTag);
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('has-leading-icon');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a text field with a trailing icon', async () => {
        const screen = await renderComponent({ variant, label: 'Label' }, 'end');

        const field = screen.getByElement(fieldTag);
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('has-trailing-icon');

        await expect.element(field).toMatchScreenshot();
      });
    });

    describe('Types', () => {
      it('renders a number text field with minimum, maximum and step', async () => {
        const screen = await renderComponent({
          variant: 'outlined',
          type: 'number',
          label: 'Number',
          minimum: 0,
          maximum: 10,
          step: 2,
          supportingText: 'A number between 0 and 10 with a step size of 2'
        });

        // Given the number field is visible with the numeric bounds
        const field = screen.getByElement('md-outlined-text-field');
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('min', '0');
        await expect.element(field).toHaveAttribute('max', '10');
        await expect.element(field).toHaveAttribute('step', '2');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a number text field without a spinner', async () => {
        const screen = await renderComponent({ variant: 'outlined', type: 'number', label: 'Number', noSpinner: true });

        // Given the number field is visible without the spinner
        const field = screen.getByElement('md-outlined-text-field');
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('no-spinner');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders an email text field', async () => {
        const screen = await renderComponent({ variant: 'outlined', type: 'email', label: 'Email' });

        // Given the email field is visible
        const field = screen.getByElement('md-outlined-text-field');
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('type', 'email');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a URL text field', async () => {
        const screen = await renderComponent({ variant: 'outlined', type: 'url', label: 'URL' });

        const field = screen.getByElement('md-outlined-text-field');
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('type', 'url');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a search text field', async () => {
        const screen = await renderComponent({ variant: 'outlined', type: 'search', label: 'Search' });

        const field = screen.getByElement('md-outlined-text-field');
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('type', 'search');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a telephone text field', async () => {
        const screen = await renderComponent({ variant: 'outlined', type: 'tel', label: 'Telephone' });

        const field = screen.getByElement('md-outlined-text-field');
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('type', 'tel');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a textarea with rows, columns and a long value', async () => {
        const screen = await renderComponent({
          variant: 'outlined',
          type: 'textarea',
          label: 'Textarea',
          rows: 5,
          columns: 10,
          value: '12345678902345678901345678901245678901235678901234'
        });

        // Given the textarea is visible with the given rows and columns
        const field = screen.getByElement('md-outlined-text-field');
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('rows', '5');
        await expect.element(field).toHaveAttribute('cols', '10');

        await expect.element(field).toMatchScreenshot();
      });
    });

    describe('Password', () => {
      // The visibility toggle button is slotted into the field's trailing
      // icon slot, which keeps it out of Playwright's accessibility tree, so
      // it is asserted through its element and aria-label attribute
      it('renders a password field which hides the value', async () => {
        const screen = await renderPasswordComponent({ variant: 'outlined', label: 'Password' });

        // Given the password field is visible and the value is hidden
        const field = screen.getByElement('md-outlined-text-field');
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('type', 'password');

        // and the visibility toggle shows the show action
        const toggle = screen.getByElement('sm-icon-button button');
        await expect.element(toggle).toBeVisible();
        await expect.element(toggle).toHaveAttribute('aria-label', 'Click to show');

        await expect.element(field).toMatchScreenshot();
      });

      it('renders a password field which shows the value', async () => {
        const screen = await renderPasswordComponent({ variant: 'outlined', label: 'Password', visible: true });

        // Given the password field is visible and the value is shown
        const field = screen.getByElement('md-outlined-text-field');
        await expect.element(field).toBeVisible();
        await expect.element(field).toHaveAttribute('type', 'text');

        // and the visibility toggle shows the hide action
        const toggle = screen.getByElement('sm-icon-button button');
        await expect.element(toggle).toBeVisible();
        await expect.element(toggle).toHaveAttribute('aria-label', 'Click to hide');

        await expect.element(field).toMatchScreenshot();
      });
    });
  });
});
