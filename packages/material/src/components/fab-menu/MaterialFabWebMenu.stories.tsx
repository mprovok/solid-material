import { expect, fn, userEvent, waitFor } from 'storybook/test';

import preview from '../../../.storybook/preview';

import type { MaterialFabMenuItem } from './MaterialFabMenu';

import { MaterialFabWebMenu } from './MaterialFabWebMenu';

import EditIcon from '@solid-material/icons/400/outlined/edit.svg';

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
  },
  play: async ({ canvas, step }) => {
    const button = canvas.getByRole('button', { name: 'Label' });

    await step('Show menu', async () => {
      const menu = canvas.getByLabelText('FAB menu');
      await waitFor(async () => expect(menu).toHaveAttribute('aria-hidden', 'true'));

      await userEvent.click(button);

      await waitFor(async () => expect(menu).not.toHaveAttribute('aria-hidden', 'true'));
      await expect(menu).toBeVisible();
    });

    const item = canvas.getByText('First');
    await waitFor(async () => expect(item).toBeVisible());

    await step('Navigate through items using keyboard', async () => {
      await waitFor(async () => expect(item).toHaveFocus());

      const onClickItem = Example.composed.args.items[0]?.onClick;
      await expect(onClickItem).not.toHaveBeenCalled();
      await userEvent.keyboard('{Enter}', { delay: 250 });
      await waitFor(async () => expect(onClickItem).toHaveBeenCalled());
    });
  }
});
