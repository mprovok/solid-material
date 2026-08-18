import type { MaterialIconSvg } from '@solid-material/material/components/icon';
import type { VoidComponent } from 'solid-js';

import { MaterialButtonGroup } from '@solid-material/material/components/button-group';
import { MaterialIconButton } from '@solid-material/material/components/icon-button';
import { MaterialToolbar } from '@solid-material/material/components/toolbar';
import { ThemeColorMode } from '@solid-material/material/styling';
import { Index, useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { ThemeColorModeContext } from '../../../contexts';

import { SettingsColorButtons } from './SettingsColorButtons';

import BrightnessMediumFillIcon from '@solid-material/icons/400/outlined/brightness_medium-fill.svg';
import BrightnessMediumIcon from '@solid-material/icons/400/outlined/brightness_medium.svg';
import DarkModeFillIcon from '@solid-material/icons/400/outlined/dark_mode-fill.svg';
import DarkModeIcon from '@solid-material/icons/400/outlined/dark_mode.svg';
import LightModeFillIcon from '@solid-material/icons/400/outlined/light_mode-fill.svg';
import LightModeIcon from '@solid-material/icons/400/outlined/light_mode.svg';

export interface SettingsToolbarProps {
  open: boolean;
}

export const LIGHT_DARK_MODE_ICONS: Record<ThemeColorMode, [MaterialIconSvg, MaterialIconSvg]> = {
  [ThemeColorMode.SYSTEM]: [BrightnessMediumFillIcon, BrightnessMediumIcon],
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
