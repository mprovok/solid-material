---
description: Implement a spec from docs/plans
agent: build
---

Read docs/plans/$ARGUMENTS.md and implement it.

- Follow the task breakdown in order; satisfy the acceptance criteria
- Load the spec-format skill; it defines the template and conventions, including marking completed steps [x] in the spec
- If the spec is ambiguous or contradicts the code, stop and ask instead of improvising
- Do not widen scope: anything not in the spec is out of bounds
- If $ARGUMENTS is empty or no such file exists in docs/plans/, list the specs there and ask which one to implement
