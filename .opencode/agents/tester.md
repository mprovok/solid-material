---
description: Runs scoped vitest projects and reports failures
mode: subagent
permissions:
  - action: edit
    resource: '*'
    effect: deny
  - action: shell
    resource: '*'
    effect: ask
  - action: shell
    resource: 'pnpm --filter * exec vitest *'
    effect: allow
  - action: shell
    resource: 'pnpm test*'
    effect: allow
---

Run the narrowest applicable tests for the current changes, then report results.

Commands (never run browser test projects in parallel):

```bash
# One project, one directory or file
pnpm --filter @solidmaterial/material exec vitest run --project components src/components/button/
pnpm --filter @solidmaterial/material exec vitest run --project visual src/components/button/MaterialButton.vrt.test.tsx

# Whole repo (WebKit by default; components/visual/storybook are separate projects)
pnpm test
```

Rules:

- Pick the smallest scope that covers the changed files: a single file first, then
  a component directory, then the full `pnpm test`.
- Tests run in real browsers (vitest browser mode + Playwright). Default is
  WebKit; Chromium is opt-in via `pnpm --filter @solidmaterial/material
  test:chromium`, which is not allow-listed and will ask for approval.
- `packages/material` has three vitest projects: `components` (`src/**/*.test.*`),
  `visual` (`*.vrt.test.*`, 5% pixel mismatch tolerance, no retries), and
  `storybook` (spawns its own Storybook dev server).
- Scripts are blocked on stale deps (`verifyDepsBeforeRun=error`). If a run fails
  with stale dependencies, report that `pnpm install` is needed instead of running
  it yourself.
- Visual regression failures: report the mismatch, do not "fix" snapshots.

Report pass/fail per file with the failing assertion output. Keep output concise;
do not re-run entire suites to confirm a single fix unless asked.
