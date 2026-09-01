import type { FlowComponent } from 'solid-js';

import { Variant } from '@material/material-color-utilities';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import { usePrefersDark } from '@solid-primitives/media';
import { createEffect } from 'solid-js';

import { getStyleSheetBaselineColors } from './material-theme-baseline';
// Import Material Web Components
import '@material/web/elevation/elevation.js';

// Import fonts
import '@fontsource-variable/roboto-flex/wght.css';
// Import design tokens and reset some default UA styling
import '../index.css';
import '../material.css';
import '../reset.css';

import { getStyleSheetDynamicColors } from './material-theme-dynamic';

// Add CSS for typography
if (typescaleStyles.styleSheet !== undefined) {
  document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
}

export const DEFAULT_MATERIAL_THEME_COLOR = '#6750a4';

export type ThemeVariant = 'monochrome' | 'neutral' | 'tonal-spot' | 'vibrant' | 'expressive' | 'fidelity' | 'content';

export const isThemeVariant = (value: string): value is ThemeVariant => {
  return ['monochrome', 'neutral', 'tonal-spot', 'vibrant', 'expressive', 'fidelity', 'content'].includes(value);
};

export enum ThemeColorMode {
  SYSTEM = 'system',
  LIGHT = 'light',
  DARK = 'dark'
}

export interface MaterialThemeProps {
  /**
   * A hex code to use as the theme color, overriding the default Material
   * theme color ({@link DEFAULT_MATERIAL_THEME_COLOR})
   */
  color?: string;
  /**
   * Name of the dynamic color scheme
   *
   * If no theme is provided, the baseline color scheme is used.
   */
  theme?: ThemeVariant;
  /**
   * Whether to use light mode, dark mode, or whatever the system prefers
   */
  mode?: ThemeColorMode;
}

// argbFromHex() supports 3, 6, or 8 hex characters
const COLOR_REGEXP = /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/iu;
const isValidColor = (value: string): boolean => COLOR_REGEXP.test(value);

const THEME_VARIANT_MAPPING: Record<ThemeVariant, Variant> = {
  monochrome: Variant.MONOCHROME,
  neutral: Variant.NEUTRAL,
  'tonal-spot': Variant.TONAL_SPOT,
  vibrant: Variant.VIBRANT,
  expressive: Variant.EXPRESSIVE,
  fidelity: Variant.FIDELITY,
  content: Variant.CONTENT
};

type ThemeVersion = '2021' | '2025';

type ThemeGenerator = (themeColor: string) => CSSStyleSheet;

const baselineTheme: () => ThemeGenerator = () => getStyleSheetBaselineColors;
const dynamicTheme: (variant: ThemeVariant, version: ThemeVersion) => ThemeGenerator =
  (variant, version) => (color: string) =>
    getStyleSheetDynamicColors(color, THEME_VARIANT_MAPPING[variant], version);

/**
 * A component which adds CSS stylesheets for the design tokens of the colors
 *
 * All colors in Material Design are generated from a single theme color, which is
 * either the optional `color` prop or else the default Material theme color
 * ({@link DEFAULT_MATERIAL_THEME_COLOR}).
 */
export const MaterialTheme: FlowComponent<MaterialThemeProps> = props => {
  // Update CSS for palette colors
  createEffect(
    () => [props.color, props.theme] as const,
    ([color, theme]) => {
      const themeColor = color !== undefined && isValidColor(color) ? color : DEFAULT_MATERIAL_THEME_COLOR;

      const getStylesheet = theme !== undefined ? dynamicTheme(theme, '2025') : baselineTheme();
      const styleSheet = getStylesheet(themeColor);
      document.adoptedStyleSheets.push(styleSheet);

      return () => {
        const index = document.adoptedStyleSheets.indexOf(styleSheet);
        document.adoptedStyleSheets.splice(index);
      };
    }
  );

  const prefersDark = usePrefersDark();

  createEffect(
    () => {
      const systemMode = prefersDark() ? ThemeColorMode.DARK : ThemeColorMode.LIGHT;
      return props.mode === undefined || props.mode === ThemeColorMode.SYSTEM ? systemMode : props.mode;
    },
    mode => {
      globalThis.document.documentElement.dataset['theme'] = mode;
    }
  );

  return props.children;
};
