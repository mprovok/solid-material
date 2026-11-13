# AGENTS.md

pnpm + Turborepo monorepo for **Solid Material** — Material 3 Expressive components for SolidJS.
Node >= 22, pnpm 11 (enforced via `engineStrict`).

## Layout

```
.
├── apps/
│   ├── calculator/             # private demo app
│   ├── hero/                   # README screenshot only (no tests, no build)
│   └── landing-page/           # private demo app; hosts docs/Storybook
├── packages/
│   ├── icons/                  # Material Symbols SVGs, published as raw .svg files
│   │                           #   (weight 400 only; regenerate: pnpm --filter @solidmaterial/icons download:svg)
│   ├── material/               # @solidmaterial/material — the published component library
│   │                           #   (src/components/*/ plus layouts/, styling/, utils/)
│   └── vite-plugin-solid-svg/  # Vite plugin to import those SVGs as Solid components
└── scripts/                    # repo-level scripts, incl. the commit-message linter
                                #   (has its own tests: pnpm scripts:test)
```

**In-repo, `@solidmaterial/material` is consumed directly from `src/`** (package `exports` point at source; `publishConfig` swaps in `dist/` only when publishing). You do NOT need to build packages before running apps, tests, or Storybook.

## Commands

```bash
pnpm install            # required after pulling; verifyDepsBeforeRun=error blocks scripts on stale deps
pnpm install:chromium   # one-time: install the Chromium test browser
pnpm install:webkit     # one-time: install the WebKit test browser
pnpm dev                # landing-page dev server on port 4000 (persistent, never a background build step)
pnpm storybook          # Storybook for packages/material on port 6006 (persistent, never a background build step)
pnpm preview            # landing-page production build on port 4000 (persistent, never a background build step)
pnpm lint               # oxlint (type-aware) across packages
pnpm --filter @solidmaterial/material lint:fix   # oxlint --fix (per package; there is no root lint:fix script)
pnpm format             # oxfmt (NOT prettier); format:check runs in CI and pre-commit
pnpm test               # all browser tests via turbo (serialized)
pnpm test:update        # regenerate VRT baselines (Chromium on Linux, matching CI)
pnpm site:build         # full site: build + storybook build + copies storybook & calculator into landing-page/dist
```

CI (`ci.yml`) uses turbo `--affected` for build/lint/test — scope changes accordingly.
`pnpm format:check` is NOT affected-filtered; it always runs on everything.

## Testing

All component/app tests run in real browsers via Vitest Browser Mode + Playwright, not jsdom/happy-dom.
Every test run is a combination of:

- **Browser**: `chromium` or `webkit`; install the binary (`pnpm install:chromium` / `pnpm install:webkit`).
- **Project** (in `packages/material`):
  - `components` (interaction and a11y tests)
  - `visual` (screenshot-based visual regression tests)
  - `storybook` (Storybook stories)
- **Scope**: the whole repo, one package, one folder, or a single file.

Before running tests, ask the user which browser to use if you do not know which one they prefer;
a subagent cannot ask, so pass the choice down. Never run browser test projects in parallel.

Consult the `run-tests` skill before running any tests: it defines the exact commands
(browser selection, scoped runs) and VRT baseline handling.
Writing test files: see the `write-tests` skill.

## Conventions

- **Formatter is oxfmt**: Don't hand-format; run `pnpm format`.
  - Single quotes, no trailing comma, `arrowParens: avoid`, width 120
  - Import sorting configured in `.oxfmtrc.json` (`@solidmaterial/icons/**` imports sort last)
- **Linter is oxlint**: strict (correctness/restriction = error) and type-aware (There is no need to run `tsc --noEmit`).
  - Notable: `max-lines` 1000, `max-params` 4
  - PascalCase filenames for components, kebab-case for everything else
  - No duplicate imports (separate type imports allowed)
  - Disables must be justified (`--report-unused-disable-directives` is on)
- **Commit messages** are enforced by `scripts/lint-git-commit-msg.mts`:
  - Conventional format `<type>[(<scope>)][!]: <desc>`, subject <= 72 chars, body lines <= 79
  - Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
  - **Scope must be a directory name under `apps/` or `packages/`** (e.g. `material`, `icons`, `landing-page`, `vite-plugin-solid-svg`)
  - Description starts lowercase, no trailing period, blank line before body.
  - For agent-authored commits, ask whether to add an `Assisted-by:` trailer (ask which name to credit, suggest the model you run as)

## Dependency & release rules

- Never automatically stage changes using git, unless asked by the user.
- **Committing**: before committing, decide whether release intents are
  needed. Record them first via the changeset flow (in OpenCode, the
  `changeset` subagent, which follows the `changeset-intent` skill; the
  `/commit` command chains this with the commit itself) when the diff touches
  files that end up in a production build of a published package:
  `packages/material/src/**` except `*.test.*`/`*.stories.*` (the build config
  excludes them), component CSS modules, package manifests, `packages/icons`
  SVGs, and `vite-plugin-solid-svg` source. A changed private app also needs
  intents. Tests, stories, docs, CI, and agent config do not.
- Version numbers are exact (no `^`), managed via `catalog:` in `pnpm-workspace.yaml`.
  Keep shared deps (solid, vite, vitest, storybook, tsdown) in the catalog rather than pinning per package.
  `strictPeerDependencies` is on; `minimumReleaseAge` blocks brand-new releases.
- **Releases**: intents are recorded in `.changeset/` via the `changeset-intent` skill
  (in OpenCode: the `changeset` subagent; `/commit` chains it), including the targeted `pnpm format` fix it requires.
  Publishing happens in `publish.yml` on `vX.Y.Z` tags from `main` via `pnpm stage publish -r`;
  `ledger.yaml` records which intents shipped in which version. Private apps get version bumps through the same flow.

## Other gotchas

- The library deliberately uses modern CSS (scroll-driven animations, anchor positioning) with baseline-2025 targets (Chrome 131, Safari 26.2). Don't add polyfills or fallbacks for older browsers.
- Some components are thin bindings around `@material/web` web components (ripple, focus ring, form controls) — check whether a component wraps a web component before changing its DOM/API assumptions.
