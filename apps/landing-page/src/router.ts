import type { PathEnd, RouteComponent, RouterInstance } from '@solidjs/router';
import type { Component } from 'solid-js';

import { createRouter } from '@solidjs/router';
import { lazy } from 'solid-js';

import RouteGetStarted from './routes/get-started';
import RouteHome from './routes/index';

type LazyComponent = RouteComponent<PathEnd> & {
  preload: () => Promise<{ default: unknown }>;
};

const LazyPageComponents: LazyComponent = lazy(async () => import('./routes/components/[[name]]'));
const LazyPageExamples: LazyComponent = lazy(async () => import('./routes/examples/[[name]]'));

export const Router: RouterInstance<
  readonly [
    {
      readonly path: '/';
      readonly component: Component;
    },
    {
      readonly path: '/get-started';
      readonly component: Component;
    },
    {
      readonly path: '/components/:name?';
      readonly component: RouteComponent<PathEnd>;
    },
    {
      readonly path: '/examples/:name?';
      readonly component: RouteComponent<PathEnd>;
    },
    {
      readonly path: '*404';
      readonly component: Component;
    }
  ]
> = createRouter({
  routes: [
    { path: '/', component: RouteHome },
    { path: '/get-started', component: RouteGetStarted },
    { path: '/components/:name?', component: LazyPageComponents },
    { path: '/examples/:name?', component: LazyPageExamples },
    { path: '*404', component: RouteHome }
  ]
});
