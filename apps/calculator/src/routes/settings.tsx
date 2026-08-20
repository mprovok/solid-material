import type { MaterialIconSvg } from '@solidmaterial/material/components/icon';
import type { Component, VoidComponent } from 'solid-js';

import { MetaProvider, Title } from '@solidjs/meta';
import { useNavigate } from '@solidjs/router';
import { MaterialAppBar } from '@solidmaterial/material/components/app-bar';
import { MaterialButton } from '@solidmaterial/material/components/button';
import { MaterialDialog } from '@solidmaterial/material/components/dialog';
import { MaterialIcon } from '@solidmaterial/material/components/icon';
import { MaterialList, MaterialListItem } from '@solidmaterial/material/components/list';
import { MaterialRadio } from '@solidmaterial/material/components/radio';
import { MaterialSwitch } from '@solidmaterial/material/components/switch';
import { H2 } from '@solidmaterial/material/components/typography';
import { MaterialBodyLayout, MaterialPane } from '@solidmaterial/material/layouts';
import { ThemeColorMode } from '@solidmaterial/material/styling';
import { Index, createSignal, createUniqueId, useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { ThemeBlackContext, ThemeColorModeContext } from '../contexts';

import styles from './settings.module.css';

import BrightnessMediumIcon from '@solidmaterial/icons/400/outlined/brightness_medium.svg';
import DarkModeIcon from '@solidmaterial/icons/400/outlined/dark_mode.svg';
import LightModeIcon from '@solidmaterial/icons/400/outlined/light_mode.svg';

export const THEME_ICON: Record<ThemeColorMode, MaterialIconSvg> = {
  [ThemeColorMode.SYSTEM]: BrightnessMediumIcon,
  [ThemeColorMode.LIGHT]: LightModeIcon,
  [ThemeColorMode.DARK]: DarkModeIcon
};

const THEME_LABEL: Record<ThemeColorMode, string> = {
  [ThemeColorMode.SYSTEM]: 'Automatic',
  [ThemeColorMode.LIGHT]: 'Light',
  [ThemeColorMode.DARK]: 'Dark'
};

interface RadioButtonThemeProps {
  mode: ThemeColorMode;
  isChecked: boolean;
  onChange: () => void;
}

const RadioButtonTheme: VoidComponent<RadioButtonThemeProps> = props => {
  const id = createUniqueId();

  return (
    <div class={styles['radio-button']}>
      <MaterialRadio name={THEME_LABEL[props.mode]} id={id} checked={props.isChecked} onChange={props.onChange} />
      <label for={id}>{THEME_LABEL[props.mode]}</label>
    </div>
  );
};

const RouteSettings: Component = () => {
  const navigate = useNavigate();
  const navigateBack = () => navigate(-1);

  const [themeColorMode, setThemeColorMode] = useContext(ThemeColorModeContext);
  const [isBlackTheme, setBlackTheme] = useContext(ThemeBlackContext);

  const [openDialog, setOpenDialog] = createSignal(false);

  const onClickTheme = () => setOpenDialog(true);
  const onCloseTheme = () => setOpenDialog(false);

  return (
    <>
      <MetaProvider>
        <Title>Settings</Title>
      </MetaProvider>
      <MaterialDialog
        title="Theme"
        actions={[
          <MaterialButton variant="text" onClick={onCloseTheme}>
            Cancel
          </MaterialButton>
        ]}
        open={openDialog()}
        onClose={onCloseTheme}
      >
        <Index each={[ThemeColorMode.SYSTEM, ThemeColorMode.LIGHT, ThemeColorMode.DARK] satisfies ThemeColorMode[]}>
          {mode => (
            <RadioButtonTheme
              mode={mode()}
              isChecked={themeColorMode() === mode()}
              onChange={() => {
                setThemeColorMode(mode());
                onCloseTheme();
              }}
            />
          )}
        </Index>
      </MaterialDialog>
      <MaterialBodyLayout variant="flexible-fixed">
        <MaterialPane>
          <MaterialAppBar variant="small" title="Settings" leadingButtonAriaLabel="Go back" onNavigate={navigateBack} />
          <main class={styles['main']}>
            <H2 role="title" size="small">
              Theme
            </H2>
            <MaterialList segmented={true} ariaLabel="Theme">
              <MaterialListItem
                start={
                  <MaterialIcon>
                    <Dynamic component={THEME_ICON[themeColorMode()]} />
                  </MaterialIcon>
                }
                supportingText={THEME_LABEL[themeColorMode()]}
                onClick={onClickTheme}
              >
                Theme
              </MaterialListItem>
              <MaterialListItem
                end={<MaterialSwitch selected={isBlackTheme()} ariaLabel="Black theme" onChange={setBlackTheme} />}
                supportingText="Use a pure black theme"
                onClick={() => setBlackTheme(value => !value)}
              >
                Black theme
              </MaterialListItem>
            </MaterialList>
          </main>
        </MaterialPane>
      </MaterialBodyLayout>
    </>
  );
};

// oxlint-disable-next-line import/no-default-export
export default RouteSettings;
