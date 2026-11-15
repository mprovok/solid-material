import type { JSX, VoidComponent } from 'solid-js';

import { render, waitFor } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialButton } from '../button/MaterialButton';

import { MaterialDialog } from './MaterialDialog';

import BookmarkIcon from '@solidmaterial/icons/400/outlined/bookmark.svg';

interface RenderComponentProps {
  open: boolean;
  alert?: boolean;
  actions?: JSX.Element[];
  onClose?: (event: Event) => void;
}

const RenderComponent: VoidComponent<RenderComponentProps> = props => {
  return (
    <MaterialDialog
      title="Title"
      icon={<BookmarkIcon />}
      ariaLabel='Dialog shown after clicking on button "Open"'
      closeButton
      closebuttonAriaLabel="Close"
      alert={props.alert}
      actions={props.actions}
      open={props.open}
      onClose={props.onClose}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </MaterialDialog>
  );
};

describe('MaterialDialog', () => {
  describe('Visual', () => {
    it('can be hidden', () => {
      const { queryByRole } = render(() => <RenderComponent open={false} />, { wrapper: MaterialTheme });

      expect(queryByRole('dialog')).toBeNull();
    });

    it('can be visible with title and close button', async () => {
      const { baseElement } = render(() => <RenderComponent open={true} />, { wrapper: MaterialTheme });
      const screen = page.elementLocator(baseElement);

      const dialog = screen.getByRole('dialog');
      const title = screen.getByText('Title');
      const closeButton = screen.getByRole('button', { name: 'Close' });

      await expect.element(dialog).toBeVisible();
      await expect.element(title).toBeVisible();
      await expect.element(closeButton).toBeVisible();
    });

    it('can render action buttons', async () => {
      const { baseElement } = render(
        () => <RenderComponent open={true} actions={[<MaterialButton variant="text">Action</MaterialButton>]} />,
        { wrapper: MaterialTheme }
      );

      const screen = page.elementLocator(baseElement);

      const dialog = screen.getByRole('dialog');
      const actionButton = screen.getByRole('button', { name: 'Action' });

      await expect.element(dialog).toBeVisible();
      await expect.element(actionButton).toBeVisible();
    });
  });

  describe('Interaction', () => {
    it('can be closed', async () => {
      const onClose = vi.fn();
      const { baseElement } = render(() => <RenderComponent open={true} onClose={onClose} />, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);

      // Given the dialog with close button is visible
      const closeButton = screen.getByRole('button', { name: 'Close' });
      await expect.element(closeButton).toBeVisible();

      expect(onClose).not.toHaveBeenCalled();

      // When the close button is clicked
      await userEvent.click(closeButton);

      // Then the onClose callback is called
      await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations in the open dialog with a named close button and actions', async () => {
      const { baseElement, container } = render(
        () => <RenderComponent open={true} actions={[<MaterialButton variant="text">Action</MaterialButton>]} />,
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given the open dialog is visible
      const dialog = screen.getByRole('dialog');
      await expect.element(dialog).toBeVisible();

      // and its close button exposes the accessible name from closebuttonAriaLabel
      // (button-name is disabled in the global axe config, so the name is asserted structurally here)
      const closeButton = screen.getByRole('button', { name: 'Close' });
      await expect.element(closeButton).toBeVisible();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations in the open alert dialog', async () => {
      const { baseElement, container } = render(() => <RenderComponent open={true} alert={true} />, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);

      // Given the alert dialog is exposed with the alertdialog role
      const dialog = screen.getByRole('alertdialog');
      await expect.element(dialog).toBeVisible();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('does not expose a dialog role when closed', () => {
      const { queryByRole } = render(() => <RenderComponent open={false} />, { wrapper: MaterialTheme });

      // Then neither the dialog nor the alertdialog role is in the document
      expect(queryByRole('dialog')).toBeNull();
      expect(queryByRole('alertdialog')).toBeNull();
    });
  });
});
