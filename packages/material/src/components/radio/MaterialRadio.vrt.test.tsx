import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { createUniqueId } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialRadioProps } from './MaterialRadio';

import { MaterialRadio } from './MaterialRadio';

// Written by GLM 5.3 Flash

// md-radio sets its radio role via element internals, so getByRole('radio')
// cannot resolve it; the state is asserted through the checked and disabled
// attributes which Solid renders on the host element
const renderComponent = async (props: MaterialRadioProps) => {
  const { baseElement } = render(() => <MaterialRadio {...props} />, { wrapper: MaterialTheme });
  await document.fonts.ready;
  const screen = page.elementLocator(baseElement);

  // Move the pointer to the middle of the page: the radio's extended touch
  // target reaches the browser's initial pointer position in the top-left
  // corner, which would otherwise hover the radio in the screenshots
  await userEvent.hover(document.body, { position: { x: 400, y: 300 } });

  return screen;
};

// Mirrors the RadioButtonWithLabel fixture from MaterialRadio.stories.tsx: a
// for-labelled radio in a row, part of a group sharing the same name
const RadioButtonWithLabel: VoidComponent<{ index: number; checkedValue: string }> = props => {
  const id = createUniqueId();

  const isChecked = () => props.checkedValue === `value-${props.index}`;

  return (
    <div style={{ display: 'flex', 'align-items': 'center' }}>
      <MaterialRadio name="radio-buttons" value={`value-${props.index}`} id={id} checked={isChecked()} />
      <label for={id}>{`Radio ${props.index} is ${isChecked() ? 'checked' : 'not checked'}`}</label>
    </div>
  );
};

const RadioGroup: VoidComponent = () => (
  <div role="radiogroup" style={{ display: 'flex', 'flex-direction': 'column', gap: '0.25rem' }}>
    <RadioButtonWithLabel index={0} checkedValue="value-1" />
    <RadioButtonWithLabel index={1} checkedValue="value-1" />
    <RadioButtonWithLabel index={2} checkedValue="value-1" />
  </div>
);

describe('MaterialRadio', () => {
  describe('Visual', () => {
    it('renders an unchecked radio', async () => {
      const screen = await renderComponent({ checked: false, ariaLabel: 'Radio' });

      // Given the radio is visible and unchecked
      const radio = screen.getByElement('md-radio');
      await expect.element(radio).toBeVisible();
      await expect.element(radio).not.toHaveAttribute('checked');

      await expect.element(radio).toMatchScreenshot();
    });

    it('renders a checked radio', async () => {
      const screen = await renderComponent({ checked: true, ariaLabel: 'Radio' });

      // Given the radio is visible and checked
      const radio = screen.getByElement('md-radio');
      await expect.element(radio).toBeVisible();
      await expect.element(radio).toHaveAttribute('checked');

      await expect.element(radio).toMatchScreenshot();
    });

    it('renders a disabled unchecked radio', async () => {
      const screen = await renderComponent({ checked: false, disabled: true, ariaLabel: 'Radio' });

      // Given the radio is visible and disabled
      const radio = screen.getByElement('md-radio');
      await expect.element(radio).toBeVisible();
      await expect.element(radio).toBeDisabled();
      await expect.element(radio).not.toHaveAttribute('checked');

      await expect.element(radio).toMatchScreenshot();
    });

    it('renders a disabled checked radio', async () => {
      const screen = await renderComponent({ checked: true, disabled: true, ariaLabel: 'Radio' });

      // Given the radio is visible, disabled and checked
      const radio = screen.getByElement('md-radio');
      await expect.element(radio).toBeVisible();
      await expect.element(radio).toBeDisabled();
      await expect.element(radio).toHaveAttribute('checked');

      await expect.element(radio).toMatchScreenshot();
    });

    it('renders a group of labelled radios with the second one checked', async () => {
      const { baseElement } = render(() => <RadioGroup />, { wrapper: MaterialTheme });
      await document.fonts.ready;
      const screen = page.elementLocator(baseElement);

      // Move the pointer to the middle of the page so the radios are not
      // hovered in the screenshot
      await userEvent.hover(document.body, { position: { x: 400, y: 300 } });

      // Given the radio group is visible
      const group = screen.getByRole('radiogroup');
      await expect.element(group).toBeVisible();

      // and exactly the second radio is checked
      const checkedRadio = screen.getByElement('md-radio[checked]');
      await expect.element(checkedRadio).toBeVisible();
      await expect.element(checkedRadio).toHaveAttribute('checked');
      await expect.element(screen.getByText('Radio 1 is checked')).toBeVisible();

      await expect.element(group).toMatchScreenshot();
    });
  });
});
