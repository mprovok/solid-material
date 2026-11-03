import type { FlowComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialPane } from '../pane/MaterialPane';

import type { MaterialBodyLayoutProps, MaterialBodyLayoutVariant } from './MaterialBodyLayout';
import type { DragHandlePosition } from './MaterialBodyLayout.types';

import { MaterialBodyLayout } from './MaterialBodyLayout';

// Written by GLM 5.3 Flash

// How long to wait after rendering or interacting until the pane width
// transitions (which only run while the drag handle is active) have settled
const SETTLE_TRANSITIONS_MS = 800;

// The drag handle value formatter from MaterialBodyLayout.stories.tsx
const dragHandleAriaValue = (position: DragHandlePosition) =>
  position.percentage === 50 ? 'Center' : `${position.percentage}%`;

const Wrapper: FlowComponent = props => (
  <MaterialTheme>
    <div style={{ display: 'grid', height: '100vh' }}>{props.children}</div>
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
  // Single-pane fixture (mirrors the stories' OnePane story)
  singlePane?: boolean;
}

// Renders the stories' fixture on a full-height grid. The viewport is set
// explicitly before rendering because it persists across tests within this
// file: first-render breakpoint logic (the 16/24 margin choice) must compute
// against the final size
const renderComponent = async (
  props: Omit<MaterialBodyLayoutProps, 'children'>,
  { singlePane = false }: RenderLayoutOptions = {}
) => {
  await page.viewport(1024, 768);

  const renderedAt = performance.now();

  const { baseElement } = render(
    () => (
      <MaterialBodyLayout
        {...props}
        dragHandleAriaLabel={props.dragHandleAriaLabel ?? 'Drag handle'}
        dragHandleAriaValue={dragHandleAriaValue}
      >
        {singlePane ? (
          <MaterialPane>
            <main>Pane 1</main>
          </MaterialPane>
        ) : (
          <MaterialPane>
            <aside>Pane 1</aside>
          </MaterialPane>
        )}
        {singlePane ? undefined : (
          <MaterialPane>
            <main>Pane 2</main>
          </MaterialPane>
        )}
      </MaterialBodyLayout>
    ),
    { wrapper: Wrapper }
  );

  return settleRender(baseElement, renderedAt);
};

describe('MaterialBodyLayout', () => {
  describe('Visual', () => {
    it.each(['split', 'flexible-fixed', 'fixed-flexible'] satisfies MaterialBodyLayoutVariant[])(
      'renders a layout with variant $0',
      async variant => {
        const screen = await renderComponent({ variant });

        // Given the drag handle and both panes are visible
        const separator = screen.getByRole('separator', { name: 'Drag handle' });
        await expect.element(separator).toBeVisible();
        await expect.element(screen.getByRole('complementary')).toBeVisible();
        await expect.element(screen.getByRole('main')).toBeVisible();

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      }
    );

    // The flexible-flexible variant has no spacer and no drag handle
    it('renders a flexible-flexible layout without a drag handle', async () => {
      const screen = await renderComponent({ variant: 'flexible-flexible' });

      // Given both panes are visible
      await expect.element(screen.getByRole('complementary')).toBeVisible();
      await expect.element(screen.getByRole('main')).toBeVisible();

      // and there is no drag handle
      const separator = screen.getByRole('separator', { name: 'Drag handle' });
      await expect.element(separator).not.toBeInTheDocument();

      await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
    });

    it('renders a layout without a drag handle when showDragHandle = false', async () => {
      const screen = await renderComponent({ variant: 'fixed-flexible', showDragHandle: false });

      // Given an empty spacer is rendered instead of a drag handle
      const separator = screen.getByRole('separator', { name: 'Drag handle' });
      await expect.element(separator).not.toBeInTheDocument();

      await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
    });

    it('renders a single pane at full width', async () => {
      const screen = await renderComponent({ variant: 'flexible-fixed', showDragHandle: false }, { singlePane: true });

      // Given the single main pane is visible
      await expect.element(screen.getByRole('main')).toBeVisible();

      // and there is no list pane and no drag handle
      await expect.element(screen.getByRole('complementary')).not.toBeInTheDocument();
      const separator = screen.getByRole('separator', { name: 'Drag handle' });
      await expect.element(separator).not.toBeInTheDocument();

      await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
    });

    it('renders a layout with full-bleed panes when rounded = false', async () => {
      const screen = await renderComponent({ variant: 'fixed-flexible', rounded: false });

      // Given the drag handle and both panes are visible
      const separator = screen.getByRole('separator', { name: 'Drag handle' });
      await expect.element(separator).toBeVisible();
      await expect.element(screen.getByRole('complementary')).toBeVisible();
      await expect.element(screen.getByRole('main')).toBeVisible();

      await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
    });

    it('renders an activated drag handle', async () => {
      const screen = await renderComponent({ variant: 'fixed-flexible' });

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

    it('renders a layout with a hidden left pane', async () => {
      const screen = await renderComponent({ variant: 'fixed-flexible' });

      const separator = screen.getByRole('separator', { name: 'Drag handle' });
      await expect.element(separator).toBeVisible();

      // When activating the drag handle and moving it to the leftmost snap width
      const interactedAt = performance.now();
      await userEvent.click(separator);
      await userEvent.keyboard('{Enter}');
      await userEvent.keyboard('{ArrowLeft}');

      // Then the left pane is hidden and the main pane is visible
      await expect.element(screen.getByRole('complementary')).not.toBeInTheDocument();
      await expect.element(screen.getByRole('main')).toBeVisible();

      await settleTransitions(interactedAt);

      await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
    });

    it('renders a layout with a centered separator', async () => {
      const screen = await renderComponent({ variant: 'fixed-flexible' });

      const separator = screen.getByRole('separator', { name: 'Drag handle' });
      await expect.element(separator).toBeVisible();

      // When double-clicking the drag handle, it moves to the preferred width
      const interactedAt = performance.now();
      await userEvent.dblClick(separator);

      // Then the separator is visually centered
      await expect.element(separator).toHaveAttribute('aria-valuetext', 'Center');

      // and both panes are visible
      await expect.element(screen.getByRole('complementary')).toBeVisible();
      await expect.element(screen.getByRole('main')).toBeVisible();

      await settleTransitions(interactedAt);

      await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
    });
  });
});
