import type { RouterInstance } from '@solidjs/router';
import type { Component } from 'solid-js';

import { createRouter } from '@solidjs/router';

import RouteHome from './routes/index';

export const Router: RouterInstance<
  readonly [
    {
      readonly path: '/';
      readonly component: Component;
    }
  ]
> = createRouter({
  routes: [{ path: '/', component: RouteHome }]
});
