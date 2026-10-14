import '@fontsource/google-sans-flex/latin-400.css';
import '@fontsource/google-sans-flex/latin-500.css';
import type { ParentComponent } from 'solid-js';

import { Route, Router } from '@solidjs/router';
import { MaterialTheme } from '@solidmaterial/material/styling';
import { render } from 'solid-js/web';

import './index.css';

import { NavigationLayout } from './NavigationLayout';
import RouteHome from './routes';

const RootLayout: ParentComponent = props => {
  return (
    <MaterialTheme>
      <NavigationLayout>{props.children}</NavigationLayout>
    </MaterialTheme>
  );
};

const root = document.querySelector('#root');

render(
  () => (
    <Router root={RootLayout}>
      <Route path="/" component={RouteHome} />
    </Router>
  ),
  root!
);
