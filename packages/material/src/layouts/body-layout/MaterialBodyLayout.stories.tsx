import { createJSXDecorator } from 'storybook-solidjs-vite';

import preview from '../../../.storybook/preview';
import { MaterialPane } from '../pane/MaterialPane';

import type { DragHandlePosition } from './MaterialBodyLayout.types';

import { MaterialBodyLayout } from './MaterialBodyLayout';

const meta = preview.meta({
  title: 'Layouts/MaterialBodyLayout',
  component: MaterialBodyLayout,
  decorators: [
    createJSXDecorator(Story => (
      <div style={{ display: 'grid', height: '100vh' }}>
        <Story />
      </div>
    ))
  ],
  args: {
    dragHandleAriaLabel: 'Drag handle',
    dragHandleAriaValue: (position: DragHandlePosition) =>
      position.percentage === 50 ? 'Center' : `${position.percentage}%`,
    children: (
      <>
        <MaterialPane>
          <aside>Pane 1</aside>
        </MaterialPane>
        <MaterialPane>
          <main>Pane 2</main>
        </MaterialPane>
      </>
    )
  },
  parameters: {
    docs: {
      story: {
        height: '500px',
        inline: false
      }
    },
    layout: 'fullscreen'
  }
});

export const FixedFlexible = meta.story({
  args: {
    variant: 'fixed-flexible'
  }
});

export const FlexibleFixed = meta.story({
  args: {
    variant: 'flexible-fixed'
  }
});

export const Split = meta.story({
  args: {
    variant: 'split'
  }
});

export const NoDragHandle = meta.story({
  args: {
    variant: 'fixed-flexible',
    showDragHandle: false
  }
});

export const OnePane = meta.story({
  args: {
    variant: 'flexible-fixed',
    showDragHandle: false,
    children: (
      <>
        <MaterialPane>
          <main>Pane 1</main>
        </MaterialPane>
      </>
    )
  }
});
