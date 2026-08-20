import type { MaterialIconSvg } from '@solidmaterial/material/components/icon';
import type { VoidComponent } from 'solid-js';

import { MaterialButtonGroup } from '@solidmaterial/material/components/button-group';
import { MaterialIconButton } from '@solidmaterial/material/components/icon-button';
import { MaterialToolbar } from '@solidmaterial/material/components/toolbar';
import { ThemeColorMode } from '@solidmaterial/material/styling';
import { Index, useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';

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
        <Index each={[ThemeColorMode.SYSTEM, ThemeColorMode.LIGHT, ThemeColorMode.DARK] satisfies ThemeColorMode[]}>
          {mode => (
            <MaterialIconButton
              variant="filled"
              shape="round"
              icon={<Dynamic component={LIGHT_DARK_MODE_ICONS[mode()][themeColorMode() === mode() ? 1 : 0]} />}
              toggle={themeColorMode() === mode()}
              title={LIGHT_DARK_MODE_TITLES[mode()]}
              onClick={() => setThemeColorMode(mode)}
            />
          )}
        </Index>
      </MaterialButtonGroup>
      <SettingsColorButtons />
    </MaterialToolbar>
  );
};
