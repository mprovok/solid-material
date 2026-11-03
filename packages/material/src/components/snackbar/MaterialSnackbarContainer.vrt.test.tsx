import { render } from '@solidjs/testing-library';
import { createStore } from 'solid-js/store';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialSnackbarContainerAlignment } from './MaterialSnackbarContainer';
import type { MaterialSnack } from './MaterialSnackbarContext';

import { MaterialSnackbarContainer } from './MaterialSnackbarContainer';
import { MaterialSnackbarContext } from './MaterialSnackbarContext';

import styles from './MaterialSnackbarContainer.stories.module.css';

// Written by GLM 5.3 Flash

const emptyFn = () => {
  // Empty
};

// How long to wait after rendering until the enter transition of the snackbar
// has settled: the snackbar animates its height and opacity after it is shown
// as a popover, which does not change the screenshot target's bounding box, so
// the element screenshot's stability wait does not cover it
const SETTLE_TRANSITIONS_MS = 800;

interface RenderSnackProps {
  alignment?: MaterialSnackbarContainerAlignment;
  snack: MaterialSnack;
}

// Mirrors the layout from MaterialSnackbarContainer.stories.tsx: the story box
// positions the popover, and the container div declares the anchor names the
// modal's position-anchor needs. The snack is enqueued directly in a
// test-local store: the context's module-level default store would leak state
// between tests, and showSnack's only logic is the same setState call
const renderComponent = async (props: RenderSnackProps) => {
  const renderedAt = performance.now();

  // oxlint-disable-next-line no-unassigned-vars
  let storyRef!: HTMLDivElement;

  const [state, setState] = createStore<MaterialSnack[]>([]);
  setState(0, props.snack);

  const { baseElement } = render(
    () => (
      <MaterialSnackbarContext.Provider value={[state, setState]}>
        <div ref={storyRef} class={styles['story']}>
          <div class={styles['container']}>
            <MaterialSnackbarContainer alignment={props.alignment} closeTitle="Close" />
          </div>
        </div>
      </MaterialSnackbarContext.Provider>
    ),
    { wrapper: MaterialTheme }
  );

  await document.fonts.ready;
  // Move the pointer to the middle of the page so that hover state from a
  // previous test or the browser's initial pointer position does not leak
  // into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 400, y: 300 } });
  const screen = page.elementLocator(baseElement);

  // Given the snackbar has entered the screen as a popover
  const status = screen.getByRole('status');
  await vi.waitFor(async () => {
    await expect.element(status).toBeVisible();
  });

  // and its enter transition has settled
  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(renderedAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );

  // The snackbar is a popover fixed to the anchors inside the story box, so
  // it paints within the story box which is the screenshot target
  return page.elementLocator(storyRef);
};

const BASE_SNACK: MaterialSnack = {
  text: 'Supporting text',
  dismissable: false,
  duration: 'indefinite'
};

describe('MaterialSnackbarContainer', () => {
  describe('Visual', () => {
    it('renders a snack with supporting text only', async () => {
      const story = await renderComponent({ snack: BASE_SNACK });

      await expect.element(story).toMatchScreenshot();
    });

    it('renders a snack with an action', async () => {
      const story = await renderComponent({
        snack: { ...BASE_SNACK, action: { label: 'Action', onClick: emptyFn } }
      });

      // Given the action button is visible
      const action = story.getByRole('button', { name: 'Action' });
      await expect.element(action).toBeVisible();

      await expect.element(story).toMatchScreenshot();
    });

    it('renders a dismissable snack', async () => {
      const story = await renderComponent({ snack: { ...BASE_SNACK, dismissable: true } });

      // Given the close button is visible
      const close = story.getByRole('button', { name: 'Close' });
      await expect.element(close).toBeVisible();

      await expect.element(story).toMatchScreenshot();
    });

    it('renders a dismissable snack with an action', async () => {
      const story = await renderComponent({
        snack: { ...BASE_SNACK, dismissable: true, action: { label: 'Action', onClick: emptyFn } }
      });

      // Given the action button is visible
      const action = story.getByRole('button', { name: 'Action' });
      await expect.element(action).toBeVisible();

      // and the close button is visible
      const close = story.getByRole('button', { name: 'Close' });
      await expect.element(close).toBeVisible();

      await expect.element(story).toMatchScreenshot();
    });

    it('renders a snack aligned to the center', async () => {
      const story = await renderComponent({ alignment: 'center', snack: BASE_SNACK });

      await expect.element(story).toMatchScreenshot();
    });
  });
});
