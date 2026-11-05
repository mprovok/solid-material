import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialButton } from '../../../components/button/MaterialButton';
import { MaterialTheme } from '../../../styling/material-theme/MaterialTheme';

import type { MaterialSupportingPaneProps } from './MaterialSupportingPane';

import { MaterialSupportingPane } from './MaterialSupportingPane';

// Written by GLM 5.3 Flash

// Breakpoint-driven viewport sizes: compact < 600, medium 600-839, expanded
// 840-1199. Never request more than 1280x720 — larger sizes would be scaled
// down by the test orchestrator
const COMPACT_VIEWPORT = { width: 375, height: 667 };
const EXPANDED_VIEWPORT = { width: 1024, height: 768 };

interface RenderPaneOptions {
  viewport?: { width: number; height: number };
}

// The viewport is set explicitly before rendering because it persists across
// tests within this file: the supporting pane picks its side sheet, inline
// aside, or bottom sheet rendering on first render
const renderPane = async (
  props: Omit<MaterialSupportingPaneProps, 'children'>,
  { viewport = EXPANDED_VIEWPORT }: RenderPaneOptions = {}
) => {
  await page.viewport(viewport.width, viewport.height);

  const { baseElement, unmount } = render(
    () => (
      <MaterialSupportingPane {...props}>
        <div>Supporting content</div>
      </MaterialSupportingPane>
    ),
    { wrapper: MaterialTheme }
  );

  await document.fonts.ready;

  return { screen: page.elementLocator(baseElement), unmount };
};

// A controlled supporting pane whose open state is owned by a signal, with a
// toggle button to flip it
const ControlledPaneFixture: VoidComponent<{ initialOpen: boolean; onClose: () => void }> = props => {
  const [getOpen, setOpen] = createSignal(props.initialOpen);

  return (
    <>
      <MaterialSupportingPane variant="standard" open={getOpen()} onClose={props.onClose}>
        <div>Supporting content</div>
      </MaterialSupportingPane>
      <MaterialButton variant="tonal" onClick={() => setOpen(value => !value)}>
        Toggle
      </MaterialButton>
    </>
  );
};

describe('MaterialSupportingPane', () => {
  describe('Side sheet', () => {
    it('closes an uncontrolled modal side sheet via its close button', async () => {
      const onClose = vi.fn();
      const { screen } = await renderPane({ variant: 'modal', onClose });

      // Given the open side sheet is visible (open defaults to true)
      const sheet = screen.getByRole('complementary');
      await expect.element(sheet).toBeVisible();
      expect(onClose).not.toHaveBeenCalled();

      // When the close icon button is clicked (it has no accessible name,
      // SupportingPane does not pass closeButtonAriaLabel)
      await userEvent.click(screen.getByElement('sm-icon-button'));

      // Then the side sheet closes its dialog after a short delay and the
      // dialog's toggle event invokes onClose
      await vi.waitFor(() => expect(onClose).toHaveBeenCalledOnce(), { timeout: 3000 });
    });

    it('propagates onClose from the close button of a standard side sheet', async () => {
      const onClose = vi.fn();
      const { screen } = await renderPane({ variant: 'standard', onClose });

      // Given the open standard side sheet with its close button is visible
      const sheet = screen.getByRole('complementary');
      await expect.element(sheet).toBeVisible();
      const closeButton = screen.getByElement('sm-icon-button');
      await expect.element(closeButton).toBeVisible();
      expect(onClose).not.toHaveBeenCalled();

      // When the close icon button is clicked
      await userEvent.click(closeButton);

      // Then onClose is called once the dialog has closed
      await vi.waitFor(() => expect(onClose).toHaveBeenCalledOnce(), { timeout: 3000 });
    });
  });

  describe('Bottom sheet', () => {
    it('closes a modal bottom sheet on compact width', async () => {
      const onClose = vi.fn();
      const { screen } = await renderPane(
        { variant: 'modal', dragHandle: true, dragHandleAriaLabel: 'Drag handle', onClose },
        { viewport: COMPACT_VIEWPORT }
      );

      // Given the bottom sheet and its drag handle are visible
      const sheet = screen.getByRole('complementary');
      await expect.element(sheet).toBeVisible();

      const handle = screen.getByRole('separator', { name: 'Drag handle' });
      await expect.element(handle).toBeVisible();
      expect(onClose).not.toHaveBeenCalled();

      // When the modal dialog is dismissed with Escape (closedby="any")
      await userEvent.keyboard('{Escape}');

      // Then onClose is called once the dialog has closed
      await vi.waitFor(() => expect(onClose).toHaveBeenCalledOnce(), { timeout: 3000 });
    });
  });

  describe('Controlled open prop', () => {
    it('syncs a controlled open prop', async () => {
      const onClose = vi.fn();

      await page.viewport(COMPACT_VIEWPORT.width, COMPACT_VIEWPORT.height);

      const { baseElement } = render(() => <ControlledPaneFixture initialOpen={false} onClose={onClose} />, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);
      await document.fonts.ready;

      // Given the closed inline aside on compact width
      const aside = screen.getByElement('aside');
      await expect.element(aside).toBeVisible();
      await expect.element(aside).not.toHaveAttribute('data-open');

      // When the open signal flips to true
      await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));

      // Then the aside carries the data-open attribute
      await expect.element(aside).toHaveAttribute('data-open');

      // and onClose was never called
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
