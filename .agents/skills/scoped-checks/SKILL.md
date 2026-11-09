---
name: Scoped Checks
description: Run this repo's lint and format checks - whole repo or scoped to a single package such as material or landing-page
---

# Scoped lint and format checks

This repo lints with oxlint (type-aware, run through turbo) and formats with
oxfmt. Both have verified scoped forms; prefer them over running everything
when only some packages changed.

## Whole repo

```bash
pnpm lint            # turbo lint across packages
pnpm format:check    # oxfmt --check on everything
```

## Scoped to one package

Both lint spellings work (the first goes through turbo, the second runs the
package script directly; multiple `--filter` flags are allowed):

```bash
pnpm lint --filter=@solidmaterial/material
pnpm --filter @solidmaterial/material lint
```

Format checks scope by path:

```bash
pnpm format:check packages/material
pnpm format:check apps/landing-page
```

## Mutating variants

These commands modify files instead of checking them; use them only when
changes are intended. There is no root `pnpm lint:fix` script — fix lint
issues per package:

```bash
pnpm --filter @solidmaterial/material lint:fix
```

Target `pnpm format` at specific paths (e.g.
`pnpm format packages/material/src`) — a bare `pnpm format` reformats
everything in reach.
