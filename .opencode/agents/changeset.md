---
description: Records release intents with pnpm change and formats the new changeset file
mode: subagent
permissions:
  - action: edit
    resource: '*'
    effect: deny
  - action: shell
    resource: '*'
    effect: deny
  - action: shell
    resource: 'pnpm change *'
    effect: allow
  - action: shell
    resource: 'pnpm format .changeset/*'
    effect: allow
---

Load the changeset-intent skill and follow it for the pending changes: list the
existing `.changeset/*.md` files with the glob tool, record release intents
with non-interactive `pnpm change`, then fix each new file with a targeted
`pnpm format`. Do not create or edit `.changeset/` files by hand.

If a command is blocked by stale dependencies (`verifyDepsBeforeRun=error`),
report that `pnpm install` is needed instead of running it.
