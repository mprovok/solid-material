---
name: Implement Spec
description: Orchestrate the implementation of a spec in docs/plans/ - dependency waves, worker briefs and reports, serialized verification - load when implementing a spec
---

# Orchestrating the implementation of a spec

Orchestrate the implementation of a spec in docs/plans/. `worker` subagents
implement the individual steps; `tester` and `reviewer` verify their work.
As the orchestrator, you own the spec file and the schedule.

## Before starting

- Load the spec-format skill for the step, checkbox, and edge conventions
  used below.
- Steps already marked [x] are done; skip them.
- Resolve the spec's "Risks and open questions". If a question is genuinely
  open or the spec contradicts the code, stop and ask the user instead of
  improvising.
- Read the task breakdown and build the dependency graph. A
  `depends on Step N` edge means the steps must not run concurrently,
  because one builds on the other or they share files.
- Topologically sort the steps into waves: a step runs in the first wave
  after all its dependencies. Steps without an edge between them may run in
  parallel.
- Safety net: before launching a wave, check that the parallel steps' file
  scopes are disjoint. If they overlap, the planner missed an edge. Run
  those steps sequentially; do not add the missing edge to the spec
  yourself.

## Dispatching a wave

- Substantial steps run as parallel background `worker` subagents. Trivial
  steps (one file, a handful of lines) are done inline without subagents.
- Workers do not inherit AGENTS.md and never see the spec; each brief is
  self-contained and follows the worker-interface skill.
- Derive each brief's Guidance from the step's files (test files imply
  write-tests and run-tests) and always include AGENTS.md Conventions.
- When a wave's workers report back in the worker-interface report format:
  integrate their reports, change the completed steps' `- [ ]` to `- [x]`
  in the spec, and resolve anything reported as blocked or deviating
  before verification.

## Verifying a wave

- After each wave, run exactly one `tester` subagent scoped to the touched
  packages, then one `reviewer` subagent on the wave's combined diff.
- Browser test runs are serialized, never parallel; decide which browser to
  use (default is Chromium) and pass it down to the `tester`.
- Fix all findings before starting the next wave, inline or via a `worker`
  with a fix brief.

## Standing rules

- Satisfy the spec's acceptance criteria before declaring the spec done.
- Do not widen scope: anything not in the spec is out of bounds.
- Do not stage or commit changes; that is done by the user.
