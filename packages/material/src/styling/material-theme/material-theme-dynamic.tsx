import type { DynamicColor } from '@material/material-color-utilities';

import { DynamicScheme, Hct, Variant, argbFromHex, hexFromArgb } from '@material/material-color-utilities';

const getPropertyName = (name: string, key: string, suffix: string = '') => {
  // oxlint-disable-next-line prefer-named-capture-group
  const token = key.replaceAll(/([a-z])([A-Z])/gu, '$1-$2').toLowerCase();
  return `--md-${name}-${token}${suffix}`;
};

const getDynamicColorScheme = (dynamicScheme: DynamicScheme) => {
  const getCssVariable = (color: DynamicColor) => {
    const name = color.name.replaceAll('_', '-');
    return getPropertyName('sys-color', name);
  };
  const getColor = (scheme: DynamicScheme, color: DynamicColor) => hexFromArgb(color.getArgb(scheme));

  return [
    ...dynamicScheme.colors.allColors,
    dynamicScheme.colors.surfaceVariant(),
    dynamicScheme.colors.shadow(),
    dynamicScheme.colors.scrim(),
    dynamicScheme.colors.surfaceTint()
  ].map(color => [getCssVariable(color), getColor(dynamicScheme, color)]);
};

export const getStyleSheetDynamicColors = (
  themeColor: string,
  variant: Variant = Variant.TONAL_SPOT,
  version: '2021' | '2025' = '2025'
): CSSStyleSheet => {
  const sourceColor = argbFromHex(themeColor);
  const sourceColorHct = Hct.fromInt(sourceColor);

  const options = {
    sourceColorHct,
    variant,
    specVersion: version
  };

  const schemeLightNormal = new DynamicScheme({
    ...options,
    contrastLevel: 0,
    isDark: false,
    platform: 'phone'
  });

  const schemeLightContrast = new DynamicScheme({
    ...options,
    contrastLevel: 1,
    isDark: false,
    platform: 'phone'
  });

  const schemeDarkNormal = new DynamicScheme({
    ...options,
    contrastLevel: 0,
    isDark: true,
    platform: 'phone'
  });

  const schemeDarkContrast = new DynamicScheme({
    ...options,
    contrastLevel: 1,
    isDark: true,
    platform: 'phone'
  });

  const getCssVariables = (scheme: DynamicScheme) => {
    const colorScheme = getDynamicColorScheme(scheme);
    return colorScheme.map(([property, color]) => `${property}: ${color};`).join('\n');
  };

  const css = `@layer material.theme {
  :root {
${getCssVariables(schemeLightNormal)}
    @media (prefers-contrast: more) {
${getCssVariables(schemeLightContrast)}
    }
  }
  :root[data-theme="dark"] {
${getCssVariables(schemeDarkNormal)}
    @media (prefers-contrast: more) {
${getCssVariables(schemeDarkContrast)}
    }
  }
}
  `;

  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(css);
  return styleSheet;
};
