---
name: Spec Format
description: Template and conventions for implementation specs under docs/plans/ - load when drafting or implementing a spec
---

# Implementation spec format

Specs are markdown files in `docs/plans/<kebab-case-topic>.md`, one file per feature.

## Template

```markdown
# <Topic title>

## Summary

What is being built and why, in a few sentences.

## Current state

Relevant existing code, with concrete file paths and symbols from this monorepo.

## Task breakdown

Ordered checkbox steps, one line each. The goal and file list are copied
verbatim into the worker brief:

- [ ] Step 1: <one imperative sentence> (`<repo path>`, `<repo path>`)
- [ ] Step 2: <one imperative sentence> (`<repo path>`); depends on Step 1

## Acceptance criteria

Testable conditions for "done".

## Risks and open questions

Ambiguities and unknowns to resolve before or during implementation.
```

## Rules

Drafting:

- Cite concrete file paths and symbols from this monorepo, not generic architecture
- Write each step as one line: an imperative, self-contained goal that is
  briefing-sized (one coherent change a single worker can complete without
  asking questions), followed by every file the step creates or edits -
  including tests and stories - backticked in parentheses
- Declare `depends on Step N` for every earlier step this one must not run
  concurrently with: it builds on that step or shares files with it. Steps
  without an edge between them can run in parallel
- Write each acceptance criterion so it is checkable at a specific step or
  at the assembled whole; the orchestrator narrows them into per-task
  criteria for the worker brief
- Try to resolve each question from the code before listing it; under
  "Risks and open questions", list only what remains genuinely open, noting
  what is missing and who can answer it, instead of guessing

Implementing:

- Respect dependency edges: steps without an edge between them may run in
  parallel; a step waits for the steps it depends on
- Change `- [ ]` to `- [x]` as each step is completed; the orchestrating
  session owns the spec file, and subagents receive their task in a brief
  instead of editing it
- Anything not in the spec is out of bounds
