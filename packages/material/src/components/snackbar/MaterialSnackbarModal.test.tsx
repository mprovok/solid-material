import { render } from '@solidjs/testing-library';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialSnack } from './MaterialSnackbarContext';

import { MaterialSnackbarModal } from './MaterialSnackbarModal';

// Written by GLM 5.3 Flash

interface RenderModalOptions {
  snack: MaterialSnack;
  closeTitle?: string;
  onClose: () => void;
}

const renderModal = ({ snack, closeTitle, onClose }: RenderModalOptions) => {
  const { baseElement, unmount } = render(
    () => <MaterialSnackbarModal snack={snack} closeTitle={closeTitle} onClose={onClose} />,
    { wrapper: MaterialTheme }
  );

  const screen = page.elementLocator(baseElement);

  // The modal renders as a hidden popover and the snackbar inside it as
  // display: none until it is marked as shown: mirror SnackbarTransition's
  // onEnter, otherwise the buttons are not visible or clickable
  const snackbar = screen.getByElement('sm-snackbar').element();
  const popover = snackbar.closest('div[popover]');
  if (!(popover instanceof HTMLElement)) {
    throw new Error('Expected the snackbar modal to render a popover element');
  }
  popover.showPopover();
  snackbar.dataset['show'] = '';

  return { screen, unmount, onClose };
};

afterEach(() => {
  vi.useRealTimers();
});

describe('MaterialSnackbarModal', () => {
  describe('Action snack', () => {
    it('invokes the action onClick and closes', async () => {
      const onAction = vi.fn();
      const onClose = vi.fn();
      const { screen } = renderModal({
        snack: {
          text: 'Snack',
          dismissable: false,
          duration: 'indefinite',
          action: { label: 'Undo', onClick: onAction }
        },
        onClose
      });

      // Given the snack with its action button is visible
      const action = screen.getByRole('button', { name: 'Undo' });
      await expect.element(action).toBeVisible();
      expect(onAction).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();

      // When the action button is clicked
      await userEvent.click(action);

      // Then the action's onClick and the modal's onClose are called
      expect(onAction).toHaveBeenCalledOnce();
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('Dismissable snack', () => {
    it('closes via the close button', async () => {
      const onClose = vi.fn();
      const { screen } = renderModal({
        snack: { text: 'Snack', dismissable: true, duration: 'indefinite' },
        closeTitle: 'Close',
        onClose
      });

      // Given the snack with its close button is visible
      const close = screen.getByRole('button', { name: 'Close' });
      await expect.element(close).toBeVisible();
      expect(onClose).not.toHaveBeenCalled();

      // When the close button is clicked
      await userEvent.click(close);

      // Then onClose is called
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('Auto-closing snack', () => {
    it('auto-closes without a duration or action after the short duration', async () => {
      const onClose = vi.fn();
      vi.useFakeTimers({ shouldAdvanceTime: true });
      renderModal({ snack: { text: 'Snack', dismissable: false }, onClose });

      // Given no close happened right after the render
      expect(onClose).not.toHaveBeenCalled();

      // When the short duration (4 seconds) passes
      await vi.advanceTimersByTimeAsync(4_000);

      // Then onClose is called
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('auto-closes with a short duration after 4 seconds', async () => {
      const onClose = vi.fn();
      vi.useFakeTimers({ shouldAdvanceTime: true });
      renderModal({ snack: { text: 'Snack', dismissable: false, duration: 'short' }, onClose });

      // When the short duration passes
      await vi.advanceTimersByTimeAsync(4_000);

      // Then onClose is called
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('auto-closes with a long duration after 10 seconds', async () => {
      const onClose = vi.fn();
      vi.useFakeTimers({ shouldAdvanceTime: true });
      renderModal({ snack: { text: 'Snack', dismissable: false, duration: 'long' }, onClose });

      // Given the snack outlives the short duration
      await vi.advanceTimersByTimeAsync(4_000);
      expect(onClose).not.toHaveBeenCalled();

      // When the long duration passes
      await vi.advanceTimersByTimeAsync(6_000);

      // Then onClose is called
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('auto-closes with an action and no duration after 10 seconds', async () => {
      const onClose = vi.fn();
      vi.useFakeTimers({ shouldAdvanceTime: true });
      renderModal({
        snack: {
          text: 'Snack',
          dismissable: false,
          action: { label: 'Undo', onClick: vi.fn() }
        },
        onClose
      });

      // Given the snack outlives the short duration
      await vi.advanceTimersByTimeAsync(4_000);
      expect(onClose).not.toHaveBeenCalled();

      // When the long duration passes
      await vi.advanceTimersByTimeAsync(6_000);

      // Then onClose is called
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('never auto-closes an indefinite snack', async () => {
      const onClose = vi.fn();
      vi.useFakeTimers({ shouldAdvanceTime: true });
      renderModal({ snack: { text: 'Snack', dismissable: false, duration: 'indefinite' }, onClose });

      // When well past the longest duration passes
      await vi.advanceTimersByTimeAsync(20_000);

      // Then onClose is not called
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Unmount', () => {
    it('cancels the pending timer when unmounted', async () => {
      const onClose = vi.fn();
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const { unmount } = renderModal({ snack: { text: 'Snack', dismissable: false }, onClose });

      // Given the snack is shown before its timer expires
      await vi.advanceTimersByTimeAsync(1_000);
      expect(onClose).not.toHaveBeenCalled();

      // When the snack is unmounted and the duration passes
      unmount();
      await vi.advanceTimersByTimeAsync(10_000);

      // Then onClose is not called
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
