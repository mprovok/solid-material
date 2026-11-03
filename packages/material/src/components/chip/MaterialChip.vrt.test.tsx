import type { FlowComponent } from 'solid-js';
import type { Locator } from 'vitest/browser';

import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialChipProps } from './MaterialChip';

import { MaterialChip } from './MaterialChip';
import { MaterialChipSet } from './MaterialChipSet';

import BatteryAndroidBoltIcon from '@solidmaterial/icons/400/outlined/battery_android_bolt.svg';
import CheckCircleIcon from '@solidmaterial/icons/400/outlined/check_circle.svg';
import MenuIcon from '@solidmaterial/icons/400/outlined/menu.svg';

// Written by GLM 5.3 Flash

const emptyFn = () => {
  // Empty
};

// Padded white background so the elevation shadows of the elevated chips are
// not clipped in screenshots
const Wrapper: FlowComponent = props => (
  <MaterialTheme theme="tonal-spot">
    <div style={{ 'background-color': 'white', padding: '2rem' }}>{props.children}</div>
  </MaterialTheme>
);

// The icon props are passed as components so that the JSX is constructed
// inside the render accessor
type RenderChipProps = Omit<MaterialChipProps, 'icon' | 'selectedIcon'> & {
  Icon?: typeof MenuIcon;
  SelectedIcon?: typeof CheckCircleIcon;
};

// Every chip renders inside a chip set, mirroring the stories' decorator
const renderComponent = async (props: RenderChipProps) => {
  const { Icon, SelectedIcon, ...chipProps } = props;

  const { baseElement } = render(
    () => (
      <MaterialChipSet>
        <MaterialChip
          {...chipProps}
          icon={Icon !== undefined ? <Icon /> : undefined}
          selectedIcon={SelectedIcon !== undefined ? <SelectedIcon /> : undefined}
        >
          Chip
        </MaterialChip>
      </MaterialChipSet>
    ),
    { wrapper: Wrapper }
  );
  await document.fonts.ready;
  // Move the pointer to the middle of the page so that hover state from a
  // previous test or the browser's initial pointer position does not leak
  // into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 400, y: 300 } });
  return page.elementLocator(baseElement);
};

// Asserts that the chip of the given variant is visible and documents its
// disabled state, then returns the chip set locator for the screenshot
const expectChipSetScreenshot = async (screen: Locator, tag: string, disabled = false) => {
  const chip = screen.getByElement(tag);
  await expect.element(chip).toBeVisible();
  if (disabled) {
    await expect.element(chip).toHaveAttribute('disabled');
  }

  const chipSet = screen.getByElement('md-chip-set');
  await expect.element(chipSet).toBeVisible();

  await expect.element(chipSet).toMatchScreenshot();
};

describe('MaterialChip', () => {
  describe('Visual', () => {
    describe('Assist', () => {
      it('renders an assist chip', async () => {
        const screen = await renderComponent({ variant: 'assist' });

        await expectChipSetScreenshot(screen, 'md-assist-chip');
      });

      it('renders an elevated assist chip', async () => {
        const screen = await renderComponent({ variant: 'assist', elevated: true });

        await expectChipSetScreenshot(screen, 'md-assist-chip');
      });

      it('renders an assist chip with an icon', async () => {
        const screen = await renderComponent({ variant: 'assist', Icon: MenuIcon });

        await expectChipSetScreenshot(screen, 'md-assist-chip');
      });

      it('renders a disabled assist chip', async () => {
        const screen = await renderComponent({ variant: 'assist', disabled: true });

        await expectChipSetScreenshot(screen, 'md-assist-chip', true);
      });

      it('renders a disabled but focusable assist chip', async () => {
        const screen = await renderComponent({ variant: 'assist', disabled: true, alwaysFocusable: true });

        await expectChipSetScreenshot(screen, 'md-assist-chip', true);
      });

      it('renders an elevated disabled assist chip', async () => {
        const screen = await renderComponent({ variant: 'assist', elevated: true, disabled: true });

        await expectChipSetScreenshot(screen, 'md-assist-chip', true);
      });

      it('renders an assist chip as a link', async () => {
        const screen = await renderComponent({ variant: 'assist', href: '/', target: '_blank' });

        // Given the chip is rendered as a link
        const link = screen.getByRole('link');
        await expect.element(link).toBeVisible();
        await expect.element(link).toHaveAttribute('href', '/');

        await expectChipSetScreenshot(screen, 'md-assist-chip');
      });
    });

    describe('Suggestion', () => {
      it('renders a suggestion chip', async () => {
        const screen = await renderComponent({ variant: 'suggestion' });

        await expectChipSetScreenshot(screen, 'md-suggestion-chip');
      });

      it('renders an elevated suggestion chip', async () => {
        const screen = await renderComponent({ variant: 'suggestion', elevated: true });

        await expectChipSetScreenshot(screen, 'md-suggestion-chip');
      });

      it('renders a suggestion chip with an icon', async () => {
        const screen = await renderComponent({ variant: 'suggestion', Icon: MenuIcon });

        await expectChipSetScreenshot(screen, 'md-suggestion-chip');
      });

      it('renders a disabled suggestion chip', async () => {
        const screen = await renderComponent({ variant: 'suggestion', disabled: true });

        await expectChipSetScreenshot(screen, 'md-suggestion-chip', true);
      });
    });

    describe('Filter', () => {
      describe.each([false, true])('selected = $0', selected => {
        it('renders a filter chip', async () => {
          const screen = await renderComponent({ variant: 'filter', selected });

          const chip = screen.getByElement('md-filter-chip');
          await expect.element(chip).toBeVisible();
          if (selected) {
            await expect.element(chip).toHaveAttribute('selected');
          }

          await expectChipSetScreenshot(screen, 'md-filter-chip');
        });

        it('renders an elevated filter chip', async () => {
          const screen = await renderComponent({ variant: 'filter', selected, elevated: true });

          const chip = screen.getByElement('md-filter-chip');
          await expect.element(chip).toBeVisible();
          await expect.element(chip).toHaveAttribute('elevated');

          await expectChipSetScreenshot(screen, 'md-filter-chip');
        });

        it('renders a filter chip with an icon', async () => {
          const screen = await renderComponent({ variant: 'filter', selected, Icon: BatteryAndroidBoltIcon });

          await expectChipSetScreenshot(screen, 'md-filter-chip');
        });
      });

      it('renders a removable filter chip', async () => {
        const screen = await renderComponent({ variant: 'filter', Icon: BatteryAndroidBoltIcon, onRemove: emptyFn });

        await expectChipSetScreenshot(screen, 'md-filter-chip');
      });

      it('renders a filter chip with a custom selected icon', async () => {
        const screen = await renderComponent({ variant: 'filter', selected: true, SelectedIcon: CheckCircleIcon });

        const chip = screen.getByElement('md-filter-chip');
        await expect.element(chip).toBeVisible();
        await expect.element(chip).toHaveAttribute('selected');

        await expectChipSetScreenshot(screen, 'md-filter-chip');
      });

      it('renders a disabled filter chip which is not selected', async () => {
        const screen = await renderComponent({ variant: 'filter', selected: false, disabled: true });

        await expectChipSetScreenshot(screen, 'md-filter-chip', true);
      });

      it('renders a disabled filter chip which is selected', async () => {
        const screen = await renderComponent({ variant: 'filter', selected: true, disabled: true });

        const chip = screen.getByElement('md-filter-chip');
        await expect.element(chip).toBeVisible();
        await expect.element(chip).toHaveAttribute('selected');

        await expectChipSetScreenshot(screen, 'md-filter-chip', true);
      });

      it('renders a disabled elevated filter chip which is not selected', async () => {
        const screen = await renderComponent({ variant: 'filter', selected: false, elevated: true, disabled: true });

        await expectChipSetScreenshot(screen, 'md-filter-chip', true);
      });

      it('renders a disabled elevated filter chip which is selected', async () => {
        const screen = await renderComponent({ variant: 'filter', selected: true, elevated: true, disabled: true });

        const chip = screen.getByElement('md-filter-chip');
        await expect.element(chip).toBeVisible();
        await expect.element(chip).toHaveAttribute('selected');

        await expectChipSetScreenshot(screen, 'md-filter-chip', true);
      });
    });

    describe('Input', () => {
      describe.each([false, true])('selected = $0', selected => {
        it('renders an input chip', async () => {
          const screen = await renderComponent({ variant: 'input', selected });

          const chip = screen.getByElement('md-input-chip');
          await expect.element(chip).toBeVisible();
          if (selected) {
            await expect.element(chip).toHaveAttribute('selected');
          }

          await expectChipSetScreenshot(screen, 'md-input-chip');
        });

        it('renders a remove-only input chip', async () => {
          const screen = await renderComponent({ variant: 'input', selected, removeOnly: true });

          const chip = screen.getByElement('md-input-chip');
          await expect.element(chip).toBeVisible();
          await expect.element(chip).toHaveAttribute('remove-only');

          await expectChipSetScreenshot(screen, 'md-input-chip');
        });
      });

      it('renders an input chip with an avatar', async () => {
        const screen = await renderComponent({ variant: 'input', Icon: MenuIcon, avatar: true });

        const chip = screen.getByElement('md-input-chip');
        await expect.element(chip).toBeVisible();
        await expect.element(chip).toHaveAttribute('avatar');

        await expectChipSetScreenshot(screen, 'md-input-chip');
      });

      it('renders an input chip as a link', async () => {
        const screen = await renderComponent({ variant: 'input', href: '/', target: '_blank' });

        // Given the chip is rendered as a link
        const link = screen.getByRole('link');
        await expect.element(link).toBeVisible();
        await expect.element(link).toHaveAttribute('href', '/');

        await expectChipSetScreenshot(screen, 'md-input-chip');
      });
    });
  });
});
