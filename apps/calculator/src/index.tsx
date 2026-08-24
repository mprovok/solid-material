import '@fontsource/google-sans-flex/latin-400.css';
import type { ParentComponent, Signal } from 'solid-js';

import { makePersisted } from '@solid-primitives/storage';
import { Route, Router } from '@solidjs/router';
import { MaterialSkeletonManager } from '@solidmaterial/material/components/skeleton';
import { MaterialTheme, ThemeColorMode } from '@solidmaterial/material/styling';
import { enableViewTransitions } from '@solidmaterial/material/utils';
import { createEffect, createSignal } from 'solid-js';
import { render } from 'solid-js/web';

import { ThemeBlackContext, ThemeColorModeContext } from './contexts';

import './index.css';
import RouteHome from './routes';
import RouteSettings from './routes/settings';

const RootLayout: ParentComponent = props => {
  enableViewTransitions();

  const [mode, setMode] = makePersisted<ThemeColorMode, Signal<ThemeColorMode>>(
    createSignal<ThemeColorMode>(ThemeColorMode.SYSTEM),
    {
      name: 'theme-color-mode'
    }
  );
  const [isBlack, setBlack] = makePersisted<boolean, Signal<boolean>>(createSignal(false), { name: 'theme-use-black' });

  createEffect(() => {
    if (isBlack()) {
      globalThis.document.documentElement.dataset['black'] = '';
    } else {
      delete globalThis.document.documentElement.dataset['black'];
    }
  });

  return (
    <MaterialTheme theme="tonal-spot" mode={mode()}>
      <ThemeColorModeContext.Provider value={[mode, setMode]}>
        <ThemeBlackContext.Provider value={[isBlack, setBlack]}>
          <MaterialSkeletonManager>{props.children}</MaterialSkeletonManager>
        </ThemeBlackContext.Provider>
      </ThemeColorModeContext.Provider>
    </MaterialTheme>
  );
};

const root = document.querySelector('#root');

render(
  () => (
    <Router root={RootLayout} base="/calculator">
      <Route path="/" component={RouteHome} />
      <Route path="/settings" component={RouteSettings} />
    </Router>
  ),
  root!
);
