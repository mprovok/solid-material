import { createJSXDecorator } from 'storybook-solidjs-vite';
import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';

import { MaterialChip } from './MaterialChip';
import { MaterialChipSet } from './MaterialChipSet';

const meta = preview.meta({
  title: 'Components/MaterialChip/Input',
  component: MaterialChip,
  decorators: [
    createJSXDecorator(Story => (
      <MaterialChipSet>
        <Story />
      </MaterialChipSet>
    ))
  ],
  args: { onClick: fn() }
});

export const Selected = meta.story({
  args: {
    variant: 'input',
    children: 'Selected',
    selected: true
  }
});

export const NotSelected = meta.story({
  args: {
    variant: 'input',
    children: 'Not selected',
    selected: false
  }
});

export const RemoveOnly = meta.story({
  args: {
    variant: 'input',
    children: 'Remove only',
    removeOnly: true
  }
});
