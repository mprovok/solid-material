import '@fontsource/google-sans-flex/latin-400.css';
import type { Component, ParentComponent } from 'solid-js';

import { MaterialSkeletonManager } from '@solid-material/material/components/skeleton';
import { MaterialTheme } from '@solid-material/material/styling';
import { enableViewTransitions } from '@solid-material/material/utils';
import { Link, MetaProvider } from '@solidjs/meta';
import { Route, Router } from '@solidjs/router';
import { createSignal, lazy } from 'solid-js';
import { render } from 'solid-js/web';

import type { ThemeVariant } from '../../../packages/material/src/styling/material-theme/MaterialTheme';

import { ThemeColorMode } from '../../../packages/material/src/styling/material-theme/MaterialTheme';

import { ColorContext, ThemeColorModeContext, ThemeVariantContext } from './contexts';
import { NavigationLayout } from './NavigationLayout';
import RouteHome from './routes';
import RouteGetStarted from './routes/get-started';

import './index.css';

import totalDissolvedSolidsIcon from '@solid-material/icons/400/outlined/total_dissolved_solids.svg?raw';

type LazyComponent = Component & {
  preload: () => Promise<{ default: Component }>;
};

const LazyPageComponents: LazyComponent = lazy(async () => import('./routes/components/[[name]]'));
const LazyPageExamples: LazyComponent = lazy(async () => import('./routes/examples/[[name]]'));

const RootLayout: ParentComponent = props => {
  enableViewTransitions();

  const [mode, setMode] = createSignal(ThemeColorMode.SYSTEM);
  const [color, setColor] = createSignal<string>();
  const [theme, setTheme] = createSignal<ThemeVariant | undefined>('tonal-spot');

  return (
    <MaterialTheme theme={theme()} color={color()} mode={mode()}>
      <ThemeColorModeContext.Provider value={[mode, setMode]}>
        <ThemeVariantContext.Provider value={[theme, setTheme]}>
          <ColorContext.Provider value={[color, setColor]}>
            <MaterialSkeletonManager>
              <MetaProvider>
                <Link rel="icon" href={`data:image/svg+xml;utf8,${totalDissolvedSolidsIcon}`} />
              </MetaProvider>
              <NavigationLayout>{props.children}</NavigationLayout>
            </MaterialSkeletonManager>
          </ColorContext.Provider>
        </ThemeVariantContext.Provider>
      </ThemeColorModeContext.Provider>
    </MaterialTheme>
  );
};

const root = document.querySelector('#root');

render(
  () => (
    <Router root={RootLayout}>
      <Route path="/" component={RouteHome} />
      <Route path="/components/:name?" component={LazyPageComponents} />
      <Route path="/examples/:name?" component={LazyPageExamples} />
      <Route path="/get-started" component={RouteGetStarted} />
      <Route path="*404" component={RouteHome} />
    </Router>
  ),
  root!
);
