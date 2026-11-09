---
name: Write Tests
description: Write tests for @solidmaterial/material components - visual regression screenshots (*.vrt.test.tsx) and component interaction/a11y tests (*.test.tsx) - following this repo's established patterns
---

# Writing tests for @solidmaterial/material

All tests for `packages/material` run in a real browser via vitest browser mode.
Never write jsdom/happy-dom-style tests: no `document.querySelector` scraping,
no fake timers for UI behavior, no manual DOM teardown.

Some components wrap `@material/web` web components (Lit, open shadow roots).
Shared setup lives in `packages/material/vitest.setup.ts`:

- `getByElement(tag)` — custom locator resolving a tag selector. Use it for
  `sm-*`/`md-*` custom elements when no accessible role exists. It is
  chainable: `labelButton.getByElement('md-icon')`.
- `afterEach(cleanup())` is already registered — never import or call `cleanup`
  inside a test file.

Shared conventions:

- Render with `render` from `@solidjs/testing-library` (pass an accessor:
  `render(() => <Component />)`, optionally `{ wrapper: MaterialTheme }`).
- Scope all queries after rendering: `const screen = page.elementLocator(baseElement)`.
- `await` every browser-side call (`userEvent.*`, `expect.element(...)`); plain
  mock assertions stay sync.
- Mock callback props with `vi.fn()`. Assert the callback has NOT fired before
  the acting step, and prefer `toHaveBeenCalledExactlyOnceWith(...)` for
  payloads.
- Narrate with `// Given … // When … // Then …` comments.
- Top-level `describe('<MaterialComponent>')`; the established nested blocks
  are `describe('Visual')` and `describe('Interaction')`. Add other blocks
  such as `Accessibility` or `Edge cases` only when a file warrants them.
  `it` titles are lowercase and behavioral: `'can be clicked'`,
  `'renders a disabled button'`.
- Parameterize with typed tables (`it.each` / `describe.each`) instead of
  copy-pasting test bodies (details per section below).
- Formatting is oxfmt: single quotes, no trailing comma, `arrowParens: avoid`,
  width 120, icon imports sort last. Run `pnpm format` after writing.
- Test files are excluded from the published build — no changeset needed.

## Visual regression tests

File: `src/components/<dir>/<Component>.vrt.test.tsx`. Purpose: capture the
component's **static rendering** — one component instance per screenshot.
Interaction coverage lives in `*.test.tsx`, not here.

Do **not** replicate Storybook "grid"/"overview" stories that render many
variants in one canvas. Replace them with data-driven `it.each` matrices: each
test renders exactly one component in one state and takes one screenshot.

### Template

```tsx
import type { FlowComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialButtonProps, MaterialButtonVariant } from './MaterialButton';

import { MaterialButton } from './MaterialButton';

import PlayArrowIcon from '@solidmaterial/icons/400/outlined/play_arrow.svg';

const Wrapper: FlowComponent = props => (
  <MaterialTheme theme="tonal-spot">
    <div style={{ 'background-color': 'white' }}>{props.children}</div>
  </MaterialTheme>
);

const renderComponent = async (props: MaterialButtonProps) => {
  const { baseElement } = render(() => <MaterialButton {...props}>Label</MaterialButton>, {
    wrapper: Wrapper
  });
  await document.fonts.ready;
  return page.elementLocator(baseElement);
};

describe('MaterialButton', () => {
  describe('Visual', () => {
    it.each(['elevated', 'filled', 'tonal', 'outlined', 'text'] satisfies MaterialButtonVariant[])(
      'renders a button with variant $0',
      async variant => {
        const screen = await renderComponent({ variant });

        const button = screen.getByRole('button');
        await expect.element(button).toBeVisible();

        await expect.element(button).toMatchScreenshot();
      }
    );
  });
});
```

### Rules

- Define a local async `renderComponent(props)` helper per file and use it
  for most test cases: render → `await document.fonts.ready` →
  `return page.elementLocator(baseElement)`. The font wait is mandatory —
  omitting it is the classic source of flaky screenshots. Bake fixed JSX
  (children, a default label) inside the helper's accessor — toolbar's
  helper renders its child icon buttons itself.
- `renderComponent` accepts plain prop values only: SolidJS requires JSX to
  be constructed inside the accessor passed to `render()`, so
  `renderComponent({ icon: <SomeIcon /> })` would build the element outside
  the render call. When a test case needs a JSX prop, either add a
  specialized helper (e.g. `renderComponentWithIcon`) when multiple test
  cases share it, or call `render()` directly inside the test case — the
  tooltip VRT files use the direct form (the rich one for its JSX `actions`
  prop, the plain one for a single simple test).
- Wrap in `MaterialTheme`. Add a white-background `div` (see `Wrapper` above)
  when the component is visually transparent; simpler components may pass
  `MaterialTheme` directly as the wrapper.
- Screenshot with `await expect.element(locator).toMatchScreenshot()` —
  element-scoped, no arguments. Never screenshot `document`/`body`; only
  components needing surrounding context may screenshot the entire rendered
  base element instead of a tighter locator:
  `await expect.element(screen).toMatchScreenshot()` with the `elementLocator`
  returned by the render helper.
- Assert preconditions before every screenshot: `toBeVisible()` plus whatever
  the state claims — `toBeDisabled()`, `toBeEnabled()`,
  `toHaveAttribute('href', '/')`, `toHaveTextContent('999+')`. These assertions
  document why the screenshot is expected to look the way it does.
- Parameter tables are prop-value matrices, typed against the real prop unions
  (`satisfies`) so a renamed prop breaks the tests at compile time:
  - variants/sizes/shapes:
    `it.each(['elevated', 'filled'] satisfies MaterialButtonVariant[])('renders a button with variant $0', ...)`
  - binary states: `it.each([false, true])('functions as a switch when toggle = $0', ...)`
  - identical rendering for falsy variants: `it.each([false, undefined])('renders a button which is enabled when disabled = $0', ...)`
  - cross-products: `describe.each([false, true])('toggle = $0', toggle => { it.each(...) })`

### Which states to cover

- Every exported variant, size, shape, and color — with icon and without when
  the component supports both.
- `disabled: true`, plus per-variant disabled matrices when the disabled
  styling differs by variant.
- Selected and unselected states for toggleables (assert the changed role, e.g.
  `getByRole('switch')` instead of `'button'`).
- Link mode (`href`) when supported.
- Content extremes: truncating text, overflow (`999+`), empty value, absent
  value (`value: undefined` → element must not be in the document).
- Hover styling, captured with real pointer movement
  (`await userEvent.hover(item)`) — see gotchas below.

### Gotchas

- **Never force pseudo-states.** No injected CSS classes, no attribute
  manipulation to fake `:hover`/`:focus`/`:active`. Use a real
  `userEvent.hover(...)` or skip the state entirely.
- **Hover hygiene.** When any test hovers, park the pointer first so hover
  state from a previous test cannot leak into a screenshot:
  ```tsx
  // Move the pointer to the top-left corner so that hover state from a
  // previous test does not leak into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 0, y: 0 } });
  ```
- Baselines are committed PNGs under `__screenshots__/` next to the test file,
  namespaced per browser and platform. Missing baselines are hard failures and
  must never be hand-edited — regenerate them with `pnpm test:update` (see the
  run-tests skill).
- The visual project retries zero times and allows a 5% pixel mismatch — both
  configured centrally in `vitest.config.ts`; never per test.
- No Storybook imports (`@storybook/*`, `.storybook/preview`, storybook `fn()`),
  no multi-variant canvases, no interaction tests in these files.

## Component tests (interaction + a11y)

File: `src/components/<dir>/<Component>.test.tsx`. Purpose: interaction
behavior and accessibility. There is **no axe dependency** in this repo — a11y
is validated structurally through role-based queries and ARIA attribute
assertions. A failed `getByRole` query **is** the a11y regression signal.

Structural (non-screenshot) `describe('Visual')` blocks — presence and
visibility checks — also belong in these files.

### Template

```tsx
import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialCheckbox } from './MaterialCheckbox';

describe('MaterialCheckbox', () => {
  describe('Interaction', () => {
    it('can be clicked', async () => {
      const onChange = vi.fn();
      const { baseElement } = render(() => (
        <MaterialCheckbox checked={false} ariaLabel="Label" name="name" onChange={onChange} />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the checkbox is visible
      const checkbox = screen.getByRole('checkbox', { name: 'Label' });
      await expect.element(checkbox).toBeVisible();

      // and unchecked
      await expect.element(checkbox).not.toBeChecked();

      // When the checkbox is clicked
      await userEvent.click(checkbox);

      // Then the checkbox is checked and onChange is called once
      await expect.element(checkbox).toBeChecked();
      expect(onChange).toHaveBeenCalledExactlyOnceWith(true, 'name');

      // When the checkbox is clicked again
      await userEvent.click(checkbox);

      // Then the checkbox is unchecked and onChange is called once
      await expect.element(checkbox).not.toBeChecked();
      expect(onChange).toHaveBeenCalledWith(false, 'name');
    });
  });
});
```

### Interaction coverage checklist

- `vi.fn()` for every callback prop; assert it has NOT been called before the
  action.
- Precondition: `await expect.element(el).toBeVisible()` before acting.
- Pointer: `await userEvent.click(el)`; also `dblClick`, `hover`/`unhover`,
  `fill` for values, `wheel` with delta for scrolling.
- Keyboard: `await userEvent.keyboard('{Enter}')` / `'{Space}'` for activation,
  arrow keys for roving focus, `'{Escape}'` for dismissal,
  `await userEvent.tab()` / `tab({ shift: true })` for focus order.
- Programmatic focus via the raw element: `el.element().focus()` then
  `await expect.element(el).toHaveFocus()`.
- Round-trip toggles: on → payload `(true, name)` → off → payload
  `(false, name)`.
- Disabled: render with `disabled={true}`, interact, assert the callback was
  NOT called.
- `await waitFor(() => expect(cb).toHaveBeenCalledOnce())` only for
  indirect/async effects (events bubbling out of web components). No fake
  timers.
- Stateful/controlled components: wrap in a file-local component that owns a
  `createSignal` (simulating the parent app) instead of re-rendering manually.
- Parametrize whole suites with `describe.each(['standard', 'modal'] satisfies
  MaterialBottomSheetVariant[])('variant = $0', variant => { ... })`.

### A11y coverage checklist

- Query by role + accessible name (`getByRole('button', { name: 'Label' })`,
  `getByLabelText('Card')`) — broken wiring shows up as a failed query.
- Assert dynamic ARIA state, ideally in a `describe('Accessibility')` block:
  `await expect.element(iconButton).toHaveAttribute('aria-expanded')`.
- `ariaLabel` props must map to the accessible name; the `name` prop must reach
  form event payloads.
- Keyboard operability (Enter/Space activation, tab order) counts as a11y
  coverage — include it.
- Do not invent an axe/violations dependency; this repo validates a11y
  structurally.

### Shadow DOM

- `getByRole`, `getByText`, and `getByLabelText` pierce open shadow roots —
  e.g. `getByRole('checkbox')` finds the node inside `<md-checkbox>`. Never
  query `shadowRoot` manually.
- Use `getByElement('sm-…')` for the library's own custom elements and
  `chained.getByElement('md-icon')` for internals of wrapped components.
- `locator.element()` is the escape hatch for real DOM APIs only (`.focus()`,
  geometry, `.closest()`).
