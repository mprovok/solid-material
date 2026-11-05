import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import type { MaterialThemeProps } from './MaterialTheme';

import { DEFAULT_MATERIAL_THEME_COLOR, MaterialTheme, ThemeColorMode, isThemeVariant } from './MaterialTheme';

// Written by GLM 5.3 Flash

// MaterialTheme is itself the theme wrapper: it is rendered without a wrapper
// here, and each test unmounts its renders explicitly so the adopted stylesheets
// of one render cannot be removed by another render's cleanup
const ModeFixture: VoidComponent<{ mode: ThemeColorMode }> = props => (
  <MaterialTheme mode={props.mode}>
    <p>Themed content</p>
  </MaterialTheme>
);

// MaterialTheme renders nothing without children, but the FlowComponent type
// requires them: use a type without the children requirement for the
// childless renders
// oxlint-disable-next-line typescript/no-unsafe-type-assertion
const ThemeWithoutChildren = MaterialTheme as VoidComponent<MaterialThemeProps>;

const baselinePaletteToken = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--md-ref-palette-primary-40').trim();

const dynamicColorToken = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary').trim();

describe('MaterialTheme', () => {
  describe('Baseline', () => {
    it('renders children and applies the baseline stylesheet', async () => {
      const theme = render(() => (
        <MaterialTheme>
          <p>Themed content</p>
        </MaterialTheme>
      ));
      const screen = page.elementLocator(theme.baseElement);

      // Given the theme renders its children
      await expect.element(screen.getByText('Themed content')).toBeVisible();

      // Then the baseline palette token resolves to a non-empty value
      expect(baselinePaletteToken()).not.toBe('');

      theme.unmount();

      // When the theme renders without children
      const empty = render(() => <ThemeWithoutChildren />);

      // Then nothing is rendered and no error is thrown
      expect(empty.container.innerHTML).toBe('');
      empty.unmount();
    });

    it('falls back to the default color for an invalid color prop', () => {
      // Given the baseline theme color
      const baseline = render(() => <ThemeWithoutChildren />);
      const baselineToken = baselinePaletteToken();
      expect(baselineToken).not.toBe('');
      baseline.unmount();

      // When an invalid color prop is given
      const invalid = render(() => <ThemeWithoutChildren color="not-a-color" />);
      const invalidToken = baselinePaletteToken();
      invalid.unmount();

      // Then the generated baseline still uses the default theme color
      expect(invalidToken).toBe(baselineToken);
      expect(DEFAULT_MATERIAL_THEME_COLOR).toBe('#6750a4');
    });
  });

  describe('Dynamic', () => {
    it('generates a dynamic scheme from a valid color prop', () => {
      // Given the baseline theme without dynamic system color tokens
      const baseline = render(() => <ThemeWithoutChildren />);
      expect(baselinePaletteToken()).not.toBe('');
      baseline.unmount();

      const before = dynamicColorToken();

      // When a dynamic theme is generated from a valid color
      const dynamic = render(() => <ThemeWithoutChildren color="#00b294" theme="vibrant" />);
      const after = dynamicColorToken();
      dynamic.unmount();

      // Then the dynamic system color token resolves and differs from the
      // value before the dynamic theme was applied
      expect(after).not.toBe('');
      expect(after).not.toBe(before);
    });
  });

  describe('Validation', () => {
    it('isThemeVariant validates variant names', () => {
      expect(isThemeVariant('tonal-spot')).toBe(true);
      expect(isThemeVariant('vibrant')).toBe(true);
      expect(isThemeVariant('bogus')).toBe(false);
    });
  });

  describe('Mode', () => {
    it('mode prop sets data-theme on documentElement', async () => {
      const [getMode, setMode] = createSignal<ThemeColorMode>(ThemeColorMode.DARK);

      render(() => <ModeFixture mode={getMode()} />);

      // Given the theme renders in dark mode
      await expect.poll(() => document.documentElement.dataset['theme']).toBe('dark');

      // When the mode switches to light
      setMode(ThemeColorMode.LIGHT);

      // Then data-theme follows the mode prop
      await expect.poll(() => document.documentElement.dataset['theme']).toBe('light');
    });
  });

  describe('Unmount', () => {
    it('removes its stylesheet on unmount', () => {
      const theme = render(() => <ThemeWithoutChildren />);

      // Given the theme adopted its stylesheet
      const sheetCount = document.adoptedStyleSheets.length;
      expect(sheetCount).toBeGreaterThan(0);
      const sheet = document.adoptedStyleSheets[sheetCount - 1];

      // When the theme is unmounted
      theme.unmount();

      // Then its stylesheet is no longer adopted
      expect([...document.adoptedStyleSheets]).not.toContain(sheet);
    });
  });
});
