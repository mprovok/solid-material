import type { ParentComponent } from 'solid-js';

import { createSignal } from 'solid-js';
import { expect, fn, userEvent, waitFor } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { MaterialButton } from '../button/MaterialButton';

import type { MaterialDialogProps } from './MaterialDialog';

import { MaterialDialog } from './MaterialDialog';

import BookmarkIcon from '@solidmaterial/icons/400/outlined/bookmark.svg';

const meta = preview.meta({
  title: 'Components/MaterialDialog',
  component: MaterialDialog,
  argTypes: {
    open: {
      table: {
        disable: true
      }
    }
  },
  args: {
    open: undefined,
    onClose: fn(),
    children: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </>
    )
  }
});

const MaterialDialogStory: ParentComponent<Omit<MaterialDialogProps, 'open'>> = args => {
  const [openDialog, setOpenDialog] = createSignal(false);

  const onClick = () => setOpenDialog(true);
  const onClose = () => setOpenDialog(false);

  return (
    <>
      <MaterialButton variant="tonal" onClick={onClick}>
        Open dialog
      </MaterialButton>

      <MaterialDialog {...args} open={openDialog()} onClose={onClose}>
        {args.children}
      </MaterialDialog>
    </>
  );
};

export const Example = meta.story({
  args: {
    icon: <BookmarkIcon />,
    title: 'Title',
    ariaLabel: 'Dialog shown after clicking on button "Open"',
    closeButton: true,
    closebuttonAriaLabel: 'Close',
    actions: [
      <MaterialButton variant="text">Cancel</MaterialButton>,
      <MaterialButton variant="text">OK</MaterialButton>
    ]
  },
  render: MaterialDialogStory,
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Open dialog' });

    await expect(button).toBeInTheDocument();
    await expect(canvas.queryByText('Title')).toBeNull();

    await userEvent.click(button, { delay: 250 });

    await waitFor(async () => expect(canvas.getByText('Title')).toBeVisible());

    const closeButton = canvas.getByRole('button', { name: 'Close' });
    await userEvent.click(closeButton, { delay: 250 });

    await waitFor(async () => expect(canvas.queryByText('Title')).toBeNull());
  }
});

export const Title = meta.story({
  args: {
    title: 'Title',
    ariaLabel: 'ARIA label of dialog'
  },
  render: MaterialDialogStory
});

export const Icon = meta.story({
  args: {
    icon: <BookmarkIcon />
  },
  render: MaterialDialogStory
});

export const CloseButton = meta.story({
  args: {
    title: 'Title',
    closeButton: true,
    closebuttonAriaLabel: 'ARIA label of close button'
  },
  render: MaterialDialogStory
});

export const Actions = meta.story({
  args: {
    actions: [
      <MaterialButton variant="text">Cancel</MaterialButton>,
      <MaterialButton variant="text">OK</MaterialButton>
    ]
  },
  render: MaterialDialogStory
});
