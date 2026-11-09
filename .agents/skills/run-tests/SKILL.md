---
name: Run Tests
description: Run this repo's browser tests - browser install and selection (test:chromium / test:webkit), the three vitest projects, scoped run commands, and VRT baseline regeneration
---

# Running tests

All component/app tests run in real browsers via Vitest Browser Mode +
Playwright, never jsdom/happy-dom. Browser binaries are installed separately,
once:

```bash
pnpm install:chromium   # Chromium - the default test browser
pnpm install:webkit     # WebKit - only needed when running the WebKit instance
```

## Browsers

- Root `pnpm test` (turbo, serialized) runs everything; material's `test` =
  `test:chromium`, so the whole-repo default is **Chromium**.
- The material browser scripts are `test:chromium` and `test:webkit`
  (`pnpm --filter @solidmaterial/material test:chromium` / `…test:webkit`),
  used for full-suite and scoped runs (below). The apps only have `test`,
  pinned to Chromium in their vitest configs.
- Ask the user which browser to use if unknown; a subagent cannot ask, so the
  parent agent decides and passes the choice down.
- Never run browser test projects in parallel (root `pnpm test` enforces this
  via `--concurrency 1`).

## Vitest projects (`packages/material`)

- `components` - `src/**/*.test.{ts,tsx}` (interaction and a11y tests)
- `visual` - screenshot tests matching `*.vrt.test.{ts,tsx}`; retries are
  disabled and a 5% pixel mismatch is allowed, both configured centrally in
  `vitest.config.ts` - never per test
- `storybook` - runs the Storybook stories (spawns its own Storybook dev
  server)

## Scoped runs

`test:chromium` / `test:webkit` exist only in `packages/material`; the apps
have just `test` (Chromium only). Arguments after the script name are passed
to vitest, so append a file or directory target — the project is selected by
file pattern (`.test.tsx` → `components`, `.vrt.test.tsx` → `visual`):

```bash
pnpm --filter @solidmaterial/material test:chromium src/components/button/
pnpm --filter @solidmaterial/material test:chromium src/components/button/MaterialButton.vrt.test.tsx
pnpm --filter @solidmaterial/material test:webkit src/components/button/MaterialButton.test.tsx
pnpm --filter @solidmaterial/calculator test src/calculator/
```

Scoped targets match `components` and `visual` but not stories — add
`--project storybook` to include them (e.g.
`test:chromium --project storybook src/components/button/`). For vitest flags
the scripts don't cover, fall back to
`pnpm --filter @solidmaterial/material exec vitest run …`.

Pick the smallest scope that covers the changed files: a single file first,
then a component directory, then the full `pnpm test`.

## Visual regression baselines

- Baselines are committed PNGs in `__screenshots__/` next to each test file,
  namespaced per browser and platform (currently all `-chromium-linux.png`).
- Baselines are canonical only for Chromium on Linux (every committed file
  ends in `-chromium-linux.png`). On any other browser + OS combination the
  first run writes the missing reference screenshot and fails with "No
  existing reference screenshot found; a new one was created. Review it
  before running tests again." — re-run to verify. Generated PNGs are
  gitignored: they only prove local rendering is deterministic, not that it
  matches the canonical baselines. Canonical verification happens on Linux
  (locally or via CI); never commit baselines from another platform.
- Missing baselines are hard failures; never hand-edit a baseline PNG.
- Regenerate with `pnpm test:update` (runs the visual project under Chromium on
  Linux, matching CI) and commit the updated PNGs. CI's
  `update-screenshots.yml` workflow (manual trigger) does the same and opens a
  PR with the results.
- Failure diffs land in `.vitest-attachments/` (gitignored). Report mismatches
  as test failures; do not tweak tests or screenshots to make them pass.

## Notes

- Tests use a custom locator `getByElement(tag)` (see
  `packages/material/vitest.setup.ts`); testing-library cleanup is automatic.
- Coverage is istanbul; uploads go to Codecov, which excludes
  `packages/icons/icons`.
