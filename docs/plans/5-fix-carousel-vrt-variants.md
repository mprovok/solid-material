# Carousel VRT tests: multi-browse item widths and centered-hero scroll configurations

## Summary

The existing carousel visual-regression baselines render every multi-browse
item at the same width and only capture the hero and centered-hero variants in
their start state. The uniform widths are caused by Playwright's screenshot
default (`animations: 'disabled'`), which cancels the scroll-driven
`animation-timeline: view(x)` animations that size the carousel's items, so
`--max-width` falls back to `--min-width` (size-large) for every item. This
plan re-enables those animations for the carousel captures, captures
multi-browse at a compact/mobile fixture width where exactly one large, one
medium and one small item are visible (mirroring the stories' iphoneSE3
viewport), and adds scrolled configurations for the centered-hero variant:
scrolled-to-second-item and scrolled-to-end. Test-only change plus regenerated
baselines; no component source changes.

## Current state

- `packages/material/src/components/carousel/MaterialCarousel.vrt.test.tsx` —
  12 visual tests. The fixture (`CarouselFixture`) renders a `<main>` with
  `width: 600px` + `1rem` padding, default `itemCount` 6, an SVG stand-in
  graphic, `settleRender` (fonts, pointer parking, `SETTLE_TRANSITIONS_MS` =
  800 ms), and plain `toMatchScreenshot()` calls (no options). The variant
  test is an `it.each` over all 5 variants captured only at scroll start; the
  header / show-all ×2 / disabled-item / focused-item tests use
  `itemCount: 3`.
- Item sizing mechanism: `MaterialCarouselItemHolder.module.css` (`.container`:
  `min-width`/`--max-width`, `@property --max-width` with `initial-value: 0px`,
  `count-large`/`size-large`/`size-medium` derivation, `scroll-snap-align:
  start`) plus `styling/variants/MaterialCarouselItemHolderVariant{
  MultiBrowse,Hero,CenteredHero,Uncontained,FullScreen}.module.css` — widths
  come from view-timeline keyframes (`multi-browse-expand-medium/large-item`,
  `multi-browse-expand-last-item`, `hero-expand-item`,
  `centered-hero-*-item`, `collapse-item`). Canceled animations → all items
  render at `--min-width` = size-large → uniform widths in every baseline.
- Fixture geometry (gap 8 px = `--md-user-spacing-sm`, container padding
  16 px = `--md-user-spacing-md`, `styling/material.css`): `.carousel`
  (`MaterialCarousel.module.css`) stretches into the main's padding via
  negative `margin-inline`, so at a 600 px main the `sm-carousel` is 600 px
  wide, its scroll port and `100cqi` are 568 px, and
  `@container (width < 600px)` applies (compact: `--md-comp-carousel-size-small`
  = 40 px). Multi-browse `count-large` = max(2, ceil(576/208)) = 3 →
  size-large ≈ 184, size-medium ≈ 136. Live rendering at scroll start with
  animations running: `[184, 184, 136, 40, …]` — last
  visible item small, the one before medium, earlier ones large.
- Three-item rows at the 600 px fixture stay uniform **even with animations
  allowed**: the 3rd item is the last child, and
  `multi-browse-expand-last-item` (range `normal` → `entry size-large`) is at
  ~100 % progress at rest, so all three items render ≈ 184 px. (CSS-derived
  prediction — verify during implementation, see risks.)
- The stories (`MaterialCarousel.stories.tsx`) run the same 3-item fixtures at
  the iphoneSE3 viewport (375×667, `globals.viewport`), where a 375 px main
  (343 px port) gives `count-large` = max(2, ceil(351/208)) = 2 →
  size-large = 167.5, size-medium = 119.5, size-small = 40, i.e. exactly 3
  visible items **[large, medium, small]** filling the port
  (167.5 + 8 + 119.5 + 8 + 40 = 343).
- Hero and centered-hero force `count-large: 1` at compact width. At the 568 px
  port: hero size-large = 100cqi − small − gap = 520; centered-hero (non-edge
  items) = 100cqi − 2·small − 2·gap = 472; centered-hero start `[520, 40, …]`,
  scrolled to second item `[40, 472, 40, …]`, scrolled to end
  `[…, 40, 520]`; hero start `[520, 40, …]` (all Chromium-verified during
  planning).
- Scroll mechanics: tests run in a real browser;
  `screen.getByElement('sm-carousel').element()` is the scroll container
  (`ref={pointerRef}` with `scrollLeft` in `MaterialCarousel.tsx`'s drag
  logic); its children are the `MaterialCarouselItemHolder` divs. `.carousel`
  sets `scroll-snap-type: x mandatory` and `scroll-behavior: smooth`, so
  programmatic scrolling must use `behavior: 'instant'` and then wait for the
  mandatory snap to settle.
- Baselines: 12 `*-chromium-linux.png` files in
  `packages/material/src/components/carousel/__screenshots__/MaterialCarousel.vrt.test.tsx/`.
  Visual project config (`packages/material/vitest.config.ts`) sets
  `allowedMismatchedPixelRatio: 0.05`, `retry: 0`, viewport 1024×768.

## Task breakdown

Ordered steps; all changes stay inside
`packages/material/src/components/carousel/` (only
`MaterialCarousel.vrt.test.tsx` and its `__screenshots__/` baselines), plus
this plan's own checkboxes as steps complete.

**Use the repo's `write-tests` skill when implementing** — load it before editing the first file; it encodes the render/locator/Given/When/Then conventions these steps reference.

- [x] 1. **Allow scroll-driven animations in every capture.** Add a local
      helper in `MaterialCarousel.vrt.test.tsx`, e.g.
      `const matchScreenshot = (element: Locator) => expect.element(element).toMatchScreenshot({ screenshotOptions: { animations: 'allow' } })`,
      and use it at all call sites. The option shape is verified against the
      installed `@vitest/browser@4.1.11` (catalog: playwright 1.64.1):
      `screenshotOptions.animations` defaults to `'disabled'`, per-call
      options deep-merge over the project defaults, and the flattened options
      reach Playwright's `element.screenshot()`, which accepts `'allow'`.
      Keep it scoped to this file — do **not** change `vitest.config.ts`
      globally (other components' captures may rely on canceled animations,
      e.g. indeterminate progress).
- [x] 2. **Make the fixture width configurable.** `CarouselFixtureProps`
      gains `width?: string` (default `'600px'`) applied to the `<main>`
      style; the screenshot target stays `screen.getByElement('main')`.
- [x] 3. **Multi-browse progressive widths.**
  - Keep the 6-item captures at 600 px (variant row, custom height, custom
    item max width): with animations allowed they render
    `[184, 184, 136, 40, …]`.
  - Move the `itemCount: 3` tests (header, header + show-all icon button,
    show-all button, disabled item, focused first item) to
    `width: '375px'`: 3 items render `[167.5 (large), 119.5 (medium), 40
    (small)]` — exactly the stories' mobile rendering and the expected
    last-visible-small / medium / large pattern. (At 600 px these rows would
    stay all-large because the 3rd item is the last child.)
  - Add one dedicated compact test, e.g.
    `it('renders a multi-browse carousel with large, medium and small items at a compact width', …)`
    with `width: '375px'` and the default 6 items: assert the carousel list is
    visible, then capture `main` — exactly 3 items visible (large, medium,
    small), the rest off-screen.
- [x] 4. **Hero variant — start configuration only.** Keep the start state in
      the variant `it.each` (regenerated baseline `[520, 40, …]` — first item
      large, second small). No scrolled-to-end capture for hero: the
      snap-settled end rendering was dropped at the requester's direction
      (it never looked right in review), so hero has a single baseline.
- [x] 5. **Centered-hero variant — 3 configurations.** Keep the start state in
      the variant `it.each` (regenerated `[520, 40, …]` — first large, second
      small). Add:
  - `it('renders a centered-hero carousel scrolled to the second item', …)`:
    `(carousel.element().children[1] as HTMLElement).scrollIntoView({ behavior:
    'instant', inline: 'start', block: 'nearest' })` (the child div is the
    item holder carrying the variant's `scroll-margin-inline-start`), wait for
    snap settle, assert `scrollLeft > 0`, capture. Expected:
    `[40, 472, 40, …]` — first small, second large, third small.
  - `it('renders a centered-hero carousel scrolled to the end', …)`: render +
    settle, then `scrollTo({ left: scrollWidth, behavior: 'instant' })` on the
    `sm-carousel` element, wait for the mandatory snap to settle (rAFs /
    short `vi.waitFor` until `scrollLeft` stops changing; the existing
    `SETTLE_TRANSITIONS_MS` settle and `toMatchScreenshot`'s built-in
    stability loop are backstops), assert `scrollLeft > 0`, then capture.
    Expected: `[…, 40, 520]` — the last item large, the item before it small.
- [x] 6. **Regenerate all carousel baselines.** Every existing capture changes
      (animations are no longer canceled), so delete the stale PNGs in
      `__screenshots__/MaterialCarousel.vrt.test.tsx/` and run:
      `pnpm --filter @solidmaterial/material exec vitest run --project visual --browser chromium src/components/carousel/MaterialCarousel.vrt.test.tsx -u`
      (path before `-u`; baselines stay `-chromium-linux` per the existing
      convention). Browser choice confirmed with the requester: Chromium,
      matching the existing baselines.
- [x] 7. **Verify determinism and expectations.** Re-run the same command
      without `-u` twice — everything passes. Spot-check the regenerated
      PNGs against the width expectations above (343 px port: 3 visible
      ~168/120/40; 568 px port: 184/184/136/40; hero/centered-hero states as
      listed). If a live rendering deviates materially — especially the
      3-item-at-600 px last-child prediction — stop and report instead of
      committing misleading baselines.
- [x] 8. **Quality gates.** `pnpm format` on the touched files and `pnpm lint`
      clean; the file stays under `max-lines` 1000;
      `git status --short packages/material/src/components/carousel docs/plans`
      shows only the intended changes (the working tree already carries
      pre-existing untracked `__screenshots__/` dirs across other components —
      leave those alone), plus this plan's ticked checkboxes. No changeset
      needed — `*.vrt.test.tsx`
      files and baseline PNGs are excluded from the published build
      (AGENTS.md). Leave the changes uncommitted for the requester (or
      follow the requester's commit flow).

## Acceptance criteria

- Every multi-browse capture shows progressive widths — the last visible item
  small (40 px), the item before it medium, and all visible items before that
  large. No capture shows uniform item widths:
  - 600 px captures (variant row, custom height, custom item max width):
    `[~184, ~184, ~136, 40, …]`.
  - Compact 375 px captures (new variant test, header, show-all ×2, disabled,
    focused): exactly 3 visible items `[~168, ~120, 40]`.
- Hero has 1 baseline: start (`[~520, 40, …]`). No hero scrolled-to-end
  capture (dropped at the requester's direction — see step 4).
- Centered-hero has 3 baselines: start (first item large ~520, second small
  40), scrolled to the second item (`[40, ~472, 40]` — first small, second
  large, third small), scrolled to the end (last item large ~520, the item
  before it small).
- The uncontained and full-screen baselines regenerate with their
  scroll-driven (non-uniform) item widths.
- `pnpm --filter @solidmaterial/material exec vitest run --project visual --browser chromium src/components/carousel/MaterialCarousel.vrt.test.tsx`
  passes twice in a row against the regenerated baselines.
- This task changes nothing outside `MaterialCarousel.vrt.test.tsx`, its
  `__screenshots__/` PNGs, and this plan's checkboxes (pre-existing untracked
  files elsewhere in the working tree are left alone); `pnpm lint` and
  `pnpm format:check` pass.

## Risks and open questions

- **`animations: 'allow'` option shape** — verified against the installed
  `@vitest/browser@4.1.11`: `screenshotOptions.animations` defaults to
  `'disabled'`, per-call options deep-merge over the project defaults, and the
  flattened options reach Playwright's `element.screenshot()`, which accepts
  `'allow'`. The project-config fallback (`vitest.config.ts` visual project)
  affects every component's captures — avoid it.
- **Three-item-at-600 px prediction** — the claim that 3-item rows render
  all-large at the 568 px port (last-child
  `multi-browse-expand-last-item` at ~100 % at rest) is derived from the CSS
  ranges, not browser-verified. The compact-width move stands regardless (it
  mirrors the stories' mobile viewport and the expected large/medium/small
  rendering), but verify during step 7 and report deviations.
- **Snap-settled end states** — mandatory snapping decides the exact end
  position and the scrollable width shifts while trailing items collapse.
  Capture the snap-settled state; do not disable snapping to chase a
  "designed" arrangement. This is also why the hero variant gets no
  scrolled-to-end capture (dropped at the requester's direction); the
  centered-hero end capture keeps the single `scrollTo` + snap-settle
  approach.
- **Compact fixture vs mobile viewport** — the fixture narrows `<main>`
  instead of resizing the test iframe. The carousel is entirely
  container-query driven, so the rendering is identical; if exact-story parity
  is ever required, `page.viewport(375, 667)` is the alternative, but a
  viewport change persists across tests in a file, so every render helper
  would then have to set the viewport explicitly (see
  `docs/plans/3-write-vrt-tests.md`).
- **WebKit/macOS baselines** — CI runs the visual project on macOS WebKit,
  and no component has committed WebKit baselines (every `__screenshots__/`
  directory is untracked — repo-wide gap, unchanged by this task; separate
  follow-up via `update-screenshots.yml`; do not commit Linux-generated
  WebKit baselines).
- **Pixel expectations are guides, not assertions** — the screenshots are the
  assertions; if the browser renders materially different widths, treat it as
  a finding (the CSS model above is wrong, or the component regressed) and
  investigate before committing baselines.
