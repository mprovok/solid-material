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

Load the `run-tests` skill and follow it for browser install/selection, the
exact commands, the vitest project inventory, and VRT baseline handling.

Rules:

- Pick the smallest scope that covers the changed files: a single file first, then
  a component directory, then the full `pnpm test`.
- The parent agent decides the browser (default Chromium); never run browser
  test projects in parallel.
- Scripts are blocked on stale deps (`verifyDepsBeforeRun=error`). If a run fails
  with stale dependencies, report that `pnpm install` is needed instead of running
  it yourself.
- Visual regression failures: report the mismatch, do not "fix" snapshots;
  a missing baseline is a hard failure, not something to work around.

Report pass/fail per file with the failing assertion output. Keep output concise;
do not re-run entire suites to confirm a single fix unless asked.
