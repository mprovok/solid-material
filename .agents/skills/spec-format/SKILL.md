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

Ordered steps with dependencies and affected packages:

- [ ] Step 1
- [ ] Step 2

## Acceptance criteria

Testable conditions for "done".

## Risks and open questions

Ambiguities and unknowns to resolve before or during implementation.
```

## Rules

Drafting:

- Cite concrete file paths and symbols from this monorepo, not generic architecture
- If requirements are ambiguous, list them under "Risks and open questions" instead of guessing

Implementing:

- Follow the task breakdown in order and change `- [ ]` to `- [x]` as each step is completed
- Anything not in the spec is out of bounds
