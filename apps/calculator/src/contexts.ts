import type { Context, Signal } from 'solid-js';

import { ThemeColorMode } from '@solidmaterial/material/styling';
import { createContext, createSignal } from 'solid-js';

export const ThemeColorModeContext: Context<Signal<ThemeColorMode>> = createContext(
  createSignal(ThemeColorMode.SYSTEM)
);

export const ThemeBlackContext: Context<Signal<boolean>> = createContext(createSignal(false));

export const VibrateContext: Context<Signal<boolean>> = createContext(createSignal(true));
