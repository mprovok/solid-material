import type { FlowComponent, VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { Show, createSignal } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialButton } from '../../../components/button/MaterialButton';
import { MaterialTheme } from '../../../styling/material-theme/MaterialTheme';
import { MaterialPane } from '../../pane/MaterialPane';

import type { MaterialSupportingPaneProps } from './MaterialSupportingPane';

import { MaterialSupportingPane } from './MaterialSupportingPane';
import { MaterialSupportingPaneLayout } from './MaterialSupportingPaneLayout';

// Written by GLM 5.3 Flash

// How long to wait after rendering or interacting until the opening
// transitions have settled: the layout animates its grid gap and the stacked
// pane animates its max-height, the side sheet reveals its content by
// animating grid-template-columns, and the bottom sheet scrolls into view —
// none of which change the screenshot target's bounding box, so the element
// screenshot's stability wait does not cover them
const SETTLE_TRANSITIONS_MS = 800;

// Breakpoint-driven viewport sizes: compact < 600, medium 600-839, expanded
// 840-1199. Never request more than 1280x720 — larger sizes would be scaled
// down by the test orchestrator
const COMPACT_VIEWPORT = { width: 375, height: 667 };
const EXPANDED_VIEWPORT = { width: 1024, height: 768 };

// The controlled renderer from MaterialSupportingPaneLayout.stories.tsx: the
// open state is owned by a signal, with a toggle button for controlled cases
const PaneLayoutRenderer: VoidComponent<Omit<MaterialSupportingPaneProps, 'onClose'>> = args => {
  const [isOpen, setOpen] = createSignal(args.open);

  const onClose = () => setOpen(false);
  const onClickButton = () => setOpen(value => (value !== undefined ? !value : undefined));

  return (
    <MaterialSupportingPaneLayout rounded>
      <MaterialPane>
        <main style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem', 'align-items': 'start' }}>
          <span>Main content</span>
          <Show when={args.open !== undefined}>
            <MaterialButton variant="tonal" toggle={isOpen()} onClick={onClickButton}>
              Toggle supporting pane
            </MaterialButton>
          </Show>
        </main>
      </MaterialPane>
      <MaterialSupportingPane {...args} open={isOpen()} onClose={args.open !== undefined ? onClose : undefined}>
        <div>Supporting content</div>
      </MaterialSupportingPane>
    </MaterialSupportingPaneLayout>
  );
};

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
// screenshot, and waits for the opening transitions to settle
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

// Waits for the opening transitions after an interaction and parks the
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

// The viewport is set explicitly before rendering because it persists across
// tests within this file: the supporting pane picks its side sheet, inline
// aside, or bottom sheet rendering on first render
const renderComponent = async (
  props: Omit<MaterialSupportingPaneProps, 'onClose'>,
  { viewport = EXPANDED_VIEWPORT }: RenderLayoutOptions = {}
) => {
  await page.viewport(viewport.width, viewport.height);

  const renderedAt = performance.now();

  const { baseElement } = render(() => <PaneLayoutRenderer {...props} />, { wrapper: Wrapper });

  return settleRender(baseElement, renderedAt);
};

describe('MaterialSupportingPaneLayout', () => {
  describe('Visual', () => {
    describe('Expanded width', () => {
      it('renders an open standard side sheet', async () => {
        const screen = await renderComponent({ variant: 'standard', open: true });

        // Given the side sheet is visible with its content
        const sheet = screen.getByRole('complementary');
        await expect.element(sheet).toBeVisible();
        await expect.element(screen.getByText('Supporting content')).toBeVisible();

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });

      it('renders an open standard side sheet with a title', async () => {
        const screen = await renderComponent({ variant: 'standard', title: 'Title', open: true });

        // Given the side sheet is visible with its title
        const sheet = screen.getByRole('complementary');
        await expect.element(sheet).toBeVisible();
        await expect.element(screen.getByText('Title')).toBeVisible();

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });

      it('renders an open modal side sheet with a scrim', async () => {
        const screen = await renderComponent({ variant: 'modal', open: true });

        // Given the side sheet is visible
        const sheet = screen.getByRole('complementary');
        await expect.element(sheet).toBeVisible();

        // Screenshot the rendered area instead of the layout: the scrim is
        // painted by the dialog's ::backdrop and covers the viewport
        const dialog = screen.getByElement('dialog');
        await expect.element(dialog).toBeVisible();

        await expect.element(screen).toMatchScreenshot();
      });

      it('renders a closed standard side sheet', async () => {
        const screen = await renderComponent({ variant: 'standard', open: false });

        // Given the side sheet is hidden
        const sheet = screen.getByRole('complementary', { includeHidden: true });
        await expect.element(sheet).not.toBeVisible();

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });

      it('renders an opened side sheet via the toggle button', async () => {
        const screen = await renderComponent({ variant: 'standard', open: false });

        // Given the side sheet is hidden
        const sheet = screen.getByRole('complementary', { includeHidden: true });
        await expect.element(sheet).not.toBeVisible();

        // When clicking the toggle button
        const interactedAt = performance.now();
        const toggle = screen.getByRole('switch', { name: 'Toggle supporting pane' });
        await expect.element(toggle).toBeVisible();
        await userEvent.click(toggle);
        await userEvent.unhover(toggle);

        // Then the side sheet is visible
        await expect.element(screen.getByRole('complementary')).toBeVisible();

        await settleTransitions(interactedAt);

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });
    });

    describe('Compact width', () => {
      it('renders an open inline supporting pane', async () => {
        const screen = await renderComponent({ variant: 'standard', open: true }, { viewport: COMPACT_VIEWPORT });

        // Given the supporting pane is an inline aside below the main content
        const aside = screen.getByRole('complementary');
        await expect.element(aside).toBeVisible();
        await expect.element(screen.getByText('Supporting content')).toBeVisible();

        await expect.element(screen.getByElement('sm-body-layout')).toMatchScreenshot();
      });

      it('renders an open modal bottom sheet with a scrim', async () => {
        const screen = await renderComponent({ variant: 'modal', open: true }, { viewport: COMPACT_VIEWPORT });

        // Given the supporting pane is a modal bottom sheet with its content
        const sheet = screen.getByRole('complementary');
        await expect.element(sheet).toBeVisible();
        await expect.element(screen.getByText('Supporting content')).toBeVisible();

        // Screenshot the rendered area instead of the layout: the scrim is
        // painted by the dialog's ::backdrop and covers the viewport
        const dialog = screen.getByElement('dialog');
        await expect.element(dialog).toBeVisible();

        await expect.element(screen).toMatchScreenshot();
      });
    });
  });
});
