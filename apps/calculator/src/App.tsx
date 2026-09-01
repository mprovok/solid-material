import '@fontsource/google-sans-flex/latin-400.css';
import type { JSX } from '@solidjs/web';
import type { ParentComponent } from 'solid-js';

import { makePersisted } from '@solid-primitives/storage';
import { MaterialTheme, ThemeColorMode } from '@solidmaterial/material/styling';
import { enableViewTransitions } from '@solidmaterial/material/utils';
import { createEffect, createSignal } from 'solid-js';

import { ExpandContext, ThemeBlackContext, ThemeColorModeContext, VibrateContext } from './contexts';

import './index.css';
import { Router } from './router';

const RootLayout: ParentComponent = props => {
  enableViewTransitions();

  const [mode, setMode] = makePersisted(createSignal<ThemeColorMode>(ThemeColorMode.SYSTEM), {
    name: 'theme-color-mode'
  });
  const [isBlack, setBlack] = makePersisted(createSignal(false), { name: 'theme-use-black' });

  const [isVibrate, setVibrate] = makePersisted(createSignal(true), {
    name: 'behavior-vibrate'
  });

  const [isExpanded, setExpanded] = makePersisted(createSignal(false), {
    name: 'behavior-expand'
  });

  createEffect(
    () => isBlack(),
    useBlack => {
      if (useBlack) {
        globalThis.document.documentElement.dataset['black'] = '';
      } else {
        delete globalThis.document.documentElement.dataset['black'];
      }
    }
  );

  return (
    <MaterialTheme theme="tonal-spot" mode={mode()}>
      <ThemeColorModeContext value={[mode, setMode]}>
        <ThemeBlackContext value={[isBlack, setBlack]}>
          <VibrateContext value={[isVibrate, setVibrate]}>
            <ExpandContext value={[isExpanded, setExpanded]}>{props.children}</ExpandContext>
          </VibrateContext>
        </ThemeBlackContext>
      </ThemeColorModeContext>
    </MaterialTheme>
  );
};

// oxlint-disable-next-line import/no-default-export
export default function App(): JSX.Element {
  return <Router>{props => <RootLayout {...props} />}</Router>;
}
