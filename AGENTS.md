# AGENTS.md

pnpm + Turborepo monorepo for **Solid Material** — Material 3 Expressive components for SolidJS. Node >= 22, pnpm 11 (enforced via `engineStrict`).

## Layout

- `packages/material` — the published component library (`@solidmaterial/material`). Components in `src/components/*/`, plus `layouts/`, `styling/`, `utils/`.
- `packages/icons` — Material Symbols SVGs, published as raw `.svg` files. Regenerate with `pnpm --filter @solidmaterial/icons download:svg` (only weight 400 is published).
- `packages/vite-plugin-solid-svg` — Vite plugin to import those SVGs as Solid components.
- `apps/landing-page`, `apps/calculator` — private demo apps; the landing page hosts docs/Storybook. `apps/hero` is only for the README screenshot (no tests, no build).
- `scripts/` — repo-level scripts, including the custom commit-message linter (has its own tests: `pnpm scripts:test`).

**In-repo, `@solidmaterial/material` is consumed directly from `src/`** (package `exports` point at source; `publishConfig` swaps in `dist/` only when publishing). You do NOT need to build packages before running apps, tests, or Storybook.

## Commands

```bash
pnpm install            # required after pulling; verifyDepsBeforeRun=error blocks scripts on stale deps
pnpm install:webkit     # one-time: tests default to WebKit; run install:chromium if you use test:chromium
pnpm dev                # landing-page dev server
pnpm storybook          # Storybook (port 6006, packages/material)
pnpm lint               # oxlint (type-aware) across packages
pnpm lint:fix           # per package, e.g. pnpm --filter @solidmaterial/material lint:fix
pnpm format             # oxfmt (NOT prettier); format:check runs in CI and pre-commit
pnpm test               # browser tests must not run in parallel
pnpm site:build         # full site: build + storybook build + copies storybook & calculator into landing-page/dist
```

CI (`ci.yml`) uses turbo `--affected` for build/lint/test — scope changes accordingly. `pnpm format:check` is NOT affected-filtered; it always runs on everything.

## Testing

All component/app tests run in real browsers via vitest browser mode + Playwright, not jsdom/happy-dom.

- Default (`pnpm test`) runs **WebKit** (material's `test` = `test:webkit`). Chromium is opt-in: `pnpm --filter @solidmaterial/material test:chromium`.
- `packages/material` has three vitest projects:
  - `components` — `src/**/*.test.{ts,tsx}`
  - `visual` — screenshot tests matching `*.vrt.test.{ts,tsx}`, 5% pixel mismatch tolerance, retries disabled
  - `storybook` — runs the Storybook stories (spawns its own Storybook dev server)
- Run one file/project:

```bash
pnpm --filter @solidmaterial/material exec vitest run --project components src/components/button/
pnpm --filter @solidmaterial/material exec vitest run --project visual src/components/button/MaterialButton.vrt.test.tsx
```

- Tests use a custom locator `getByElement(tag)` (see `packages/material/vitest.setup.ts`); testing-library cleanup is automatic.
- Coverage is istanbul; uploads go to Codecov, which excludes `packages/icons/icons`.

## Conventions

- **Formatter is oxfmt**: single quotes, no trailing comma, `arrowParens: avoid`, width 120, import sorting configured in `.oxfmtrc.json` (`@solidmaterial/icons/**` imports sort last). Don't hand-format; run `pnpm format`.
- oxlint is strict (correctness/restriction = error) and type-aware. Notable: `max-lines` 1000, `max-params` 4, kebab-case or PascalCase filenames, no duplicate imports (separate type imports allowed). Disables must be justified — `--report-unused-disable-directives` is on.
- **Commit messages** are enforced by `scripts/lint-git-commit-msg.mts`: conventional format `<type>[(<scope>)][!]: <desc>`, subject <= 72 chars, body lines <= 79. Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert. **Scope must be a directory name under `apps/` or `packages/`** (e.g. `material`, `icons`, `landing-page`, `vite-plugin-solid-svg`). Description starts lowercase, no trailing period, blank line before body.

## Dependency & release rules

- Version numbers are exact (no `^`), managed via `catalog:` in `pnpm-workspace.yaml`. Keep shared deps (solid, vite, vitest, storybook, tsdown) in the catalog rather than pinning per package. `strictPeerDependencies` is on; `minimumReleaseAge` blocks brand-new releases.
- Releases: record intent with `pnpm change` (interactive; writes a new file in `.changeset/`). It emits package names with double quotes, which fail `format:check` — convert them to single quotes before committing: `pnpm format .changeset/<file>.md` targets only the new file (a full `pnpm format` also works but reformats everything in reach). Publishing happens in `publish.yml` on `vX.Y.Z` tags from `main` via `pnpm stage publish -r`; `ledger.yaml` records which intents shipped in which version. Private apps get version bumps through the same flow.

## Other gotchas

- The library deliberately uses modern CSS (scroll-driven animations, anchor positioning) with baseline-2025 targets (Chrome 131+, Safari 26.2). Don't add polyfills or fallbacks for older browsers.
- Some components are thin bindings around `@material/web` web components (ripple, focus ring, form controls) — check whether a component wraps a web component before changing its DOM/API assumptions.
- `turbo.json` marks `dev`, `storybook`, and `preview` as persistent/interactive — run them from the root (`pnpm dev`, `pnpm storybook`) rather than as background build steps.
