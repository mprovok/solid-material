import type { VoidComponent } from 'solid-js';

import preview from '../../../.storybook/preview';

import type { MaterialRippleProps } from './MaterialRipple';

import { MaterialRipple } from './MaterialRipple';

import styles from './MaterialRipple.stories.module.css';

const meta = preview.meta({
  title: 'Utilities/MaterialRipple',
  component: MaterialRipple
});

const MaterialRippleStory: VoidComponent<Omit<MaterialRippleProps, 'attachTo'>> = args => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDivElement;

  return (
    <div style={{ display: 'flex', gap: '1rem', 'flex-direction': 'column' }}>
      <div class={styles['container']}>
        <div ref={ref} class={styles['element']}>
          <MaterialRipple attachTo={ref} {...args} />
        </div>
      </div>
    </div>
  );
};

export const Example = meta.story({
  args: {
    disabled: false
  },
  render: () => <MaterialRippleStory {...Example.composed.args} />
});

export const Disabled = meta.story({
  args: {
    disabled: true
  },
  render: () => <MaterialRippleStory {...Disabled.composed.args} />
});
