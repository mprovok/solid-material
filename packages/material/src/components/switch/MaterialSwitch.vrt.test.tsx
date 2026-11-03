import type { Locator } from 'vitest/browser';

import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialSwitchProps } from './MaterialSwitch';

import { MaterialSwitch } from './MaterialSwitch';

// Written by GLM 5.3 Flash

const renderComponent = async (props: MaterialSwitchProps) => {
  const { baseElement } = render(() => <MaterialSwitch {...props} />, { wrapper: MaterialTheme });
  await document.fonts.ready;
  // Move the pointer to the middle of the page so that hover state from a
  // previous test or the browser's initial pointer position does not leak
  // into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 400, y: 300 } });
  return page.elementLocator(baseElement);
};

// Asserts that the switch renders with the expected selected state
const expectSelected = async (switchElement: Locator, selected: boolean) => {
  return selected ? expect.element(switchElement).toBeChecked() : expect.element(switchElement).not.toBeChecked();
};

// Unselected and selected switches — plain, with icons, with only the
// selected icon, and disabled with icons
describe('MaterialSwitch', () => {
  describe('Visual', () => {
    describe.each([false, true])('selected = $0', selected => {
      it('renders a plain switch', async () => {
        const screen = await renderComponent({ selected, ariaLabel: 'Switch' });

        // Given the switch is visible with the expected selected state
        const switchElement = screen.getByRole('switch', { name: 'Switch' });
        await expect.element(switchElement).toBeVisible();
        await expectSelected(switchElement, selected);

        await expect.element(screen.getByElement('md-switch')).toMatchScreenshot();
      });

      it('renders a switch with icons', async () => {
        const screen = await renderComponent({ selected, icons: true, ariaLabel: 'Switch' });

        // Given the switch is visible with the expected selected state
        const switchElement = screen.getByRole('switch', { name: 'Switch' });
        await expect.element(switchElement).toBeVisible();
        await expectSelected(switchElement, selected);

        await expect.element(screen.getByElement('md-switch')).toMatchScreenshot();
      });

      it('renders a switch with only the selected icon', async () => {
        const screen = await renderComponent({
          selected,
          icons: true,
          showOnlySelectedIcon: true,
          ariaLabel: 'Switch'
        });

        // Given the switch is visible with the expected selected state
        const switchElement = screen.getByRole('switch', { name: 'Switch' });
        await expect.element(switchElement).toBeVisible();
        await expectSelected(switchElement, selected);

        await expect.element(screen.getByElement('md-switch')).toMatchScreenshot();
      });

      it('renders a disabled switch with icons', async () => {
        const screen = await renderComponent({ selected, icons: true, disabled: true, ariaLabel: 'Switch' });

        // Given the switch is visible and disabled
        const switchElement = screen.getByRole('switch', { name: 'Switch' });
        await expect.element(switchElement).toBeVisible();
        await expect.element(switchElement).toBeDisabled();

        await expect.element(screen.getByElement('md-switch')).toMatchScreenshot();
      });
    });
  });
});
