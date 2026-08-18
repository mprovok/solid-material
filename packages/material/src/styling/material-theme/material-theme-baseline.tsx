import { Hct, TonalPalette, argbFromHex, hexFromArgb, themeFromSourceColor } from '@material/material-color-utilities';

import './material-theme-baseline.css';

const TONES = [0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100];

const getPropertyName = (name: string, key: string, suffix: string = '') => {
  // oxlint-disable-next-line prefer-named-capture-group
  const token = key.replaceAll(/([a-z])([A-Z])/gu, '$1-$2').toLowerCase();
  return `--md-${name}-${token}${suffix}`;
};

const getPaletteColors = (palettes: Record<string, TonalPalette>, tones: number[]) => {
  return Object.entries(palettes)
    .flatMap(([key, palette]) => {
      return tones.map(tone => {
        const property = getPropertyName('ref-palette', key, `-${tone}`);
        const color = hexFromArgb(palette.tone(tone));
        return `${property}: ${color};`;
      });
    })
    .join('\n');
};

export const getStyleSheetBaselineColors = (themeColor: string): CSSStyleSheet => {
  const sourceColor = argbFromHex(themeColor);
  const theme = themeFromSourceColor(sourceColor);

  // Use chroma 6 instead of 4 for neutral palette (see Feb 2023 update at https://m3.material.io/styles/color/system/overview#)
  const sourceColorHct = Hct.fromInt(sourceColor);
  theme.palettes.neutral = TonalPalette.fromHueAndChroma(sourceColorHct.hue, 6);

  const css = `@layer material.theme { :root {${getPaletteColors(theme.palettes, TONES)}}}`;

  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(css);
  return styleSheet;

  // Alternatively, a theme can be exported from https://material-foundation.github.io/material-theme-builder/
};
