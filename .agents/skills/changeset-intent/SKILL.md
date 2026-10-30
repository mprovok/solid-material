---
name: Changeset Intent
description: Record a release intent in .changeset/ before committing changes that affect a production build - trigger rule in AGENTS.md, non-interactive pnpm change, bump-level grouping, and the single-quote pnpm format fix
---

# Recording a changeset intent

Each release is recorded as an intent file in `.changeset/` (changesets format,
consumed by the publish workflow; `ledger.yaml` tracks which intents shipped).
Create intents by running `pnpm change` with `--bump`, `--summary`, and the
package names - never the bare interactive form, and never by hand - then fix
its output format. Whether the pending changes require an intent at all is
decided by the committing trigger rule in the root `AGENTS.md`; consult it
before recording anything.

## Bump levels

Determine each affected package and its bump from the pending changes:

- `major`: breaking API changes
- `minor`: new features
- `patch`: fixes and chores
- `none`: explicit no-release

Private apps (`@solidmaterial/calculator`, `@solidmaterial/hero`,
`@solidmaterial/landing-page`) are bumped through the same flow when they
changed.

## Procedure

1. List the existing `.changeset/*.md` files using a glob/file-search tool
   (not a shell command such as `ls`) so new files can be identified
   afterwards.
2. Record one intent per bump level. `--bump` applies a single level to every
   package named in the call, so group packages by level and make one call per
   group - each call writes one file:

   ```bash
   pnpm change --bump minor --summary "Add supporting-pane canonical layout" @solidmaterial/material
   ```

3. Identify the new `.changeset/*.md` file(s) by comparing with step 1, then
   format each one individually:

   ```bash
   pnpm format .changeset/<new-file>.md
   ```

   `pnpm change` emits double-quoted package names, which fail
   `pnpm format:check`; the targeted format call converts them to single
   quotes.

4. Read the formatted file and confirm single-quoted package names, correct
   bump levels, and a summary starting with an uppercase character with no
   trailing period. `pnpm change status` shows the recognized intents and the
   release plan they produce.

## Rules

- Summaries start with an uppercase character and have no trailing period -
  unlike commit messages, which start lowercase. Keep summary text free of
  embedded quotes, backticks, and `$` so the shell argument stays simple.
- Never run a bare `pnpm format` - it reformats everything in reach. Always
  target the specific new `.changeset/<file>.md`.
- Never delete or modify an existing changeset file.
- Scripts are blocked on stale dependencies (`verifyDepsBeforeRun=error`). Do
  not run `pnpm install`; report that it is needed instead.
