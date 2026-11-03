import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialButton } from '../button/MaterialButton';

import type { MaterialDialogProps } from './MaterialDialog';

import { MaterialDialog } from './MaterialDialog';

import BookmarkIcon from '@solidmaterial/icons/400/outlined/bookmark.svg';

// Written by GLM 5.3 Flash

// How long to wait after rendering or opening until the opening transition of
// the dialog has settled: the scrim fades in without changing the screenshot
// target's bounding box, so the element screenshot's stability wait does not
// cover it
const SETTLE_TRANSITIONS_MS = 800;

const CONTENT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ' +
  'magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ' +
  'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ' +
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const getActions = () => [
  <MaterialButton variant="text">Cancel</MaterialButton>,
  <MaterialButton variant="text">OK</MaterialButton>
];

// The md-dialog host is display: contents, so it has no bounding box of its
// own and the scrim is painted by a fixed element inside it: the screenshot
// therefore captures a viewport-sized wrapper element instead
const DialogFixture: VoidComponent<MaterialDialogProps> = props => (
  <main style={{ height: '100vh' }}>
    <MaterialDialog {...props}>{CONTENT}</MaterialDialog>
  </main>
);

interface RenderDialogProps extends Omit<MaterialDialogProps, 'open' | 'icon' | 'actions'> {
  withIcon?: boolean;
  withActions?: boolean;
}

const renderComponent = async (props: RenderDialogProps) => {
  const renderedAt = performance.now();

  const { withIcon, withActions, ...dialogProps } = props;

  const { baseElement } = render(
    () => (
      <DialogFixture
        {...dialogProps}
        open={true}
        icon={withIcon === true ? <BookmarkIcon /> : undefined}
        actions={withActions === true ? getActions() : undefined}
      />
    ),
    { wrapper: MaterialTheme }
  );

  await document.fonts.ready;
  // Move the pointer to the middle of the page so that hover state from a
  // previous test or the browser's initial pointer position does not leak
  // into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 400, y: 300 } });
  const screen = page.elementLocator(baseElement);

  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(renderedAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );

  return screen;
};

// Asserts that the dialog and its parts are visible, then screenshots the
// viewport-sized wrapper which covers the scrim and the surface
const expectDialogScreenshot = async (
  screen: ReturnType<typeof page.elementLocator>,
  parts: { alert?: boolean; title?: boolean; closeButton?: boolean; actions?: boolean } = {}
) => {
  // Given the dialog is visible (an alert dialog renders the alertdialog role)
  const dialog = screen.getByRole(parts.alert === true ? 'alertdialog' : 'dialog');
  await expect.element(dialog).toBeVisible();

  if (parts.title === true) {
    await expect.element(screen.getByText('Title')).toBeVisible();
  }
  if (parts.closeButton === true) {
    await expect.element(screen.getByRole('button', { name: 'Close' })).toBeVisible();
  }
  if (parts.actions === true) {
    await expect.element(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect.element(screen.getByRole('button', { name: 'OK' })).toBeVisible();
  }

  await expect.element(screen.getByElement('main')).toMatchScreenshot();
};

// Mirrors the MaterialDialogStory fixture from MaterialDialog.stories.tsx: a
// button which opens the dialog
const OpenableDialog: VoidComponent = () => {
  const [openDialog, setOpenDialog] = createSignal(false);

  const onClose = () => setOpenDialog(false);

  return (
    <main style={{ height: '100vh' }}>
      <MaterialButton variant="tonal" onClick={() => setOpenDialog(true)}>
        Open dialog
      </MaterialButton>
      <MaterialDialog
        open={openDialog()}
        onClose={onClose}
        icon={<BookmarkIcon />}
        title="Title"
        ariaLabel="Dialog shown after clicking on button Open"
        closeButton
        closebuttonAriaLabel="Close"
        actions={getActions()}
      >
        {CONTENT}
      </MaterialDialog>
    </main>
  );
};

describe('MaterialDialog', () => {
  describe('Visual', () => {
    it('renders a dialog with icon, title, close button and actions', async () => {
      const screen = await renderComponent({
        title: 'Title',
        ariaLabel: 'Dialog',
        closeButton: true,
        closebuttonAriaLabel: 'Close',
        withIcon: true,
        withActions: true
      });

      await expectDialogScreenshot(screen, { title: true, closeButton: true, actions: true });
    });

    it('renders a dialog with a title', async () => {
      const screen = await renderComponent({ title: 'Title', ariaLabel: 'Dialog' });

      await expectDialogScreenshot(screen, { title: true });
    });

    it('renders a dialog with an icon', async () => {
      const screen = await renderComponent({ ariaLabel: 'Dialog', withIcon: true });

      await expectDialogScreenshot(screen);
    });

    it('renders a dialog with a title and a close button', async () => {
      const screen = await renderComponent({
        title: 'Title',
        ariaLabel: 'Dialog',
        closeButton: true,
        closebuttonAriaLabel: 'Close'
      });

      await expectDialogScreenshot(screen, { title: true, closeButton: true });
    });

    it('renders a dialog with actions', async () => {
      const screen = await renderComponent({ ariaLabel: 'Dialog', withActions: true });

      await expectDialogScreenshot(screen, { actions: true });
    });

    it('renders an alert dialog', async () => {
      const screen = await renderComponent({
        alert: true,
        title: 'Title',
        ariaLabel: 'Dialog',
        closeButton: true,
        closebuttonAriaLabel: 'Close',
        withIcon: true,
        withActions: true
      });

      await expectDialogScreenshot(screen, { alert: true, title: true, closeButton: true, actions: true });
    });

    it('can be opened and closed', async () => {
      const rendered = render(() => <OpenableDialog />, { wrapper: MaterialTheme });
      const screen = page.elementLocator(rendered.baseElement);

      // Given only the button is visible
      const openButton = screen.getByRole('button', { name: 'Open dialog' });
      await expect.element(openButton).toBeVisible();
      expect(rendered.queryByRole('dialog')).toBeNull();

      // When the button is clicked
      await userEvent.click(openButton);

      // Then the dialog is visible
      await expect.element(screen.getByRole('dialog')).toBeVisible();
      await expect.element(screen.getByText('Title')).toBeVisible();

      // Move the pointer to the top-left corner so that hover state from the
      // click does not leak into this test's screenshot
      await userEvent.hover(document.body, { position: { x: 0, y: 0 } });

      const openedAt = performance.now();
      await vi.waitFor(
        () => {
          expect(performance.now()).toBeGreaterThanOrEqual(openedAt + SETTLE_TRANSITIONS_MS);
        },
        { timeout: 2000 }
      );

      await expect.element(screen.getByElement('main')).toMatchScreenshot();

      // When the close button is clicked
      await userEvent.click(screen.getByRole('button', { name: 'Close' }));

      // Then the dialog leaves the DOM
      await vi.waitFor(() => {
        expect(rendered.queryByRole('dialog')).toBeNull();
      });
    });
  });
});
