---
name: Worker Interface
description: The orchestrator-to-worker brief and the worker-to-orchestrator report - load when briefing a worker or implementing a brief
---

# Worker interface

The contract between an orchestrating session and its `worker` subagents.
The orchestrator composes the brief; the worker acts on it and returns the
report. Both sides load this skill.

## Brief (orchestrator to worker)

- Goal: one imperative task, copied verbatim from a spec step's goal
- Current state: the file and symbol pointers the worker needs to start
- Acceptance criteria: the spec's criteria narrowed to this task - what
  "done" means for the goal and files in scope
- Scope: the files the worker may create or edit; everything else is out
  of bounds
- Guidance: skills to load (write-tests, run-tests, ...) and AGENTS.md
  sections to read (Conventions, Testing, ...)
- Constraints: implement only this task; do not commit; run no checks
  (a targeted `pnpm format` on touched files is allowed); report
  out-of-scope observations instead of fixing them; never edit docs/plans/

## Report (worker to orchestrator)

- Status: done / partial / blocked, with the reason for partial or blocked
- Files changed
- Deviations from the brief
- Out-of-scope observations
- Suggested verification for the orchestrator
