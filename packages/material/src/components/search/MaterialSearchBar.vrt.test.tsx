import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { Match, Switch, createSignal } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';

import type { MaterialSearchBarProps } from './MaterialSearchBar';

import { MaterialSearchBar } from './MaterialSearchBar';

import StarIcon from '@solidmaterial/icons/400/outlined/star.svg';

// Written by GLM 5.3 Flash

// How long to wait after rendering until the leading/trailing button fade-in
// transitions and the focus debounce have settled
const SETTLE_TRANSITIONS_MS = 800;

interface RenderComponentProps extends Pick<MaterialSearchBarProps, 'initialFocus' | 'showClearButton'> {
  initialText?: string;
  showLeadingButton?: boolean;
  showTrailingButtons?: boolean;
}

// Mirrors the fixture from MaterialSearchBar.test.tsx, rendered standalone
// (both MaterialSearch contexts are created with defaults) inside a fixed
// width element — the bar is width: 100% of its parent, so the parent width
// determines the rendered bar width. The caret is hidden because the expanded
// bar has a focused input whose caret would otherwise flicker between runs.
const RenderComponent: VoidComponent<RenderComponentProps> = props => {
  const [searchInput, setSearchInput] = createSignal(props.initialText ?? '');

  return (
    <main style={{ width: '600px', padding: '1rem', 'caret-color': 'transparent' }}>
      <MaterialSearchBar
        placeholder="Placeholder"
        input={searchInput}
        setInput={setSearchInput}
        initialFocus={props.initialFocus}
        showClearButton={props.showClearButton}
        backButtonAriaLabel="Back"
        clearButtonAriaLabel="Clear input"
        leadingButton={
          props.showLeadingButton === true ? (
            <MaterialIconButton variant="text" icon={<StarIcon />} ariaLabel="Unfocused leading button" />
          ) : undefined
        }
        trailingButtons={
          props.showTrailingButtons === true
            ? focus => (
                <Switch>
                  <Match when={focus}>
                    <MaterialIconButton variant="text" icon={<StarIcon />} ariaLabel="Focused trailing button" />
                  </Match>
                  <Match when={!focus}>
                    <MaterialIconButton variant="text" icon={<StarIcon />} ariaLabel="Unfocused trailing button" />
                  </Match>
                </Switch>
              )
            : undefined
        }
      />
    </main>
  );
};

// Prepares a freshly rendered search bar for its screenshot: waits for the
// fonts, the button fade-in transitions and the focus debounce to settle and
// parks the pointer so hover state from a previous test cannot leak into the
// screenshot
const settleRender = async (baseElement: HTMLElement, renderedAt: number) => {
  await document.fonts.ready;

  const screen = page.elementLocator(baseElement);

  // Move the pointer to the top-left corner so that hover state from a
  // previous test does not leak into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 0, y: 0 } });

  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(renderedAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );

  return screen;
};

const renderComponent = async (props: RenderComponentProps = {}) => {
  const renderedAt = performance.now();

  const { baseElement } = render(() => <RenderComponent {...props} />, { wrapper: MaterialTheme });

  return settleRender(baseElement, renderedAt);
};

describe('MaterialSearchBar', () => {
  describe('Visual', () => {
    // Collapsed (unfocused) — default search icon leading button
    it('renders a collapsed bar', async () => {
      const screen = await renderComponent();

      // Given the search bar is collapsed and the input field is visible
      const bar = screen.getByElement('sm-search-bar');
      await expect.element(bar).not.toHaveAttribute('data-expanded');

      const input = screen.getByRole('searchbox');
      await expect.element(input).toBeVisible();

      await expect.element(bar).toMatchScreenshot();
    });

    // Expanded (focused) — back button, typed text and clear button
    it('renders an expanded bar', async () => {
      const screen = await renderComponent({ initialFocus: true, initialText: 'Some text' });

      // Given the search bar is expanded and contains the initial text
      const bar = screen.getByElement('sm-search-bar');
      await expect.element(bar).toHaveAttribute('data-expanded');

      const input = screen.getByRole('searchbox');
      await expect.element(input).toHaveValue('Some text');

      await expect.element(bar).toMatchScreenshot();
    });

    // Trailing buttons — unfocused variant only
    it('renders a collapsed bar with trailing buttons', async () => {
      const screen = await renderComponent({ showTrailingButtons: true });

      // Given the search bar is collapsed
      const bar = screen.getByElement('sm-search-bar');
      await expect.element(bar).not.toHaveAttribute('data-expanded');

      // and the trailing icon button is visible
      const trailingButton = screen.getByRole('button', { name: 'Unfocused trailing button' });
      await expect.element(trailingButton).toBeVisible();

      await expect.element(bar).toMatchScreenshot();
    });

    // Custom leading button vs the default search icon
    it('renders a collapsed bar with a custom leading button', async () => {
      const screen = await renderComponent({ showLeadingButton: true });

      // Given the search bar is collapsed
      const bar = screen.getByElement('sm-search-bar');
      await expect.element(bar).not.toHaveAttribute('data-expanded');

      // and the custom leading button is visible
      const leadingButton = screen.getByRole('button', { name: 'Unfocused leading button' });
      await expect.element(leadingButton).toBeVisible();

      await expect.element(bar).toMatchScreenshot();
    });
  });
});
