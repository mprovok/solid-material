import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';

import type { MaterialFabMenuItem } from './MaterialFabMenu';

import { MaterialFabWebMenu } from './MaterialFabWebMenu';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

const meta = preview.meta({
  title: 'Buttons/MaterialFabWebMenu',
  component: MaterialFabWebMenu
});

const getItems: () => MaterialFabMenuItem[] = () => [
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
];

export const Example = meta.story({
  args: {
    color: 'primary',
    size: 'small',
    children: 'Label',
    icon: <EditIcon />,
    items: getItems(),
    menuAriaLabel: 'FAB menu'
  }
});
