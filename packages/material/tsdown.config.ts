import type { transformAsync } from '@solidjs/compiler';
import type { TsdownPlugin, UserConfig } from 'tsdown';

// oxlint-disable-next-line import/no-nodejs-modules
import { createRequire } from 'node:module';
import { defineConfig } from 'tsdown';

// @solidjs/compiler ships a native (CJS) binding, so it must be loaded with
// require, which the config bundler leaves external instead of inlining.
const require = createRequire(import.meta.url) as (id: string) => { transformAsync: typeof transformAsync };
const { transformAsync: compileSolid } = require('@solidjs/compiler');

/**
 * Compiles Solid JSX (DOM variant) during the build, so the published
 * `dist/*.js` contains plain JavaScript instead of untranspiled JSX:
 * neither Vite's dependency optimizer nor the Solid vite plugin's dev
 * pipeline compiles JSX shipped inside `.js` files, so consumers of the
 * npm package otherwise cannot load the components. SSR and SSG instead
 * resolve the `solid` exports condition, which serves types-stripped JSX
 * for the consumer's own plugin to compile.
 *
 * The output is compiled in production mode (`dev: false`): the development
 * entry of `@solidjs/web` is a superset of the production one, so this
 * works for both development and production consumers.
 */
const solidJsx = (): TsdownPlugin => ({
  name: 'solid-jsx',
  transform: {
    filter: { id: /\.tsx$/u },
    async handler(code, id) {
      const result = await compileSolid(code, {
        filename: id,
        generate: 'dom',
        hydratable: false,
        dev: false,
        sourceMap: true
      });
      // A null map tells rolldown to preserve the incoming sourcemap.
      // oxlint-disable-next-line unicorn/no-null
      return { code: result.code, map: result.map ?? null };
    }
  }
});

/**
 * Builds one dist tree with both distribution variants: the DOM build emits
 * compiled components, declarations, and processed CSS; the JSX build
 * re-emits the same graph as types-stripped `.jsx` for the consumer's Solid
 * vite plugin to compile. The JSX build externalizes its CSS-module imports
 * and copies the raw stylesheets to their source-relative paths, because
 * sharing the CSS pipeline between both builds does not work: their
 * class-name scoping differs and the CSS-module modules are emitted
 * differently, so the trees cannot share the compiled stylesheets.
 */
const generateConfig = (jsx: boolean): UserConfig => ({
  entry: ['src/components/*/index.ts', 'src/layouts/index.ts', 'src/utils/index.ts', 'src/styling/index.ts'],
  outDir: 'dist',
  target: 'esnext',
  platform: 'browser',
  sourcemap: true,
  unbundle: true,
  css: jsx ? false : { inject: true, splitting: true, target: ['chrome131', 'safari26.2'] },
  ...(jsx
    ? {
        dts: false,
        outExtensions: () => ({ js: '.jsx' }),
        // The `.jsx` files keep their CSS-module imports raw: they are
        // externalized so rolldown leaves the specifiers untouched, and the
        // stylesheets are copied at their source-relative paths so the
        // relative imports resolve inside the package. Only module
        // stylesheets and the plain `index.css` aggregate are copied: every
        // other plain stylesheet is imported by the graph itself, so the DOM
        // build always emits the compiled form, and copying it would race
        // that emission into nondeterministic dist output. Their compiled
        // forms still resolve the `.jsx` side-effect imports.
        inputOptions: { external: [/\.css$/u] },
        copy: { from: ['src/**/*.module.css', 'src/styling/index.css', '!src/**/*.stories.module.css'], flatten: false }
      }
    : {
        // The compiled declarations are identical for both variants, so
        // they are emitted once by the DOM build and shared via the package
        // exports. `dts` must stay explicit: tsdown auto-enables it per
        // config when unset (the package exports carry `types` conditions),
        // which would emit the declarations from the solution tsconfig
        // and fail.
        dts: { sourcemap: true, tsconfig: 'tsconfig.build.json' },
        plugins: [solidJsx()]
      })
});

// oxlint-disable-next-line import/no-default-export
export default defineConfig([generateConfig(false), generateConfig(true)]);
