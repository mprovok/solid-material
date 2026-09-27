import type { Component } from 'solid-js';

import { Show, createSignal } from 'solid-js';
import { createJSXDecorator } from 'storybook-solidjs-vite';

import preview from '../../../../.storybook/preview';
import { MaterialButton } from '../../../components/button/MaterialButton';
import { MaterialPane } from '../../pane/MaterialPane';

import type { MaterialSupportingPaneProps } from './MaterialSupportingPane';

import { MaterialSupportingPane } from './MaterialSupportingPane';
import { MaterialSupportingPaneLayout } from './MaterialSupportingPaneLayout';

const meta = preview.meta({
  title: 'Layouts/MaterialSupportingPaneLayout',
  component: MaterialSupportingPane,
  decorators: [
    createJSXDecorator(Story => (
      <div style={{ display: 'grid', height: '100vh' }}>
        <Story />
      </div>
    ))
  ],
  globals: {
    backgrounds: {
      value: 'surface-container'
    }
  },
  parameters: {
    docs: {
      story: {
        iframeHeight: '500px',
        inline: false
      }
    },
    layout: 'fullscreen'
  }
});

const MaterialSupportingPaneLayoutRenderer: Component<Omit<MaterialSupportingPaneProps, 'onClose'>> = args => {
  const [isOpen, setOpen] = createSignal(args.open);

  const onClose = () => setOpen(false);
  const onClickButton = () => setOpen(value => (value !== undefined ? !value : undefined));

  return (
    <MaterialSupportingPaneLayout rounded>
      <MaterialPane>
        <main style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem', 'align-items': 'start' }}>
          <span>Main content</span>

          <Show when={args.open !== undefined}>
            <MaterialButton variant="tonal" toggle={isOpen()} onClick={onClickButton}>
              Toggle supporting pane
            </MaterialButton>
          </Show>
        </main>
      </MaterialPane>
      <MaterialSupportingPane {...args} open={isOpen()} onClose={args.open !== undefined ? onClose : undefined}>
        <div>Supporting content</div>
      </MaterialSupportingPane>
    </MaterialSupportingPaneLayout>
  );
};

export const Example = meta.story({
  args: {
    variant: 'standard',
    dragHandleAriaLabel: 'Drag handle for bottom sheet'
  },
  render: () => <MaterialSupportingPaneLayoutRenderer {...Example.composed.args} />
});

export const StandardSide = meta.story({
  args: {
    variant: 'standard',
    title: 'Title',
    open: false
  },
  globals: {
    viewport: { value: 'ipad', isRotated: true }
  },
  render: () => <MaterialSupportingPaneLayoutRenderer {...StandardSide.composed.args} />
});

export const StandardBelow = meta.story({
  args: {
    variant: 'standard',
    open: false
  },
  globals: {
    viewport: { value: 'pixel', isRotated: false }
  },
  render: () => <MaterialSupportingPaneLayoutRenderer {...StandardBelow.composed.args} />
});

export const ModalSide = meta.story({
  args: {
    variant: 'modal',
    title: 'Title',
    open: false
  },
  globals: {
    viewport: { value: 'ipad', isRotated: true }
  },
  render: () => <MaterialSupportingPaneLayoutRenderer {...ModalSide.composed.args} />
});

export const ModalBelow = meta.story({
  args: {
    variant: 'modal',
    open: false
  },
  globals: {
    viewport: { value: 'pixel', isRotated: false }
  },
  render: () => <MaterialSupportingPaneLayoutRenderer {...ModalBelow.composed.args} />
});
