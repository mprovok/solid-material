import { createJSXDecorator } from 'storybook-solidjs-vite';
import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';

import { MaterialChip } from './MaterialChip';
import { MaterialChipSet } from './MaterialChipSet';

import MenuIcon from '@solidmaterial/icons/400/outlined/menu.svg';

const meta = preview.meta({
  title: 'Components/MaterialChip/Assist',
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
    variant: 'assist',
    children: 'Assist chip',
    ariaLabel: 'ARIA label'
  }
});

export const Icon = meta.story({
  args: {
    variant: 'assist',
    children: 'Icon',
    icon: <MenuIcon />
  }
});

export const Elevated = meta.story({
  args: {
    variant: 'assist',
    children: 'Elevated',
    elevated: true
  }
});

export const ElevatedAndDisabled = meta.story({
  args: {
    variant: 'assist',
    children: 'Elevated (disabled)',
    elevated: true,
    disabled: true
  }
});

export const Disabled = meta.story({
  args: {
    variant: 'assist',
    children: 'Disabled',
    disabled: true
  }
});

export const alwaysFocusable = meta.story({
  args: {
    variant: 'assist',
    children: 'Disabled, but focusable',
    disabled: true,
    alwaysFocusable: true
  }
});

export const Link = meta.story({
  args: {
    variant: 'assist',
    children: 'Link',
    href: 'http://localhost:6006',
    target: '_blank'
  }
});
