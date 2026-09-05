import type { Component } from 'solid-js';

import { createSignal } from 'solid-js';
import { createJSXDecorator } from 'storybook-solidjs-vite';
import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { MaterialButton } from '../button/MaterialButton';
import { MaterialCard, MaterialCardBody } from '../card/MaterialCard';

import type { MaterialBottomSheetProps } from './MaterialBottomSheet';

import { MaterialBottomSheet } from './MaterialBottomSheet';

import styles from './MaterialBottomSheet.stories.module.css';

const meta = preview.meta({
  title: 'Components/MaterialBottomSheet',
  component: MaterialBottomSheet,
  decorators: [
    createJSXDecorator(Story => (
      <div class={styles['bottom-sheet']}>
        <Story />
      </div>
    ))
  ],
  args: {
    variant: 'standard'
  }
});

const MaterialBottomSheetRenderer: Component<Omit<MaterialBottomSheetProps, 'variant' | 'open' | 'onClose'>> = args => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = createSignal(false);

  const onCloseBottomSheet = () => setIsBottomSheetOpen(false);
  const onToggleBottomSheet = () => setIsBottomSheetOpen(value => !value);

  return (
    <div>
      <MaterialButton variant="tonal" onClick={onToggleBottomSheet}>
        Open bottom sheet
      </MaterialButton>
      <MaterialBottomSheet variant="standard" {...args} open={isBottomSheetOpen()} onClose={onCloseBottomSheet}>
        <MaterialCard variant="filled" size="large">
          <MaterialCardBody>Bottom sheet 1</MaterialCardBody>
        </MaterialCard>
        <MaterialCard variant="filled" size="large">
          <MaterialCardBody>Bottom sheet 2</MaterialCardBody>
        </MaterialCard>
        <MaterialCard variant="filled" size="large">
          <MaterialCardBody>Bottom sheet 3</MaterialCardBody>
        </MaterialCard>
        <MaterialCard variant="filled" size="large">
          <MaterialCardBody>Bottom sheet 4</MaterialCardBody>
        </MaterialCard>
        <div class={styles['close']}>
          <MaterialButton variant="filled" onClick={() => setIsBottomSheetOpen(false)}>
            Close sheet
          </MaterialButton>
        </div>
      </MaterialBottomSheet>
    </div>
  );
};

export const Standard = meta.story({
  args: {
    variant: 'standard'
  },
  render: () => <MaterialBottomSheetRenderer {...Standard.composed.args} />,
  play: async ({ canvas, step }) => {
    const button = canvas.getByRole('button', { name: 'Open bottom sheet' });

    await step('Can open bottom sheet', async () => {
      await userEvent.click(button, { delay: 250 });

      const sheet = canvas.getByRole('complementary');
      await expect(sheet).toBeVisible();

      const closeButton = canvas.getByRole('button', { name: 'Close sheet' });
      await expect(closeButton).toBeVisible();
    });

    await step('Click close button to close sheet', async () => {
      const closeButton = canvas.getByRole('button', { name: 'Close sheet' });

      await userEvent.click(closeButton, { delay: 250 });

      const sheet = canvas.getByRole('complementary');
      await waitFor(async () => expect(sheet).not.toBeVisible());
    });

    await step('Scroll down to close sheet', async () => {
      await userEvent.click(button, { delay: 250 });

      const sheet = canvas.getByRole('complementary');
      await expect(sheet).toBeVisible();

      const dialog = canvas.getByRole('dialog');

      await fireEvent.scroll(dialog, {
        target: {
          scrollTop: dialog.clientHeight - dialog.scrollHeight
        }
      });

      await waitFor(async () => expect(sheet).not.toBeVisible());
    });
  }
});

export const Modal = meta.story({
  args: {
    variant: 'modal'
  },
  render: () => <MaterialBottomSheetRenderer {...Modal.composed.args} />,
  play: async ({ canvas, step }) => {
    const button = canvas.getByRole('button', { name: 'Open bottom sheet' });

    await step('Can open bottom sheet', async () => {
      await userEvent.click(button, { delay: 250 });

      const sheet = canvas.getByRole('complementary');
      await expect(sheet).toBeVisible();

      const closeButton = canvas.getByRole('button', { name: 'Close sheet' });
      await expect(closeButton).toBeVisible();
    });

    await step('Click backdrop to close sheet', async () => {
      const dialog = canvas.getByRole('dialog');

      await userEvent.click(dialog, { delay: 250 });

      const sheet = canvas.getByRole('complementary');
      await waitFor(async () => expect(sheet).not.toBeVisible());
    });
  }
});

export const SnapIndicesDragHandle = meta.story({
  args: {
    variant: 'modal',
    availableIndices: [0, 1],
    dragHandle: true
  },
  render: () => <MaterialBottomSheetRenderer {...SnapIndicesDragHandle.composed.args} />,
  play: async ({ canvas, step }) => {
    const button = canvas.getByRole('button', { name: 'Open bottom sheet' });

    await step('Can open bottom sheet', async () => {
      await userEvent.click(button, { delay: 250 });

      const sheet = canvas.getByRole('complementary');
      await expect(sheet).toBeVisible();

      const closeButton = canvas.getByRole('button', { name: 'Close sheet' });
      await expect(closeButton).toBeVisible();
    });

    await step('Click drag handle to show more content', async () => {
      const handle = canvas.getByRole('separator');

      await userEvent.dblClick(handle, { delay: 250 });
      await userEvent.dblClick(handle, { delay: 250 });
      await userEvent.dblClick(handle, { delay: 250 });
    });

    await step('Scroll sheet to be fully visible and then close it', async () => {
      const dialog = canvas.getByRole('dialog');

      await fireEvent.scroll(dialog, {
        target: {
          scrollTop: dialog.scrollHeight - dialog.clientHeight
        },
        delay: 500
      });

      const closeButton = canvas.getByRole('button', { name: 'Close sheet' });
      await userEvent.click(closeButton, { delay: 250 });

      const sheet = canvas.getByRole('complementary');
      await waitFor(async () => expect(sheet).not.toBeVisible());
    });

    await step('Use keyboard to show more or less of sheet', async () => {
      await userEvent.click(button, { delay: 250 });

      const sheet = canvas.getByRole('complementary');
      await expect(sheet).toBeVisible();

      await userEvent.keyboard('{ArrowUp}', { delay: 250 });
      await userEvent.keyboard('{ArrowUp}', { delay: 250 });
      await userEvent.keyboard('{ArrowDown}', { delay: 250 });
      await userEvent.keyboard('{ArrowDown}', { delay: 250 });

      await waitFor(async () => expect(sheet).toBeVisible());

      await userEvent.keyboard('{Enter}', { delay: 250 });
      await waitFor(async () => expect(sheet).toBeVisible());
    });
  }
});

export const FullHeight = meta.story({
  args: {
    variant: 'modal',
    dragHandle: true,
    supportFullHeight: true
  },
  render: () => <MaterialBottomSheetRenderer {...FullHeight.composed.args} />
});

export const FullHeightOnMobile = meta.story({
  args: {
    variant: 'modal',
    dragHandle: true,
    supportFullHeight: true
  },
  parameters: {
    docs: {
      disable: true
    }
  },
  globals: {
    viewport: { value: 'pixel', isRotated: false }
  },
  render: () => <MaterialBottomSheetRenderer {...FullHeightOnMobile.composed.args} />,
  play: async ({ canvas, step }) => {
    const button = canvas.getByRole('button', { name: 'Open bottom sheet' });

    await step('Can open bottom sheet', async () => {
      await userEvent.click(button, { delay: 250 });

      const sheet = canvas.getByRole('complementary');
      await expect(sheet).toBeVisible();
    });

    await step('Scroll sheet to be fully visible and then close it', async () => {
      const dialog = canvas.getByRole('dialog');

      await fireEvent.scroll(dialog, {
        target: {
          scrollTop: dialog.scrollHeight - dialog.clientHeight
        },
        delay: 500
      });

      const sheet = canvas.getByRole('complementary');

      const closeButton = canvas.getByRole('button', { name: 'Close sheet' });
      await userEvent.click(closeButton, { delay: 250 });

      await waitFor(async () => expect(sheet).not.toBeVisible());
    });
  }
});
