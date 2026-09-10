import type { Component } from 'solid-js';

import { For } from 'solid-js';
import { createJSXDecorator } from 'storybook-solidjs-vite';
import { fn } from 'storybook/test';

import type { MaterialFabColor, MaterialFabSize } from '../fab/MaterialFab';

import preview from '../../../.storybook/preview';

import type { MaterialFabMenuItem, MaterialFabMenuProps } from './MaterialFabMenu';

import { MaterialFabMenu } from './MaterialFabMenu';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';
import PhotoFillIcon from '@solidmaterial/icons/400/outlined/photo-fill.svg';
import SpeakerFillIcon from '@solidmaterial/icons/400/outlined/speaker-fill.svg';
import VideocamFillIcon from '@solidmaterial/icons/400/outlined/videocam-fill.svg';

const meta = preview.meta({
  title: 'Buttons/MaterialFabMenu',
  component: MaterialFabMenu,
  decorators: [
    createJSXDecorator(Story => (
      <div
        style={{
          display: 'grid',
          padding: '1rem',
          position: 'absolute',
          right: 0,
          bottom: 0
        }}
      >
        <Story />
      </div>
    ))
  ],
  parameters: {
    docs: {
      story: {
        height: '350px'
      }
    },
    layout: 'fullscreen'
  }
});

const SIZES: MaterialFabSize[] = ['small', 'medium', 'large'];

const COLORS: MaterialFabColor[] = [
  'primary',
  'secondary',
  'tertiary',
  'primary-container',
  'secondary-container',
  'tertiary-container'
];

const getItems: () => MaterialFabMenuItem[] = () => [
  {
    label: 'First',
    icon: <PhotoFillIcon />,
    onClick: fn()
  },
  {
    label: 'Second',
    icon: <VideocamFillIcon />,
    onClick: fn()
  },
  {
    label: 'Third',
    icon: <SpeakerFillIcon />,
    onClick: fn()
  }
];

const MaterialFabMenuColorRenderer: Component<Omit<MaterialFabMenuProps, 'color' | 'icon' | 'items'>> = args => {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <For each={COLORS}>
        {color => <MaterialFabMenu color={color} icon={<EditIcon />} items={getItems()} {...args} />}
      </For>
    </div>
  );
};

const MaterialFabMenuSizeRenderer: Component<Omit<MaterialFabMenuProps, 'size' | 'icon' | 'items'>> = args => {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <For each={SIZES}>{size => <MaterialFabMenu size={size} icon={<EditIcon />} items={getItems()} {...args} />}</For>
    </div>
  );
};

export const Color = meta.story({
  render: () => <MaterialFabMenuColorRenderer {...Color.composed.args} />
});

export const Size = meta.story({
  render: () => <MaterialFabMenuSizeRenderer {...Size.composed.args} />
});

export const Tooltip = meta.story({
  args: {
    title: 'Tooltip',
    closeButtonAriaLabel: 'Close',
    icon: <EditIcon />,
    items: getItems()
  }
});
