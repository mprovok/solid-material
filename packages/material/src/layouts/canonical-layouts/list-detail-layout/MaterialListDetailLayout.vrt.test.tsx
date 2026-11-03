import type { FlowComponent, VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { For } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialIcon } from '../../../components/icon/MaterialIcon';
import { MaterialList } from '../../../components/list/MaterialList';
import { MaterialListItem } from '../../../components/list/MaterialListItem';
import { MaterialTheme } from '../../../styling/material-theme/MaterialTheme';
import { MaterialPane } from '../../pane/MaterialPane';

import type { MaterialListDetailLayoutProps } from './MaterialListDetailLayout';

import { MaterialListDetailLayout } from './MaterialListDetailLayout';

import AccountCircleFill from '@solidmaterial/icons/400/outlined/account_circle-fill.svg';

// Written by GLM 5.3 Flash

// How long to wait after rendering or interacting until the pane width
// transitions (which only run while the drag handle is active) have settled
const SETTLE_TRANSITIONS_MS = 800;

// Breakpoint-driven viewport sizes: compact < 600, medium 600-839, expanded
// 840-1199. Never request more than 1280x720 — larger sizes would be scaled
// down by the test orchestrator
const COMPACT_VIEWPORT = { width: 375, height: 667 };
const MEDIUM_VIEWPORT = { width: 800, height: 720 };
const EXPANDED_VIEWPORT = { width: 1024, height: 768 };

// The list fixture from MaterialListDetailLayout.stories.tsx: a segmented
// seven-item list
const ListPane: VoidComponent = () => (
  <aside style={{ 'min-height': '100%' }}>
    <MaterialList segmented={true}>
      <For each={Array.from({ length: 7 })}>
        {(_, index) => (
          <MaterialListItem
            start={
              <MaterialIcon>
                <AccountCircleFill />
              </MaterialIcon>
            }
            overlineText="Overline text"
            supportingText="Supporting text"
            align="top"
            onClick={vi.fn()}
          >
            Label {index()}
          </MaterialListItem>
        )}
      </For>
    </MaterialList>
  </aside>
);

const Wrapper: FlowComponent = props => (
  <MaterialTheme>
    <div
      style={{
        display: 'grid',
        height: '100vh',
        'background-color': 'var(--md-sys-color-surface-container)'
      }}
    >
      {props.children}
    </div>
  </MaterialTheme>
);

// Prepares a freshly rendered layout for its screenshot: waits for the fonts,
// parks the pointer so hover state from a previous test cannot leak into the
// screenshot, and waits for the pane width transitions to settle
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

// Waits for the pane width transitions after an interaction and parks the
// pointer so hover state from the interaction cannot leak into the screenshot
const settleTransitions = async (interactedAt: number) => {
  // Move the pointer to the top-left corner so that hover state from the
  // interaction does not leak into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 0, y: 0 } });

  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(interactedAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );
};

interface RenderLayoutOptions {
  viewport?: { width: number; height: number };
}

// Renders the stories' fixture: a list pane and a details pane on a
// surface-container background. The viewport is set explicitly before
// rendering because it persists across tests within this file: the layout
// picks its panes on first render
const renderComponent = async (
  props: Omit<MaterialListDetailLayoutProps, 'children'>,
  { viewport = EXPANDED_VIEWPORT }: RenderLayoutOptions = {}
) => {
  await page.viewport(viewport.width, viewport.height);

  const renderedAt = performance.now();

  const { baseElement } = render(
    () => (
      <MaterialListDetailLayout {...props} dragHandleAriaLabel={props.dragHandleAriaLabel ?? 'Drag handle'}>
        <MaterialPane>
          <ListPane />
        </MaterialPane>
        <MaterialPane>
          <main>Details</main>
        </MaterialPane>
      </MaterialListDetailLayout>
    ),
    { wrapper: Wrapper }
  );

  return settleRender(baseElement, renderedAt);
};

describe('MaterialListDetailLayout', () => {
  describe('Visual', () => {
    describe('Expanded width', () => {
      it('renders both panes', async () => {
        const screen = await renderComponent({ selected: false });

        // Given the drag handle and both panes are visible
        const separator = screen.getByRole('separator', { name: 'Drag handle' });
        await expect.element(separator).toBeVisible();
        await expect.element(screen.getByRole('complementary')).toBeVisible();
        await expect.element(screen.getByRole('main')).toBeVisible();

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });

      it('renders an activated drag handle', async () => {
        const screen = await renderComponent({ selected: false });

        const separator = screen.getByRole('separator', { name: 'Drag handle' });
        await expect.element(separator).toBeVisible();

        // When activating the drag handle with the keyboard
        const interactedAt = performance.now();
        await userEvent.click(separator);
        await userEvent.keyboard('{Enter}');

        // Then the drag handle is active
        await expect.element(separator.getByRole('presentation')).toHaveAttribute('data-active');
        await expect.element(screen.getByElement('sm-spacer')).toHaveAttribute('data-active');

        await settleTransitions(interactedAt);

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });

      it('renders a layout with a hidden list pane', async () => {
        const screen = await renderComponent({ selected: false });

        const separator = screen.getByRole('separator', { name: 'Drag handle' });
        await expect.element(separator).toBeVisible();

        // When activating the drag handle and moving it to the leftmost snap width
        const interactedAt = performance.now();
        await userEvent.click(separator);
        await userEvent.keyboard('{Enter}');
        await userEvent.keyboard('{ArrowLeft}');

        // Then the list pane is hidden and the detail pane is visible
        await expect.element(screen.getByRole('complementary')).not.toBeInTheDocument();
        await expect.element(screen.getByRole('main')).toBeVisible();

        await settleTransitions(interactedAt);

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });

      it('renders a layout with a hidden detail pane', async () => {
        const screen = await renderComponent({ selected: false });

        const separator = screen.getByRole('separator', { name: 'Drag handle' });
        await expect.element(separator).toBeVisible();

        // When activating the drag handle and moving it to the rightmost snap width
        const interactedAt = performance.now();
        await userEvent.click(separator);
        await userEvent.keyboard('{Enter}');
        await userEvent.keyboard('{ArrowRight}');
        await userEvent.keyboard('{ArrowRight}');

        // Then the detail pane is hidden and the list pane is visible
        await expect.element(screen.getByRole('complementary')).toBeVisible();
        await expect.element(screen.getByRole('main')).not.toBeInTheDocument();

        await settleTransitions(interactedAt);

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });

      it('renders a layout with a centered separator', async () => {
        const screen = await renderComponent({ selected: false });

        const separator = screen.getByRole('separator', { name: 'Drag handle' });
        await expect.element(separator).toBeVisible();

        // When double-clicking the drag handle, it moves to the preferred width
        const interactedAt = performance.now();
        await userEvent.dblClick(separator);

        // Then both panes are visible
        await expect.element(screen.getByRole('complementary')).toBeVisible();
        await expect.element(screen.getByRole('main')).toBeVisible();

        await settleTransitions(interactedAt);

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });
    });

    describe('Compact width', () => {
      it('renders only the list pane when not selected', async () => {
        const screen = await renderComponent({ selected: false }, { viewport: COMPACT_VIEWPORT });

        // Given one pane is shown
        const separator = screen.getByRole('separator', { name: 'Drag handle' });
        await expect.element(separator).not.toBeInTheDocument();

        // and it is the list pane
        await expect.element(screen.getByRole('complementary')).toBeVisible();
        await expect.element(screen.getByRole('main')).not.toBeInTheDocument();

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });

      it('renders only the detail pane when selected', async () => {
        const screen = await renderComponent({ selected: true }, { viewport: COMPACT_VIEWPORT });

        // Given one pane is shown
        const separator = screen.getByRole('separator', { name: 'Drag handle' });
        await expect.element(separator).not.toBeInTheDocument();

        // and it is the detail pane
        await expect.element(screen.getByRole('complementary')).not.toBeInTheDocument();
        await expect.element(screen.getByRole('main')).toBeVisible();

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });
    });

    describe('Medium width', () => {
      it('renders only the list pane', async () => {
        const screen = await renderComponent({ selected: false }, { viewport: MEDIUM_VIEWPORT });

        // Given one pane is shown
        const separator = screen.getByRole('separator', { name: 'Drag handle' });
        await expect.element(separator).not.toBeInTheDocument();

        // and it is the list pane
        await expect.element(screen.getByRole('complementary')).toBeVisible();
        await expect.element(screen.getByRole('main')).not.toBeInTheDocument();

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });

      it('renders both panes when preferSpace = horizontal', async () => {
        const screen = await renderComponent(
          { selected: false, preferSpace: 'horizontal' },
          { viewport: MEDIUM_VIEWPORT }
        );

        // Given the drag handle and both panes are visible
        const separator = screen.getByRole('separator', { name: 'Drag handle' });
        await expect.element(separator).toBeVisible();
        await expect.element(screen.getByRole('complementary')).toBeVisible();
        await expect.element(screen.getByRole('main')).toBeVisible();

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });
    });
  });
});
