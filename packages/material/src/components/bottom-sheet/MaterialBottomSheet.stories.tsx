import type { Component } from 'solid-js';

import { createSignal } from 'solid-js';
import { createJSXDecorator } from 'storybook-solidjs-vite';

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
  render: () => <MaterialBottomSheetRenderer {...Standard.composed.args} />
});

export const Modal = meta.story({
  args: {
    variant: 'modal'
  },
  render: () => <MaterialBottomSheetRenderer {...Modal.composed.args} />
});

export const SnapIndicesDragHandle = meta.story({
  args: {
    variant: 'modal',
    availableIndices: [0, 1],
    dragHandle: true
  },
  render: () => <MaterialBottomSheetRenderer {...SnapIndicesDragHandle.composed.args} />
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
  render: () => <MaterialBottomSheetRenderer {...FullHeightOnMobile.composed.args} />
});
