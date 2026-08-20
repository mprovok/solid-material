import type { ThemeVariant } from '@solidmaterial/material/styling';
import type { Context, Signal } from 'solid-js';

import { ThemeColorMode } from '@solidmaterial/material/styling';
import { createContext, createSignal } from 'solid-js';

export const ThemeColorModeContext: Context<Signal<ThemeColorMode>> = createContext(
  createSignal(ThemeColorMode.SYSTEM)
);

export const ThemeVariantContext: Context<Signal<ThemeVariant | undefined>> = createContext(
  createSignal<ThemeVariant | undefined>('tonal-spot')
);

export const ColorContext: Context<Signal<string | undefined>> = createContext(createSignal<string>());
