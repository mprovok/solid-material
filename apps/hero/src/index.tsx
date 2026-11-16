import '@fontsource/google-sans-flex/latin-400.css';
import '@fontsource/google-sans-flex/latin-500.css';
import type { ParentComponent } from 'solid-js';

import { render } from '@solidjs/web';
import { MaterialTheme } from '@solidmaterial/material/styling';

import './index.css';

import { NavigationLayout } from './NavigationLayout';
import { Router } from './router';

const RootLayout: ParentComponent = props => {
  return (
    <MaterialTheme>
      <NavigationLayout>{props.children}</NavigationLayout>
    </MaterialTheme>
  );
};

const root = document.querySelector('#root');

render(() => <Router>{props => <RootLayout {...props} />}</Router>, root!);
