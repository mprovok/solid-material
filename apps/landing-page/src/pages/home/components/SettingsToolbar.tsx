import type { MaterialIconSvg } from '@solidmaterial/material/components/icon';
import type { VoidComponent } from 'solid-js';

import { dynamic } from '@solidjs/web';
import { MaterialButtonGroup } from '@solidmaterial/material/components/button-group';
import { MaterialIconButton } from '@solidmaterial/material/components/icon-button';
import { MaterialToolbar } from '@solidmaterial/material/components/toolbar';
import { ThemeColorMode } from '@solidmaterial/material/styling';
import { For, useContext } from 'solid-js';

import { ThemeColorModeContext } from '../../../contexts';

import { SettingsColorButtons } from './SettingsColorButtons';

import BrightnessAutoFillIcon from '@solidmaterial/icons/400/outlined/brightness_auto-fill.svg';
import BrightnessAutoIcon from '@solidmaterial/icons/400/outlined/brightness_auto.svg';
import DarkModeFillIcon from '@solidmaterial/icons/400/outlined/dark_mode-fill.svg';
import DarkModeIcon from '@solidmaterial/icons/400/outlined/dark_mode.svg';
import LightModeFillIcon from '@solidmaterial/icons/400/outlined/light_mode-fill.svg';
import LightModeIcon from '@solidmaterial/icons/400/outlined/light_mode.svg';

export interface SettingsToolbarProps {
  open: boolean;
}

export const LIGHT_DARK_MODE_ICONS: Record<ThemeColorMode, [MaterialIconSvg, MaterialIconSvg]> = {
  [ThemeColorMode.SYSTEM]: [BrightnessAutoFillIcon, BrightnessAutoIcon],
  [ThemeColorMode.LIGHT]: [LightModeFillIcon, LightModeIcon],
  [ThemeColorMode.DARK]: [DarkModeFillIcon, DarkModeIcon]
};

const LIGHT_DARK_MODE_TITLES: Record<ThemeColorMode, string> = {
  [ThemeColorMode.SYSTEM]: 'System',
  [ThemeColorMode.LIGHT]: 'Light',
  [ThemeColorMode.DARK]: 'Dark'
};

export const SettingsToolbar: VoidComponent<SettingsToolbarProps> = props => {
  const [themeColorMode, setThemeColorMode] = useContext(ThemeColorModeContext);

  return (
    <MaterialToolbar show={props.open} direction="horizontal" mode="floating" color="vibrant">
      <MaterialButtonGroup variant="connected">
        <For
          each={[ThemeColorMode.SYSTEM, ThemeColorMode.LIGHT, ThemeColorMode.DARK] satisfies ThemeColorMode[]}
          keyed={false}
        >
          {mode => {
            const ModeIcon = dynamic(() => LIGHT_DARK_MODE_ICONS[mode()][themeColorMode() === mode() ? 1 : 0]);

            return (
              <MaterialIconButton
                variant="filled"
                shape="round"
                icon={<ModeIcon />}
                toggle={themeColorMode() === mode()}
                title={LIGHT_DARK_MODE_TITLES[mode()]}
                onClick={() => setThemeColorMode(mode)}
              />
            );
          }}
        </For>
      </MaterialButtonGroup>
      <SettingsColorButtons />
    </MaterialToolbar>
  );
};
