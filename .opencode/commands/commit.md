---
description: Commit pending changes — records changesets first when production build files are affected, then commits with an Assisted-by trailer
agent: build
---

Commit the pending changes described below, following the repo rules.

Target: $ARGUMENTS (empty means all pending changes; a pathspec limits both
what is committed and what the trigger check below evaluates)

!`git status --short`

1. **Changesets.** Apply the committing trigger rule in the root `AGENTS.md`
   ("Dependency & release rules"): if the changes touch files that end up in
   a production build of a published package, or a private app changed,
   record release intents first with the changeset subagent, which follows
   the `changeset-intent` skill. Skip this step when the rule says no intent
   is needed or matching intents already exist in `.changeset/`. If the user
   explicitly defers the changeset, commit without one and say so.
2. **Trailer.** Add the `Assisted-by:` trailer per root `AGENTS.md` ("Conventions").
3. **Commit.** Stage the target changes and write a conventional commit
   message that passes `scripts/lint-git-commit-msg.mts` — feed the finished
   message to the script on stdin to verify it before committing. The rules
   are in `AGENTS.md` ("Conventions"). Never bypass hooks with `--no-verify`.
