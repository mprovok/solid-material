import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { createSignal, createUniqueId } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import { MaterialRadio } from './MaterialRadio';

// Written by GLM 5.3 Flash

// md-radio is form-associated and exposes its checked state on the host
// element, which the generic element type does not know about
// oxlint-disable-next-line typescript/no-unsafe-type-assertion
const isChecked = (element: HTMLElement | SVGElement): boolean => (element as HTMLInputElement).checked;

interface RadioButtonWithLabelProps {
  index: number;
  checkedValue: string | undefined;
  onChange: (name: string | undefined, value: string | undefined) => void;
}

const RadioButtonWithLabel: VoidComponent<RadioButtonWithLabelProps> = props => {
  const id = createUniqueId();

  const isSelected = () => props.checkedValue === `value-${props.index}`;

  return (
    <div style={{ display: 'flex', 'align-items': 'center' }}>
      <MaterialRadio
        name="radio-buttons"
        value={`value-${props.index}`}
        id={id}
        checked={isSelected()}
        onChange={props.onChange}
      />
      <label for={id}>{`Radio ${props.index} is ${isSelected() ? 'checked' : 'not checked'}`}</label>
    </div>
  );
};

const MaterialRadioGroup: VoidComponent = () => {
  const [checkedValue, setCheckedValue] = createSignal<string | undefined>();

  const onChange = (_name: string | undefined, value: string | undefined) => {
    setCheckedValue(value);
  };

  return (
    <div role="radiogroup" style={{ display: 'flex', 'flex-direction': 'column' }}>
      <RadioButtonWithLabel index={0} checkedValue={checkedValue()} onChange={onChange} />
      <RadioButtonWithLabel index={1} checkedValue={checkedValue()} onChange={onChange} />
      <RadioButtonWithLabel index={2} checkedValue={checkedValue()} onChange={onChange} />
    </div>
  );
};

describe('MaterialRadio', () => {
  describe('Interaction', () => {
    it('moves the checked state within a labelled group when a radio is clicked', async () => {
      const { baseElement } = render(() => <MaterialRadioGroup />, { wrapper: MaterialTheme });
      const screen = page.elementLocator(baseElement);

      // Given the three unchecked radios are visible and labelled by their group
      // state (md-radio cannot be resolved through label queries either — like
      // its role, the label wiring lives in element internals — so the radios
      // are located by element and order while their labels, which carry the
      // state-dependent text, are asserted by their flipping text)
      const radio0 = screen.getByElement('md-radio').nth(0);
      const radio1 = screen.getByElement('md-radio').nth(1);
      const radio2 = screen.getByElement('md-radio').nth(2);
      await expect.element(radio0).toBeVisible();
      await expect.element(radio1).toBeVisible();
      await expect.element(radio2).toBeVisible();

      await expect.element(screen.getByText('Radio 0 is not checked', { exact: true })).toBeVisible();
      await expect.element(screen.getByText('Radio 1 is not checked', { exact: true })).toBeVisible();
      await expect.element(screen.getByText('Radio 2 is not checked', { exact: true })).toBeVisible();

      // and none of them carries the checked attribute
      await expect.element(radio0).not.toHaveAttribute('checked');
      await expect.element(radio1).not.toHaveAttribute('checked');
      await expect.element(radio2).not.toHaveAttribute('checked');

      // When the first radio is clicked
      await userEvent.click(radio0);

      // Then the first radio's label flips to "checked" while the others stay
      await expect.element(screen.getByText('Radio 0 is checked', { exact: true })).toBeVisible();
      await expect.element(screen.getByText('Radio 1 is not checked', { exact: true })).toBeVisible();
      await expect.element(screen.getByText('Radio 2 is not checked', { exact: true })).toBeVisible();

      // and only the first radio carries the checked attribute
      await expect.element(radio0).toHaveAttribute('checked');
      await expect.element(radio1).not.toHaveAttribute('checked');
      await expect.element(radio2).not.toHaveAttribute('checked');

      // When the second radio is clicked
      await userEvent.click(radio1);

      // Then the checked state moves to the second radio, its label flips to
      // "checked" and the first radio's flips back
      await expect.element(screen.getByText('Radio 0 is not checked', { exact: true })).toBeVisible();
      await expect.element(screen.getByText('Radio 1 is checked', { exact: true })).toBeVisible();
      await expect.element(screen.getByText('Radio 2 is not checked', { exact: true })).toBeVisible();

      // and only the second radio carries the checked attribute
      await expect.element(radio0).not.toHaveAttribute('checked');
      await expect.element(radio1).toHaveAttribute('checked');
      await expect.element(radio2).not.toHaveAttribute('checked');
    });

    it('fires onChange with name and value when clicked', async () => {
      const onChange = vi.fn();
      const { baseElement } = render(
        () => <MaterialRadio ariaLabel="Radio" name="group" value="one" onChange={onChange} />,
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      // Given the unchecked radio is visible
      const radio = screen.getByElement('md-radio');
      await expect.element(radio).toBeVisible();
      await expect.poll(() => isChecked(radio.element())).toBe(false);
      expect(onChange).not.toHaveBeenCalled();

      // When the radio is clicked
      await userEvent.click(radio);

      // Then the radio becomes checked and onChange is called with name and value
      // (md-radio's checked property does not reflect to an attribute, so the
      // property is asserted instead)
      await expect.poll(() => isChecked(radio.element())).toBe(true);
      expect(onChange).toHaveBeenCalledExactlyOnceWith('group', 'one');
    });

    it('ignores change events from non-radio targets', async () => {
      const onChange = vi.fn();
      const { baseElement } = render(
        () => <MaterialRadio ariaLabel="Radio" name="group" value="one" onChange={onChange} />,
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      // Given the radio is visible
      const radio = screen.getByElement('md-radio');
      await expect.element(radio).toBeVisible();

      // When a change event bubbles from a light-DOM child that is not a radio
      // (the event target has no checked property, so the handler's guard
      // rejects it)
      const span = document.createElement('span');
      radio.element().append(span);
      span.dispatchEvent(new Event('change', { bubbles: true }));

      // Then onChange is not called
      expect(onChange).not.toHaveBeenCalled();
    });

    it('disabled radio does not fire onChange', async () => {
      const onChange = vi.fn();
      const { baseElement } = render(
        () => <MaterialRadio ariaLabel="Radio" name="group" value="one" disabled={true} onChange={onChange} />,
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given the disabled radio is visible
      const radio = screen.getByElement('md-radio');
      await expect.element(radio).toBeVisible();
      await expect.element(radio).toHaveAttribute('disabled');
      expect(onChange).not.toHaveBeenCalled();

      // When the radio is clicked
      await userEvent.click(radio);

      // Then the radio stays unchecked and onChange is not called
      await expect.poll(() => isChecked(radio.element())).toBe(false);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Props', () => {
    it('renders without name and value', async () => {
      const onChange = vi.fn();
      const { baseElement } = render(() => <MaterialRadio ariaLabel="Radio" onChange={onChange} />, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);

      // Given the radio without name and value is visible
      const radio = screen.getByElement('md-radio');
      await expect.element(radio).toBeVisible();
      await expect.element(radio).not.toHaveAttribute('name');
      await expect.element(radio).not.toHaveAttribute('value');

      // When the radio is clicked
      await userEvent.click(radio);

      // Then onChange is called with undefined name and value
      await expect.poll(() => isChecked(radio.element())).toBe(true);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0]?.[0]).toBeUndefined();
      expect(onChange.mock.calls[0]?.[1]).toBeUndefined();
    });
  });

  describe('Accessibility', () => {
    // md-radio sets its radio role via element internals, so getByRole('radio')
    // cannot resolve it; the wiring is asserted through attributes on the host
    // elements while axe resolves the role itself during the scan
    it('exposes a group of two same-name radios with different values and has no axe violations', async () => {
      const { baseElement, container } = render(
        () => (
          <>
            <MaterialRadio ariaLabel="First radio" name="group" value="one" />
            <MaterialRadio ariaLabel="Second radio" name="group" value="two" disabled={true} />
          </>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given two radios of the same group are visible
      const radios = screen.getByElement('md-radio');
      await expect.element(radios.nth(0)).toBeVisible();
      await expect.element(radios.nth(1)).toBeVisible();

      // Then both carry the shared group name and their distinct values and labels
      await expect.element(radios.nth(0)).toHaveAttribute('name', 'group');
      await expect.element(radios.nth(0)).toHaveAttribute('value', 'one');
      await expect.element(radios.nth(0)).toHaveAttribute('aria-label', 'First radio');
      await expect.element(radios.nth(1)).toHaveAttribute('name', 'group');
      await expect.element(radios.nth(1)).toHaveAttribute('value', 'two');
      await expect.element(radios.nth(1)).toHaveAttribute('aria-label', 'Second radio');

      // and the disabled attribute sits on the second radio only
      await expect.element(radios.nth(0)).not.toHaveAttribute('disabled');
      await expect.element(radios.nth(1)).toHaveAttribute('disabled');

      // Then the rendered group has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('labels the radio via ariaLabel and has no axe violations', async () => {
      const { baseElement, container } = render(() => <MaterialRadio ariaLabel="Radio" />, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);

      // Given the ariaLabel-only radio is visible
      const radio = screen.getByElement('md-radio');
      await expect.element(radio).toBeVisible();

      // Then the label prop reaches the aria-label attribute
      await expect.element(radio).toHaveAttribute('aria-label', 'Radio');

      // and the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
