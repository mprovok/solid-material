import { createJSXDecorator } from 'storybook-solidjs-vite';
import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';

import { MaterialChip } from './MaterialChip';
import { MaterialChipSet } from './MaterialChipSet';

const meta = preview.meta({
  title: 'Components/MaterialChip/Suggestion',
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

export const Example = meta.story({
  args: {
    variant: 'suggestion',
    children: 'Suggestion chip'
  }
});

export const Elevated = meta.story({
  args: {
    variant: 'suggestion',
    children: 'Elevated',
    elevated: true
  }
});

export const Disabled = meta.story({
  args: {
    variant: 'suggestion',
    children: 'Disabled',
    disabled: true
  }
});
