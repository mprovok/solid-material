import type { FlowComponent, VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

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

// Mirrors the AssistChips story: a row of assist chips in different states
const AssistChipRow: VoidComponent = () => (
  <MaterialChipSet>
    <MaterialChip variant="assist" elevated>
      Elevated
    </MaterialChip>
    <MaterialChip variant="assist">Normal</MaterialChip>
    <MaterialChip variant="assist" ariaLabel="The ARIA label">
      ARIA label
    </MaterialChip>
    <MaterialChip variant="assist" elevated disabled>
      Elevated (disabled)
    </MaterialChip>
    <MaterialChip variant="assist" disabled>
      Disabled
    </MaterialChip>
    <MaterialChip variant="assist" disabled alwaysFocusable>
      Soft disabled
    </MaterialChip>
    <MaterialChip variant="assist" href="http://localhost:3000" target="_blank">
      Link
    </MaterialChip>
  </MaterialChipSet>
);

// Mirrors the FilterChips story: a row of filter chips in different states
const FilterChipRow: VoidComponent = () => (
  <MaterialChipSet>
    <MaterialChip variant="filter" selected={true} onClick={emptyFn}>
      Selected
    </MaterialChip>
    <MaterialChip variant="filter" selected={false} onClick={emptyFn}>
      Not selected
    </MaterialChip>
    <MaterialChip
      variant="filter"
      icon={<BatteryAndroidBoltIcon />}
      onRemove={emptyFn}
      selected={true}
      onClick={emptyFn}
    >
      Selected with icon
    </MaterialChip>
    <MaterialChip
      variant="filter"
      icon={<BatteryAndroidBoltIcon />}
      onRemove={emptyFn}
      selected={false}
      onClick={emptyFn}
    >
      Not selected with icon
    </MaterialChip>
    <MaterialChip
      variant="filter"
      icon={<MenuIcon />}
      selectedIcon={<CheckCircleIcon />}
      selected={true}
      onClick={emptyFn}
    >
      Custom selected icon
    </MaterialChip>
    <MaterialChip variant="filter" disabled selected={true} onClick={emptyFn}>
      Selected (disabled)
    </MaterialChip>
    <MaterialChip variant="filter" disabled selected={false} onClick={emptyFn}>
      Not selected (disabled)
    </MaterialChip>
    <MaterialChip variant="filter" elevated selected={true} onClick={emptyFn}>
      Selected (elevated)
    </MaterialChip>
    <MaterialChip variant="filter" elevated selected={false} onClick={emptyFn}>
      Not selected (elevated)
    </MaterialChip>
    <MaterialChip variant="filter" disabled elevated selected={true} onClick={emptyFn}>
      Selected (disabled and elevated)
    </MaterialChip>
    <MaterialChip variant="filter" disabled elevated selected={false} onClick={emptyFn}>
      Not selected (disabled and elevated)
    </MaterialChip>
  </MaterialChipSet>
);

// Mirrors the InputChips story: a row of input chips in different states
const InputChipRow: VoidComponent = () => (
  <MaterialChipSet>
    <MaterialChip variant="input" selected>
      Selected
    </MaterialChip>
    <MaterialChip variant="input" selected={false}>
      Not selected
    </MaterialChip>
    <MaterialChip variant="input" removeOnly selected>
      Selected (remove only)
    </MaterialChip>
    <MaterialChip variant="input" removeOnly selected={false}>
      Not selected (remove only)
    </MaterialChip>
  </MaterialChipSet>
);

// Mirrors the SuggestionChips story: a row of suggestion chips in different
// states
const SuggestionChipRow: VoidComponent = () => (
  <MaterialChipSet>
    <MaterialChip variant="suggestion">Suggestion chip</MaterialChip>
    <MaterialChip variant="suggestion" elevated>
      Elevated
    </MaterialChip>
    <MaterialChip variant="suggestion" disabled>
      Disabled
    </MaterialChip>
  </MaterialChipSet>
);

// Mirrors the stories' rows: every chip set renders a row of chips in
// different states
const renderComponent = async (Row: VoidComponent) => {
  const { baseElement } = render(() => <Row />, { wrapper: Wrapper });
  await document.fonts.ready;
  // Move the pointer to the middle of the page so that hover state from a
  // previous test or the browser's initial pointer position does not leak
  // into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 400, y: 300 } });
  return page.elementLocator(baseElement);
};

describe('MaterialChipSet', () => {
  describe('Visual', () => {
    it('renders a set of assist chips', async () => {
      const screen = await renderComponent(AssistChipRow);

      // Given the chip set is visible with a link chip inside
      const chipSet = screen.getByElement('md-chip-set');
      await expect.element(chipSet).toBeVisible();
      await expect.element(screen.getByElement('md-assist-chip[elevated]').first()).toBeVisible();
      await expect.element(screen.getByRole('link')).toBeVisible();

      await expect.element(chipSet).toMatchScreenshot();
    });

    it('renders a set of filter chips', async () => {
      const screen = await renderComponent(FilterChipRow);

      // Given the chip set is visible with selected chips inside
      const chipSet = screen.getByElement('md-chip-set');
      await expect.element(chipSet).toBeVisible();
      await expect.element(screen.getByElement('md-filter-chip[selected]').first()).toBeVisible();

      await expect.element(chipSet).toMatchScreenshot();
    });

    it('renders a set of input chips', async () => {
      const screen = await renderComponent(InputChipRow);

      // Given the chip set is visible with remove-only chips inside
      const chipSet = screen.getByElement('md-chip-set');
      await expect.element(chipSet).toBeVisible();
      await expect.element(screen.getByElement('md-input-chip[selected]').first()).toBeVisible();
      await expect.element(screen.getByElement('md-input-chip[remove-only]').first()).toBeVisible();

      await expect.element(chipSet).toMatchScreenshot();
    });

    it('renders a set of suggestion chips', async () => {
      const screen = await renderComponent(SuggestionChipRow);

      // Given the chip set is visible with an elevated chip inside
      const chipSet = screen.getByElement('md-chip-set');
      await expect.element(chipSet).toBeVisible();
      await expect.element(screen.getByElement('md-suggestion-chip[elevated]')).toBeVisible();

      await expect.element(chipSet).toMatchScreenshot();
    });
  });
});
