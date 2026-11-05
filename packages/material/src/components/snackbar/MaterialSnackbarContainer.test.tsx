import { render } from '@solidjs/testing-library';
import { createStore } from 'solid-js/store';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialSnack } from './MaterialSnackbarContext';

import { MaterialSnackbarContainer } from './MaterialSnackbarContainer';
import { MaterialSnackbarContext } from './MaterialSnackbarContext';

import styles from './MaterialSnackbarContainer.stories.module.css';

// Written by GLM 5.3 Flash

interface RenderContainerOptions {
  alignment?: 'start' | 'center';
  closeTitle?: string;
  snack: MaterialSnack;
}

// Mirrors the layout from MaterialSnackbarContainer.vrt.test.tsx: the story box
// positions the popover, and the container div declares the anchor names the
// modal's position-anchor needs. The snack is enqueued directly in a
// test-local store: the context's module-level default store would leak state
// between tests
const renderContainer = async ({ alignment, closeTitle, snack }: RenderContainerOptions) => {
  // oxlint-disable-next-line no-unassigned-vars
  let storyRef!: HTMLDivElement;

  const [state, setState] = createStore<MaterialSnack[]>([]);
  setState(0, snack);

  const { baseElement } = render(
    () => (
      <MaterialSnackbarContext.Provider value={[state, setState]}>
        <div ref={storyRef} class={styles['story']}>
          <div class={styles['container']}>
            <MaterialSnackbarContainer alignment={alignment} closeTitle={closeTitle} />
          </div>
        </div>
      </MaterialSnackbarContext.Provider>
    ),
    { wrapper: MaterialTheme }
  );

  await document.fonts.ready;

  const screen = page.elementLocator(baseElement);

  // Given the snackbar has entered the screen as a popover
  const status = screen.getByRole('status');
  await vi.waitFor(
    async () => {
      await expect.element(status).toBeVisible();
    },
    { timeout: 3000 }
  );

  return { screen, story: page.elementLocator(storyRef), state, setState };
};

const FIRST_SNACK: MaterialSnack = {
  text: 'First snack',
  dismissable: false,
  duration: 'indefinite'
};

describe('MaterialSnackbarContainer', () => {
  describe('Interaction', () => {
    it('closes a dismissable snack via the close button', async () => {
      const { screen, story, state } = await renderContainer({
        closeTitle: 'Close',
        snack: { ...FIRST_SNACK, dismissable: true }
      });

      // Given the snack's close button is visible
      const close = story.getByRole('button', { name: 'Close' });
      await expect.element(close).toBeVisible();

      // When the close button is clicked
      await userEvent.click(close);

      // Then the snack leaves the screen via its exit transition
      // (or the fallback timeout when no transition end event is emitted)
      await vi.waitFor(
        async () => {
          await expect.element(screen.getByRole('status')).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // and the store no longer holds the snack
      expect(state.length).toBe(0);
    });

    it('closes a snack without closeTitle via its action', async () => {
      const onAction = vi.fn();
      const { screen, story, state } = await renderContainer({
        snack: { ...FIRST_SNACK, action: { label: 'Undo', onClick: onAction } }
      });

      // Given the snack without a close button but with its action button
      await expect.element(story.getByRole('button', { name: 'Close' })).not.toBeInTheDocument();
      const action = story.getByRole('button', { name: 'Undo' });
      await expect.element(action).toBeVisible();

      // When the action button is clicked
      await userEvent.click(action);

      // Then the action's onClick is called
      expect(onAction).toHaveBeenCalledOnce();

      // and the snack leaves the screen via its exit transition
      await vi.waitFor(
        async () => {
          await expect.element(screen.getByRole('status')).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // and the store no longer holds the snack
      expect(state.length).toBe(0);
    });

    it('shows a new snack after the previous one exits', async () => {
      const { screen, story, state, setState } = await renderContainer({
        closeTitle: 'Close',
        snack: { ...FIRST_SNACK, dismissable: true }
      });

      // Given the first snack left the screen
      await userEvent.click(story.getByRole('button', { name: 'Close' }));
      await vi.waitFor(
        async () => {
          await expect.element(screen.getByRole('status')).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
      expect(state.length).toBe(0);

      // When a new snack is enqueued after the previous one exited
      setState(0, { text: 'Second snack', dismissable: false, duration: 'indefinite' });

      // Then the new snack enters the screen with its own text
      const status = screen.getByRole('status');
      await vi.waitFor(
        async () => {
          await expect.element(status).toBeVisible();
          await expect.element(status).toHaveTextContent('Second snack');
        },
        { timeout: 3000 }
      );
    });
  });
});
