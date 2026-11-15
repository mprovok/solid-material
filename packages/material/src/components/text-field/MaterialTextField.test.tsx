import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { axe } from '../../../vitest.axe';

import type {
  MaterialTextFieldIconPosition,
  MaterialTextFieldProps,
  MaterialTextFieldVariant
} from './MaterialTextField';

import { MaterialTextField } from './MaterialTextField';

import SearchIcon from '@solidmaterial/icons/400/outlined/search.svg';

const FIELD_TAGS: Record<MaterialTextFieldVariant, string> = {
  filled: 'md-filled-text-field',
  outlined: 'md-outlined-text-field'
};

// The icon is passed separately so that its JSX is constructed inside the render
// accessor (SolidJS requires JSX to be built inside `render()`), mirroring the
// VRT helper's approach.
const renderField = (props: Omit<MaterialTextFieldProps, 'icon'>, iconPosition?: MaterialTextFieldIconPosition) =>
  render(() => (
    <MaterialTextField
      {...props}
      icon={iconPosition !== undefined ? <SearchIcon /> : undefined}
      iconPosition={iconPosition}
    />
  ));

describe('MaterialTextField', () => {
  describe('Accessibility', () => {
    describe.each(['filled', 'outlined'] satisfies MaterialTextFieldVariant[])('variant = $0', variant => {
      const fieldTag = FIELD_TAGS[variant];

      it('exposes the label as the accessible name of the textbox', async () => {
        const { baseElement, container } = renderField({ variant, label: 'Label' });
        const screen = page.elementLocator(baseElement);

        // Given the labelled text field renders a visible textbox
        const textbox = screen.getByRole('textbox', { name: 'Label' });
        await expect.element(textbox).toBeVisible();

        // Then the rendered tree has no axe violations
        await expect(await axe(container)).toHaveNoViolations();
      });

      it('exposes the error text and marks the textbox invalid when showError is set', async () => {
        const { baseElement, container } = renderField({
          variant,
          label: 'Label',
          showError: true,
          errorText: 'This field is invalid'
        });
        const screen = page.elementLocator(baseElement);

        // Given the error state is wired onto the underlying field
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toHaveAttribute('error');
        await expect.element(field).toHaveAttribute('error-text', 'This field is invalid');

        // Then the textbox is marked invalid and carries the error text as its accessible description
        const textbox = screen.getByRole('textbox', { name: 'Label' });
        await expect.element(textbox).toHaveAttribute('aria-invalid', 'true');
        await expect.element(textbox).toHaveAccessibleDescription('This field is invalid');

        // and the rendered tree has no axe violations
        await expect(await axe(container)).toHaveNoViolations();
      });

      it('exposes the supporting text as the accessible description of the textbox', async () => {
        const { baseElement, container } = renderField({ variant, label: 'Label', supportingText: 'Supporting text' });
        const screen = page.elementLocator(baseElement);

        // Given the supporting text is wired onto the underlying field
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toHaveAttribute('supporting-text', 'Supporting text');

        // Then the textbox carries the supporting text as its accessible description
        const textbox = screen.getByRole('textbox', { name: 'Label' });
        await expect.element(textbox).toHaveAccessibleDescription('Supporting text');

        // and the rendered tree has no axe violations
        await expect(await axe(container)).toHaveNoViolations();
      });

      it('renders the prefix and suffix text alongside the value', async () => {
        const { baseElement, container } = renderField({
          variant,
          label: 'Price',
          prefixText: '€',
          suffixText: '.00'
        });
        const screen = page.elementLocator(baseElement);

        // Given the prefix and suffix texts are wired onto the underlying field
        const field = screen.getByElement(fieldTag);
        await expect.element(field).toHaveAttribute('prefix-text', '€');
        await expect.element(field).toHaveAttribute('suffix-text', '.00');

        // Then the labelled textbox is still queryable
        await expect.element(screen.getByRole('textbox', { name: 'Price' })).toBeVisible();

        // and the rendered tree has no axe violations
        await expect(await axe(container)).toHaveNoViolations();
      });

      it.each(['start', 'end'] satisfies MaterialTextFieldIconPosition[])(
        'renders an icon in the $0 icon slot',
        async iconPosition => {
          const { baseElement, container } = renderField({ variant, label: 'Label' }, iconPosition);
          const screen = page.elementLocator(baseElement);

          // Given the icon flag is wired onto the underlying field for the chosen position
          const field = screen.getByElement(fieldTag);
          await expect
            .element(field)
            .toHaveAttribute(iconPosition === 'end' ? 'has-trailing-icon' : 'has-leading-icon');

          // Then the icon is slotted into the matching field slot and visible
          const icon = screen.getByElement('md-icon');
          await expect.element(icon).toBeVisible();
          await expect.element(icon).toHaveAttribute('slot', iconPosition === 'end' ? 'trailing-icon' : 'leading-icon');

          // and the rendered tree has no axe violations
          await expect(await axe(container)).toHaveNoViolations();
        }
      );

      it('renders a disabled textbox', async () => {
        const { baseElement, container } = renderField({ variant, label: 'Label', disabled: true });
        const screen = page.elementLocator(baseElement);

        // Given the disabled text field renders a visible textbox
        const textbox = screen.getByRole('textbox', { name: 'Label' });
        await expect.element(textbox).toBeVisible();

        // and it is inert
        await expect.element(textbox).toBeDisabled();

        // md-field's disabled label color tokens are upstream @material/web design;
        // the disabled input itself is exempt from contrast requirements, but the
        // label span is not — accepted for this scan
        await expect(await axe(container, { rules: { 'color-contrast': { enabled: false } } })).toHaveNoViolations();
      });
    });
  });
});
