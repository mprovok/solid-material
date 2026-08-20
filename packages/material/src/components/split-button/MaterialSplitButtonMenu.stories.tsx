import { expect, fn, userEvent, waitFor } from 'storybook/test';

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
  },
  play: async ({ canvas, step }) => {
    const button = canvas.getByRole('switch', { name: 'items' });

    await step('Show menu', async () => {
      const menu = canvas.getByLabelText('Split button menu');
      await waitFor(async () => expect(menu).toHaveAttribute('aria-hidden', 'true'));

      await userEvent.click(button);

      await waitFor(async () => expect(menu).not.toHaveAttribute('aria-hidden', 'true'));
      await expect(menu).toBeVisible();
    });

    const item = canvas.getByText('First');
    await waitFor(async () => expect(item).toBeVisible());

    await step('Navigate through items using keyboard', async () => {
      await waitFor(async () => expect(item).toHaveFocus());

      const onClickItem = Example.composed.args.menuItems[0]?.onClick;
      await expect(onClickItem).not.toHaveBeenCalled();
      await userEvent.keyboard('{Enter}', { delay: 250 });
      await waitFor(async () => expect(onClickItem).toHaveBeenCalled());
    });
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
