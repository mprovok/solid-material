import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';

import { MaterialSplitButtonMenu } from './MaterialSplitButtonMenu';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

const meta = preview.meta({
  title: 'Buttons/MaterialSplitButtonMenu',
  component: MaterialSplitButtonMenu,
  args: {
    onClick: fn()
  }
});

export const Example = meta.story({
  args: {
    variant: 'filled',
    size: 'medium',
    icon: <EditIcon />,
    menuItems: [
      {
        label: 'First',
        onClick: fn()
      },
      {
        label: 'Second',
        onClick: fn()
      },
      {
        label: 'Third',
        onClick: fn()
      }
    ],
    menuButtonAriaLabel: 'items',
    menuAriaLabel: 'Split button menu',
    children: 'Label'
  }
});

export const Placement = meta.story({
  args: {
    variant: 'filled',
    size: 'medium',
    icon: <EditIcon />,
    menuItems: [
      {
        label: 'First',
        onClick: fn()
      },
      {
        label: 'Second',
        onClick: fn()
      },
      {
        label: 'Third',
        onClick: fn()
      }
    ],
    menuPlacement: ['bottom', 'end'],
    children: 'Label'
  }
});
