import { createJSXDecorator } from 'storybook-solidjs-vite';
import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';

import { MaterialChip } from './MaterialChip';
import { MaterialChipSet } from './MaterialChipSet';

import BatteryAndroidBoltIcon from '@solidmaterial/icons/400/outlined/battery_android_bolt.svg';
import CheckCircleIcon from '@solidmaterial/icons/400/outlined/check_circle.svg';

const onRemove = (event: Event) => {
  console.info('onRemove', event);
};

const meta = preview.meta({
  title: 'Components/MaterialChip/Filter',
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
    variant: 'filter',
    children: 'Selected',
    selected: true
  }
});

export const NotSelected = meta.story({
  args: {
    variant: 'filter',
    children: 'Not selected',
    selected: false
  }
});

export const SelectedIcon = meta.story({
  args: {
    variant: 'filter',
    children: 'Selected',
    selected: true,
    selectedIcon: <CheckCircleIcon />
  }
});

export const Icon = meta.story({
  args: {
    variant: 'filter',
    children: 'Not selected',
    icon: <BatteryAndroidBoltIcon />
  }
});

export const Removable = meta.story({
  args: {
    variant: 'filter',
    children: 'Removable',
    icon: <BatteryAndroidBoltIcon />,
    onRemove
  }
});

export const ElevatedNotselected = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filter',
    children: 'Elevated',
    elevated: true
  }
});

export const Elevated = meta.story({
  tags: ['!test'],
  render: () => (
    <>
      <MaterialChip variant="filter" elevated selected={true}>
        Selected (elevated)
      </MaterialChip>
      <MaterialChip variant="filter" elevated selected={false}>
        Not selected (elevated)
      </MaterialChip>
    </>
  )
});

export const ElevatedAndDisabledNotselected = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filter',
    children: 'Elevated (disabled)',
    elevated: true,
    disabled: true
  }
});

export const ElevatedAndDisabled = meta.story({
  tags: ['!test'],
  render: () => (
    <>
      <MaterialChip variant="filter" disabled elevated selected={true}>
        Selected (disabled and elevated)
      </MaterialChip>
      <MaterialChip variant="filter" disabled elevated selected={false}>
        Not selected (disabled and elevated)
      </MaterialChip>
    </>
  )
});

export const DisabledNotselected = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filter',
    children: 'Disabled',
    disabled: true
  }
});

export const Disabled = meta.story({
  tags: ['!test'],
  render: () => (
    <>
      <MaterialChip variant="filter" disabled selected={true}>
        Selected (disabled)
      </MaterialChip>
      <MaterialChip variant="filter" disabled selected={false}>
        Not selected (disabled)
      </MaterialChip>
    </>
  )
});
