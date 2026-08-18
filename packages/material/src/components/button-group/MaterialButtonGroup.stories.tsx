import type { Component } from 'solid-js';

import { For } from 'solid-js';

import type { MaterialButtonSize } from '../button/MaterialButton';

import preview from '../../../.storybook/preview';
import { MaterialButton } from '../button/MaterialButton';

import type { MaterialButtonGroupProps } from './MaterialButtonGroup';

import { MaterialButtonGroup } from './MaterialButtonGroup';

const meta = preview.meta({
  title: 'Buttons/MaterialButtonGroup',
  component: MaterialButtonGroup,
  args: {
    variant: 'standard'
  }
});

const BUTTON_SIZES: MaterialButtonSize[] = ['extra-small', 'small', 'medium', 'large', 'extra-large'];

const MaterialButtonGroupRenderer: Component<MaterialButtonGroupProps> = args => {
  return (
    <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem' }}>
      <For each={BUTTON_SIZES}>
        {size => (
          <MaterialButtonGroup {...args}>
            <MaterialButton variant="tonal" shape="round" size={size}>
              Label
            </MaterialButton>
            <MaterialButton variant="tonal" shape="round" size={size} toggle={false}>
              Label
            </MaterialButton>
            <MaterialButton variant="tonal" shape="round" size={size} toggle={true}>
              Label
            </MaterialButton>
            <MaterialButton variant="tonal" shape="round" size={size} toggle={false}>
              Label
            </MaterialButton>
          </MaterialButtonGroup>
        )}
      </For>
    </div>
  );
};

export const Standard = meta.story({
  args: {
    variant: 'standard'
  },
  render: () => <MaterialButtonGroupRenderer variant="standard" />
});

export const Connected = meta.story({
  args: {
    variant: 'connected'
  },
  render: () => <MaterialButtonGroupRenderer variant="connected" />
});
