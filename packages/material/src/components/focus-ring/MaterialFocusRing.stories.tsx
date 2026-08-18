import type { VoidComponent } from 'solid-js';

import preview from '../../../.storybook/preview';

import type { MaterialFocusRingProps } from './MaterialFocusRing';

import { MaterialFocusRing } from './MaterialFocusRing';

import styles from './MaterialFocusRing.stories.module.css';

const meta = preview.meta({
  title: 'Utilities/MaterialFocusRing',
  component: MaterialFocusRing,
  args: {
    inward: false
  }
});

const MaterialFocusRingStory: VoidComponent<Omit<MaterialFocusRingProps, 'attachTo'>> = args => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDivElement;

  return (
    <div class={styles['container']}>
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div ref={ref} class={styles['element']} tabindex={0}>
        <MaterialFocusRing attachTo={ref} {...args} />
      </div>
    </div>
  );
};

export const Example = meta.story({
  render: () => <MaterialFocusRingStory {...Example.composed.args} />
});

export const Inward = meta.story({
  args: {
    inward: true
  },
  render: () => <MaterialFocusRingStory {...Inward.composed.args} />
});

export const Visible = meta.story({
  args: {
    visible: true
  },
  render: () => <MaterialFocusRingStory {...Visible.composed.args} />
});
