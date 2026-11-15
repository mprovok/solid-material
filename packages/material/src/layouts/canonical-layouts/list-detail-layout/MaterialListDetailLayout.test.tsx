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

// Breakpoint-driven viewport sizes: compact < 600, expanded 840-1199. Never
// request more than 1280x720 — larger sizes would be scaled down by the test
// orchestrator. The viewport persists across tests within this file, so it is
// set explicitly before every render: the layout picks its panes on first
// render
const COMPACT_VIEWPORT = { width: 375, height: 667 };
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

interface RenderLayoutOptions {
  viewport?: { width: number; height: number };
}

// Renders the stories' fixture: a list pane and a details pane on a
// surface-container background. The viewport is set explicitly before
// rendering so no test inherits a previous test's size
const renderComponent = async (
  props: Omit<MaterialListDetailLayoutProps, 'children'>,
  { viewport = EXPANDED_VIEWPORT }: RenderLayoutOptions = {}
) => {
  await page.viewport(viewport.width, viewport.height);

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

  await document.fonts.ready;

  return page.elementLocator(baseElement);
};

describe('MaterialListDetailLayout', () => {
  describe('Interaction', () => {
    it('activates and deactivates the drag handle with the keyboard', async () => {
      const screen = await renderComponent({ selected: false });

      // Given the drag handle is focused
      const separator = screen.getByRole('separator', { name: 'Drag handle' });
      await expect.element(separator).toBeVisible();

      separator.element().focus();
      await expect.element(separator).toHaveFocus();

      // and its presentation button is not active
      const button = separator.getByRole('presentation');
      await expect.element(button).not.toHaveAttribute('data-active');

      // When pressing Enter
      await userEvent.keyboard('{Enter}');

      // Then the presentation button is active
      await expect.element(button).toHaveAttribute('data-active');

      // When pressing Enter again
      await userEvent.keyboard('{Enter}');

      // Then the presentation button is no longer active
      await expect.element(button).not.toHaveAttribute('data-active');
    });

    it('hides and shows panes with arrow keys while the drag handle is active', async () => {
      const screen = await renderComponent({ selected: false });

      // Given the drag handle is active
      const separator = screen.getByRole('separator', { name: 'Drag handle' });
      await expect.element(separator).toBeVisible();

      separator.element().focus();
      await expect.element(separator).toHaveFocus();

      await userEvent.keyboard('{Enter}');
      await expect.element(separator.getByRole('presentation')).toHaveAttribute('data-active');

      // When moving the separator to the leftmost snap width
      await userEvent.keyboard('{ArrowLeft}');

      // Then the list pane is gone and the detail pane is visible
      await vi.waitFor(async () => {
        await expect.element(screen.getByRole('complementary')).not.toBeInTheDocument();
      });
      await expect.element(screen.getByRole('main')).toBeVisible();

      // When moving the separator one snap width back to the right
      await userEvent.keyboard('{ArrowRight}');

      // Then both panes are visible again
      await vi.waitFor(async () => {
        await expect.element(screen.getByRole('complementary')).toBeInTheDocument();
      });
      await expect.element(screen.getByRole('main')).toBeVisible();

      // When moving the separator to the rightmost snap width
      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowRight}');

      // Then the detail pane is gone and the list pane is visible
      await vi.waitFor(async () => {
        await expect.element(screen.getByRole('main')).not.toBeInTheDocument();
      });
      await expect.element(screen.getByRole('complementary')).toBeVisible();
    });

    it('resets both panes by double-clicking the separator', async () => {
      const screen = await renderComponent({ selected: false });

      // Given the drag handle is active and the detail pane is hidden
      const separator = screen.getByRole('separator', { name: 'Drag handle' });
      await expect.element(separator).toBeVisible();

      separator.element().focus();
      await expect.element(separator).toHaveFocus();

      await userEvent.keyboard('{Enter}');
      await expect.element(separator.getByRole('presentation')).toHaveAttribute('data-active');

      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowRight}');
      await vi.waitFor(async () => {
        await expect.element(screen.getByRole('main')).not.toBeInTheDocument();
      });

      // When deactivating the drag handle and double-clicking the separator
      await userEvent.keyboard('{Enter}');
      await expect.element(separator.getByRole('presentation')).not.toHaveAttribute('data-active');

      await userEvent.dblClick(separator);

      // Then both panes are visible again
      await vi.waitFor(async () => {
        await expect.element(screen.getByRole('main')).toBeInTheDocument();
      });
      await expect.element(screen.getByRole('complementary')).toBeVisible();
    });
  });

  describe('Compact width', () => {
    it('shows only the list pane when not selected', async () => {
      const screen = await renderComponent({ selected: false }, { viewport: COMPACT_VIEWPORT });

      // Given the viewport is compact, no separator is rendered
      const separator = screen.getByRole('separator', { name: 'Drag handle' });
      await expect.element(separator).not.toBeInTheDocument();

      // Then only the list pane is visible
      await expect.element(screen.getByRole('complementary')).toBeVisible();
      await expect.element(screen.getByRole('main')).not.toBeInTheDocument();
    });

    it('shows only the detail pane when selected', async () => {
      const screen = await renderComponent({ selected: true }, { viewport: COMPACT_VIEWPORT });

      // Given the viewport is compact, no separator is rendered
      const separator = screen.getByRole('separator', { name: 'Drag handle' });
      await expect.element(separator).not.toBeInTheDocument();

      // Then only the detail pane is visible
      await expect.element(screen.getByRole('complementary')).not.toBeInTheDocument();
      await expect.element(screen.getByRole('main')).toBeVisible();
    });
  });
});
