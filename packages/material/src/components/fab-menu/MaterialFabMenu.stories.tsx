import type { Component } from 'solid-js';

import { For } from 'solid-js';
import { createJSXDecorator } from 'storybook-solidjs-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';

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
  },
  play: async ({ canvas, step }) => {
    const button = canvas.getByRole('button');

    await expect(button).toBeVisible();
    await expect(button).toHaveAccessibleName('Tooltip');

    await expect(canvas.queryByRole('menu')).toBeNull();

    await step('Hover over FAB to show tooltip', async () => {
      await expect(canvas.queryByRole('tooltip')).toBeNull();
      await userEvent.hover(button, { delay: 250 });

      await waitFor(async () => expect(canvas.getByRole('tooltip')).toBeVisible());
    });

    await step('Click on FAB to show menu', async () => {
      await userEvent.click(button, { delay: 250 });

      await waitFor(async () => expect(canvas.getByRole('menu')).toBeVisible());
      await expect(button).toHaveAccessibleName('Close');
    });

    await step('Cycle through the focusable menu items', async () => {
      const item = canvas.getByRole('button', { name: 'First' });
      await expect(item).toBeInTheDocument();

      await userEvent.tab();
      await waitFor(async () => expect(item).toHaveFocus());

      await userEvent.tab();
      await waitFor(async () => expect(item).not.toHaveFocus());
    });

    await step('Click close button to hide menu', async () => {
      await userEvent.click(button, { delay: 250 });
      button.blur();

      await waitFor(async () => expect(canvas.queryByRole('menu')).toBeNull());
      await expect(button).toHaveAccessibleName('Tooltip');
    });
  }
});
