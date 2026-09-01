import type { ThemeColorMode } from '@solidmaterial/material/styling';
import type { Context, Signal } from 'solid-js';

import { createContext, createSignal } from 'solid-js';

export const ThemeColorModeContext: Context<Signal<ThemeColorMode>> = createContext();

export const ThemeBlackContext: Context<Signal<boolean>> = createContext(createSignal(false));

export const VibrateContext: Context<Signal<boolean>> = createContext(createSignal(true));

export const ExpandContext: Context<Signal<boolean>> = createContext(createSignal(false));
