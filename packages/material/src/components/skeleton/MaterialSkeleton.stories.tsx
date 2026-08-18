import type { VoidComponent } from 'solid-js';

import { For } from 'solid-js';
import { createJSXDecorator } from 'storybook-solidjs-vite';

import preview from '../../../.storybook/preview';

import { MaterialSkeleton } from './MaterialSkeleton';
import { MaterialSkeletonManager } from './MaterialSkeletonManager';

const meta = preview.meta({
  title: 'Components/MaterialSkeleton',
  component: MaterialSkeleton,
  decorators: [
    createJSXDecorator(Story => (
      <MaterialSkeletonManager>
        <Story />
      </MaterialSkeletonManager>
    ))
  ],
  globals: {
    backgrounds: {
      value: 'surface'
    }
  }
});

const Rectangle: VoidComponent = () => (
  <div style={{ width: `100px`, height: `100px`, 'background-color': 'var(--md-ref-palette-blue-60)' }} />
);

export const Example = meta.story({
  args: {
    show: true,
    children: <Rectangle />
  }
});

export const Multiple = meta.story({
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', 'flex-wrap': 'wrap' }}>
      <For each={Array.from({ length: 5 })}>
        {_ => (
          <MaterialSkeleton show={true}>
            <Rectangle />
          </MaterialSkeleton>
        )}
      </For>
    </div>
  )
});
