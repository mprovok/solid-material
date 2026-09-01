import '@fontsource/google-sans-flex/latin-400.css';
import '@fontsource/google-sans-flex/latin-500.css';
import type { ParentComponent } from 'solid-js';

import { Link } from '@solidjs/meta';
import { render } from '@solidjs/web';
import { MaterialSkeletonManager } from '@solidmaterial/material/components/skeleton';
import { MaterialTheme } from '@solidmaterial/material/styling';
import { enableViewTransitions } from '@solidmaterial/material/utils';
import { createSignal } from 'solid-js';

import type { ThemeVariant } from '../../../packages/material/src/styling/material-theme/MaterialTheme';

import { ThemeColorMode } from '../../../packages/material/src/styling/material-theme/MaterialTheme';

import { ColorContext, ThemeColorModeContext, ThemeVariantContext } from './contexts';
import { NavigationLayout } from './NavigationLayout';

import './index.css';

import { Router } from './router';

import totalDissolvedSolidsIcon from '@solidmaterial/icons/400/outlined/total_dissolved_solids.svg?raw';

const RootLayout: ParentComponent = props => {
  enableViewTransitions();

  const [mode, setMode] = createSignal(ThemeColorMode.SYSTEM);
  const [color, setColor] = createSignal<string>();
  const [theme, setTheme] = createSignal<ThemeVariant | undefined>('tonal-spot');

  return (
    <MaterialTheme theme={theme()} color={color()} mode={mode()}>
      <ThemeColorModeContext value={[mode, setMode]}>
        <ThemeVariantContext value={[theme, setTheme]}>
          <ColorContext value={[color, setColor]}>
            <MaterialSkeletonManager>
              <Link rel="icon" href={`data:image/svg+xml;utf8,${totalDissolvedSolidsIcon}`} />
              <NavigationLayout>{props.children}</NavigationLayout>
            </MaterialSkeletonManager>
          </ColorContext>
        </ThemeVariantContext>
      </ThemeColorModeContext>
    </MaterialTheme>
  );
};

const root = document.querySelector('#root');

render(() => <Router>{props => <RootLayout {...props} />}</Router>, root!);
