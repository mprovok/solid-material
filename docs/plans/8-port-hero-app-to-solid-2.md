# Port hero app to Solid 2 and fix its lint errors

## Summary

The monorepo catalog was upgraded to Solid 2 (`solid-js 2.0.0-rc.21`, commit `25e9e763 feat!: upgrade to Solid 2`) and `apps/calculator` and `apps/landing-page` were migrated, but `apps/hero` was missed. It still uses Solid 1 entry-point and router APIs, which now fail lint/type-checking. Port the hero app to the same patterns the other apps use and make `pnpm --filter @solidmaterial/hero lint` pass.

## Current state

- Catalog versions in `pnpm-workspace.yaml`: `solid-js 2.0.0-rc.21`, `@solidjs/web 2.0.0-rc.21`, `@solidjs/router 2.0.0-next.44` (group `solid`).
- `apps/hero/package.json` depends on `solid-js` and `@solidjs/router` via `catalog:solid` but is **missing `@solidjs/web`** (compare `apps/calculator/package.json`, which has `"@solidjs/web": "catalog:solid"`).
- `apps/hero/src/index.tsx`:
  - imports `render` from `solid-js/web` — in Solid 2 `render` lives in `@solidjs/web` (see `apps/calculator/src/index.tsx` and `apps/landing-page/src/index.tsx`).
  - uses the Solid 1 router JSX API: `<Router root={RootLayout}><Route path="/" component={RouteHome} /></Router>`.
- Ported apps use the Solid 2 router API instead:
  - `apps/calculator/src/router.ts` / `apps/landing-page/src/router.ts`: `createRouter({ routes })` returning a `RouterInstance`, typed with `RouteComponent`/`PathEnd` from `@solidjs/router`.
  - Entry: `render(() => <Router>{props => <RootLayout {...props} />}</Router>, root!)` (`apps/calculator/src/index.tsx`, `apps/calculator/src/App.tsx`).
- The rest of the hero source still uses Solid 1 APIs that no longer exist in Solid 2. Current lint output (captured): **50 errors / 26 warnings across 7 files**:
  - `src/components/examples/ExampleList.tsx` and `src/components/examples/ExampleConnectedButtonGroup.tsx`: `import { Index } from 'solid-js'` + `<Index each>` — `Index` was removed (`TS2305`); the Solid 2 replacement is `<For keyed={false}>` (solid-js CHEATSHEET line 728; typed in `solid-js/types/client/flow.d.ts` as `children: (item: Accessor<T[number]>, index: number)`). Both hero call sites only use the plain numeric `index` (never the item), so the callback bodies stay unchanged — only the import and the tag change.
  - `src/routes/index.tsx`: `onMount` — removed (`TS2305`); replacement is `onSettled` (CHEATSHEET: "`onMount` → `onSettled`").
  - `src/components/examples/ExampleSearchBar.tsx`: passes `input={searchInput}` (an accessor) and a `setInput` prop to `MaterialSearchBar`, but material's API is `input: string` (a plain initial value) and there is **no `setInput` prop** (`packages/material/src/components/search/MaterialSearchBar.tsx`, `MaterialSearchBarProps`); `shouldOpen` is required and `MaterialSearch` has no `open` prop. Fix: remove the unused hero-side signal, pass `input=""` + `shouldOpen={() => false}`, and drop the invalid `open={false}` — matching `apps/landing-page/src/pages/home/sections/hero/components/examples/ExampleSearchBar.tsx` verbatim.
  - Everything else (`NavigationLayout.tsx`, `logo/Logo.tsx`, `components/examples/ExampleSplitButtonMenu.tsx`, and the `TS2322`/`no-unsafe-*` hits on material components) is fallout from `@solidjs/web` types being unresolvable; it should clear once Step 1 adds the dependency.
- No `<Dynamic>` usages exist in `apps/hero/src` (the `dynamic` factory migration in commits `b74a801c`/`6a3a3203`/`ff9d6398` did not touch hero).
- Hero app source files: `apps/hero/src/index.tsx`, `apps/hero/src/NavigationLayout.tsx`, `apps/hero/src/routes/index.tsx`, `apps/hero/src/routes/index.module.css`, `apps/hero/src/components/examples/*.tsx`, `apps/hero/src/logo/Logo.tsx`, `apps/hero/src/logo/Logo.module.css`.
- Hero has lint scripts but no build/test scripts (`apps/hero/package.json`); there are no tests for this app.

## Task breakdown

> All code-editing steps below write Solid 2.0: before generating or changing code, read the skills bundled with the `solid-js` package at `apps/hero/node_modules/solid-js/skills/solid-2.0/SKILL.md` (primer; read first) and `apps/hero/node_modules/solid-js/skills/solid-2.0-cheatsheet/SKILL.md` (signature lookup and the removed-1.x-API list). These are plain markdown files, not harness-loadable skills, and the cheatsheet does not cover `@solidjs/router` — for `createRouter`, `apps/calculator/src/router.ts` remains the reference.

- [x] Step 1: Add `"@solidjs/web": "catalog:solid"` to the hero app dependencies and install so the lockfile is updated (`apps/hero/package.json`, `pnpm-lock.yaml`)
- [x] Step 2: Create `apps/hero/src/router.ts` exporting a `RouterInstance` built with `createRouter({ routes: [{ path: '/', component: RouteHome }] })`, typed like `apps/calculator/src/router.ts` (`apps/hero/src/router.ts`)
- [x] Step 3: Rewrite the hero entry point to import `render` from `@solidjs/web`, keep `RootLayout` as a `ParentComponent` wrapping `MaterialTheme` and `NavigationLayout`, and render `<Router>{props => <RootLayout {...props} />}</Router>`; delete the old `<Router root>`/`<Route>` JSX and unused imports (`apps/hero/src/index.tsx`); depends on Steps 1 and 2
- [x] Step 4: Replace the removed Solid 1 APIs in the remaining components: `<Index each>` → `<For each keyed={false}>` in `ExampleList.tsx` and `ExampleConnectedButtonGroup.tsx` — with `keyed={false}` the callback is `(item: Accessor, index: number)`, and both call sites only use the numeric `index`, so the bodies stay unchanged — `onMount` → `onSettled` for the snack shown on load in `routes/index.tsx`, and in `ExampleSearchBar.tsx` remove the unused hero-side signal and pass material's actual API: `input=""`, required `shouldOpen={() => false}`, and no `setInput`/`open` props (matching `apps/landing-page/src/pages/home/sections/hero/components/examples/ExampleSearchBar.tsx`) (`apps/hero/src/components/examples/ExampleList.tsx`, `apps/hero/src/components/examples/ExampleConnectedButtonGroup.tsx`, `apps/hero/src/routes/index.tsx`, `apps/hero/src/components/examples/ExampleSearchBar.tsx`); depends on Step 1
- [x] Step 5: Run `pnpm --filter @solidmaterial/hero lint` and fix every remaining error/warning — expected leftovers are only resolution fallout (`NavigationLayout.tsx`, `logo/Logo.tsx`, `ExampleSplitButtonMenu.tsx`, `TS2322`s on material components); fix hero-side by comparison against `apps/calculator/src` and `apps/landing-page/src` — then run `pnpm format` on the changed files (`apps/hero/src/**`); depends on Steps 3 and 4

## Acceptance criteria

- After Step 1: `apps/hero/package.json` lists `@solidjs/web` at `catalog:solid` and `pnpm install` succeeds.
- After Step 3: `apps/hero/src/index.tsx` no longer imports from `solid-js/web` or uses the `<Router root>`/`<Route>` JSX API; the entry point uses `render` from `@solidjs/web` and the `createRouter`-based `Router` from `apps/hero/src/router.ts` with a render-prop root layout, matching `apps/calculator/src/index.tsx`.
- After Step 4: no file under `apps/hero/src/` imports `Index` or `onMount` from `solid-js`, and `ExampleSearchBar.tsx` passes a plain string (`input=""`) with `shouldOpen={() => false}`, no `setInput` prop, and no `open` prop on `MaterialSearch`.
- After Step 5: `pnpm --filter @solidmaterial/hero lint` exits with 0 errors and 0 warnings (hero no longer fails the repo-wide `pnpm lint`); `pnpm format:check` passes.
- Whole-app check: `pnpm --filter @solidmaterial/hero exec vite build` succeeds, and `pnpm --filter @solidmaterial/hero dev` serves the home route showing the logo, search bar, carousel, card with examples, and the "Snackbar" snack.

## Risks and open questions

- The lint error inventory is known (50 errors / 26 warnings across 7 files, root-caused in "Current state"); Step 5's sweep should only encounter fallout-type errors, not surprises. Any error that does not match the expected patterns should be resolved by comparing against the ported apps, not by suppressing (`oxlint` requires justified disables).
- ~~The `setInput` prop shape of `MaterialSearchBar` needs verification during Step 4~~ Resolved during implementation: `MaterialSearchBarProps` has no `setInput` prop at all, `input` is a plain `string` initial value, `shouldOpen` is required, and `MaterialSearch` has no `open` prop — `ExampleSearchBar.tsx` was fixed to match the landing-page reference verbatim (signal removed, `input=""`, `shouldOpen={() => false}`).
- The hero app is the README screenshot source and has no test or build scripts, so verification is limited to lint, an ad-hoc `vite build`, and a manual `pnpm dev` smoke test. The orchestrator should decide whether the visual check happens in a browser or is deferred.
- The `MaterialNavigationLayout` API used by `apps/hero/src/NavigationLayout.tsx` (items, `menuButton`, `snackbarAlignment`) comes from the already-ported `packages/material`, so no changes are expected there; if the port surfaces type errors in hero's usage of material components, fix them on the hero side only.
