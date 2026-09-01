import type { PathEnd, RouteComponent, RouterInstance } from '@solidjs/router';

import { createRouter } from '@solidjs/router';

import RouteAbout from './routes/about';
import RouteHome from './routes/index';
import RouteSettings from './routes/settings';

export const Router: RouterInstance<
  readonly [
    {
      readonly path: '/';
      readonly component: RouteComponent<
        PathEnd & {
          about: PathEnd;
        } & {
          settings: PathEnd;
        }
      >;
    },
    {
      readonly path: '/about';
      readonly component: RouteComponent<PathEnd>;
    },
    {
      readonly path: '/settings';
      readonly component: RouteComponent<PathEnd>;
    }
  ]
> = createRouter({
  routes: [
    { path: '/', component: RouteHome },
    { path: '/about', component: RouteAbout },
    { path: '/settings', component: RouteSettings }
  ],
  base: '/calculator'
});
