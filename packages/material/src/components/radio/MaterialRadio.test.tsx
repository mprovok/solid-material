import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import { MaterialRadio } from './MaterialRadio';

// Written by GLM 5.3 Flash

// md-radio is form-associated and exposes its checked state on the host
// element, which the generic element type does not know about
// oxlint-disable-next-line typescript/no-unsafe-type-assertion
const isChecked = (element: HTMLElement | SVGElement): boolean => (element as HTMLInputElement).checked;

describe('MaterialRadio', () => {
  describe('Interaction', () => {
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
});
