---
name: Code Review
description: Review changes in this repo - mechanical checks first, then bugs, structure, conventions, and accessibility
---

# Reviewing changes

The root AGENTS.md is the authoritative conventions source; check the changes
against it rather than re-deriving the rules.

## Scope

Default to all uncommitted changes: `git status --short` (including untracked
files), `git diff` (unstaged), and `git diff --cached` (staged). A commit hash
means `git show <hash>`; a branch name means `git diff <branch>...HEAD`; a
pull request means `gh pr view <pr>` plus `gh pr diff <pr>`.

## Verify mechanically first

Run the lint and format checks (see the scoped-checks skill for the exact
commands - whole repo, or scoped to the affected packages) and include their
failures in the findings. `pnpm format:check` is not affected-filtered, so only
report failures on files touched by the changes under review.

Scripts are blocked on stale dependencies (`verifyDepsBeforeRun=error`). Do
not run `pnpm install`; report that it is needed instead.

## Read the full context

Diffs alone are not enough. Read the entire changed and new files to understand code patterns.
Code that looks wrong in isolation may be correct given the surrounding logic, and vice versa.

## What to look for

- **Correctness** (primary focus): logic errors, broken edge cases, missing guards
  and unreachable paths, unhandled errors, security issues, unintended
  behavior changes.
- **Structure**: fits existing patterns and established abstractions; no
  excessive nesting where early returns would do.
- **Conventions** (root AGENTS.md is authoritative):
  - Dependency versions exact (no `^`); shared deps in the `catalog:`.
  - No polyfills or fallbacks for older browsers - the baseline-2025 target
    deliberately uses modern CSS (scroll-driven animations, anchor
    positioning).
  - Some components are thin bindings around `@material/web` web components
    (ripple, focus ring, form controls) - flag DOM/API changes that assume
    otherwise.
- **Accessibility**: verify ARIA attributes and keyboard interaction for any
  component whose markup or behavior changed.

## Report

Findings go in severity order with file and line references. Before flagging a
bug, be certain: investigate first, and only flag code the changes under
review touched - not pre-existing code. Don't invent hypothetical problems;
for each bug, state the realistic scenario or input where it breaks. Verify
library and API usage against the codebase or upstream docs; if that isn't
possible, say "I'm not sure about X" instead of flagging it. Keep the report
matter-of-fact, easy to skim, and free of flattery.
