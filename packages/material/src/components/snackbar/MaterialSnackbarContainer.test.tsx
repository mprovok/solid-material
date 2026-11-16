import { render } from '@solidjs/testing-library';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialButton } from '../button/MaterialButton';

import type { MaterialSnack } from './MaterialSnackbarContext';

import { MaterialSnackbarContainer } from './MaterialSnackbarContainer';
import { showSnack, snackStore } from './MaterialSnackbarContext';

import styles from './MaterialSnackbarContainer.stories.module.css';

// Written by GLM 5.3 Flash

afterEach(() => {
  // Clear the module-level snack store so state does not leak between tests
  const [, setState] = snackStore;
  setState(() => []);
});

interface RenderContainerOptions {
  alignment?: 'start' | 'center';
  closeTitle?: string;
  snack: MaterialSnack;
}

// Mirrors the layout from MaterialSnackbarContainer.vrt.test.tsx: the story box
// positions the popover, and the container div declares the anchor names the
// modal's position-anchor needs. The snack is enqueued directly in the
// module-level snack store, which the afterEach hook resets so state cannot
// leak between tests
const renderContainer = async ({ alignment, closeTitle, snack }: RenderContainerOptions) => {
  // oxlint-disable-next-line no-unassigned-vars
  let storyRef!: HTMLDivElement;

  const [, setSnacks] = snackStore;
  setSnacks(() => [snack]);

  const { baseElement, container } = render(
    () => (
      <div ref={storyRef} class={styles['story']}>
        <div class={styles['container']}>
          <MaterialSnackbarContainer alignment={alignment} closeTitle={closeTitle} />
        </div>
      </div>
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

  return { container, screen, story: page.elementLocator(storyRef), state: snackStore[0] };
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
      const { screen, story, state } = await renderContainer({
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
      showSnack({ text: 'Second snack', dismissable: false, duration: 'indefinite' });

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

    it('shows a snack via showSnack and dismisses it through its action', async () => {
      const onAction = vi.fn();

      // oxlint-disable-next-line no-unassigned-vars
      let storyRef!: HTMLDivElement;

      // This test uses the module-level snack store through showSnack to mirror
      // the Example story's play function, which calls showSnack from a click
      // handler
      const { baseElement } = render(
        () => (
          <div ref={storyRef} class={styles['story']}>
            <div style={{ padding: '1rem' }}>
              <MaterialButton
                variant="tonal"
                onClick={() => {
                  showSnack({
                    text: 'Supporting text',
                    dismissable: true,
                    duration: 'indefinite',
                    action: { label: 'Action', onClick: onAction }
                  });
                }}
              >
                Dismissable with action
              </MaterialButton>
            </div>
            <div class={styles['container']}>
              <MaterialSnackbarContainer alignment="start" />
            </div>
          </div>
        ),
        { wrapper: MaterialTheme }
      );

      await document.fonts.ready;

      const screen = page.elementLocator(baseElement);
      const story = page.elementLocator(storyRef);

      // Given the trigger button is visible
      const trigger = story.getByRole('button', { name: 'Dismissable with action' });
      await expect.element(trigger).toBeVisible();

      // When the trigger button calls showSnack
      await userEvent.click(trigger);

      // Then the snack enters the screen as a popover
      const status = screen.getByRole('status');
      await vi.waitFor(
        async () => {
          await expect.element(status).toBeVisible();
          await expect.element(status).toHaveTextContent('Supporting text');
        },
        { timeout: 3000 }
      );

      // When the snack's action button is clicked (an exact name match: the
      // trigger 'Dismissable with action' would also match a non-exact query)
      const action = story.getByRole('button', { name: 'Action', exact: true });
      await expect.element(action).toBeVisible();
      await userEvent.click(action);

      // Then the action's onClick is called once
      expect(onAction).toHaveBeenCalledOnce();

      // and the snack leaves the screen via its exit transition
      // (or the fallback timeout when no transition end event is emitted)
      await vi.waitFor(
        async () => {
          await expect.element(screen.getByRole('status')).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Accessibility', () => {
    it('exposes the snack as a polite live region labelled by its text', async () => {
      const { container, screen, story } = await renderContainer({ snack: { ...FIRST_SNACK } });

      // Given the plain snack is visible as a status live region
      const status = screen.getByRole('status');
      await expect.element(status).toBeVisible();
      await expect.element(status).toHaveAttribute('aria-live', 'polite');
      await expect.element(status).toHaveAttribute('aria-atomic', 'true');

      // and its aria-labelledby points at the snack's text span inside it
      const labelledBy = status.element().getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();
      const text = story.getByText('First snack');
      expect(text.element().id).toBe(labelledBy);
      expect(status.element().contains(text.element())).toBe(true);

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('labels the action and close buttons of a snack', async () => {
      const onAction = vi.fn();
      const { container, story } = await renderContainer({
        closeTitle: 'Close',
        snack: { ...FIRST_SNACK, action: { label: 'Undo', onClick: onAction }, dismissable: true }
      });

      // Given the snack is visible with both its action button and close button exposed by name
      const action = story.getByRole('button', { name: 'Undo' });
      await expect.element(action).toBeVisible();
      const close = story.getByRole('button', { name: 'Close' });
      await expect.element(close).toBeVisible();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
