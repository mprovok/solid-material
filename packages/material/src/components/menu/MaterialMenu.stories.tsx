import type { Component } from 'solid-js';

import { createSignal } from 'solid-js';
import { expect, fn, userEvent, waitFor } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { MaterialButton } from '../button/MaterialButton';

import type { MaterialMenuProps } from './MaterialMenu';

import { MaterialMenu } from './MaterialMenu';
import { MaterialMenuAnchor } from './MaterialMenuAnchor';
import { MaterialMenuItem } from './MaterialMenuItem';
import { MaterialSubMenu } from './MaterialSubMenu';

const meta = preview.meta({
  title: 'Components/MaterialMenu',
  component: MaterialMenu
});

const MaterialMenuWithSubMenusRenderer: Component<Omit<MaterialMenuProps, 'open' | 'onClose'>> = args => {
  const [isOpen, setOpen] = createSignal(false);

  // oxlint-disable-next-line no-unassigned-vars
  let menuRef!: HTMLDivElement;

  const onClickAnchor = () => {
    setOpen(v => !v);
  };

  const onCloseMenu = () => {
    setOpen(false);
  };

  return (
    <>
      <MaterialMenuAnchor ref={menuRef}>
        <MaterialButton variant="tonal" toggle={isOpen()} onClick={onClickAnchor}>
          {isOpen() ? 'Close menu' : 'Open menu'}
        </MaterialButton>
      </MaterialMenuAnchor>
      <MaterialMenu {...args} open={isOpen()} ariaLabel="Menu with submenus" anchor={menuRef} onClose={onCloseMenu}>
        <MaterialMenuItem selected onClick={fn()}>
          Menu item 1
        </MaterialMenuItem>
        <MaterialMenuItem onClick={fn()}>Menu item 2</MaterialMenuItem>
        <MaterialSubMenu placement={['left', 'start']} label="Menu item 3">
          <MaterialMenuItem onClick={fn()}>Menu item 4</MaterialMenuItem>
          <MaterialMenuItem disabled onClick={fn()}>
            Menu item 5
          </MaterialMenuItem>
          <MaterialMenuItem onClick={fn()}>Menu item 6</MaterialMenuItem>
          <MaterialSubMenu label="Menu item 7">
            <MaterialMenuItem onClick={fn()}>Menu item 8</MaterialMenuItem>
            <MaterialSubMenu label="Menu item 9">
              <MaterialMenuItem onClick={fn()}>Menu item 10</MaterialMenuItem>
            </MaterialSubMenu>
          </MaterialSubMenu>
        </MaterialSubMenu>
      </MaterialMenu>
    </>
  );
};

const MaterialMenuRenderer: Component<Omit<MaterialMenuProps, 'open' | 'onClose'>> = args => {
  const [isOpen, setOpen] = createSignal(false);

  // oxlint-disable-next-line no-unassigned-vars
  let menuRef!: HTMLDivElement;

  const onClickAnchor = () => {
    setOpen(v => !v);
  };

  const onCloseMenu = () => {
    setOpen(false);
  };

  return (
    <>
      <MaterialMenuAnchor ref={menuRef}>
        <MaterialButton variant="tonal" toggle={isOpen()} onClick={onClickAnchor}>
          {isOpen() ? 'Close menu' : 'Open menu'}
        </MaterialButton>
      </MaterialMenuAnchor>
      <MaterialMenu {...args} open={isOpen()} anchor={menuRef} onClose={onCloseMenu}>
        <MaterialMenuItem selected onClick={fn()}>
          Menu item 1
        </MaterialMenuItem>
        <MaterialMenuItem onClick={fn()}>Menu item 2</MaterialMenuItem>
        <MaterialMenuItem onClick={fn()}>Menu item 3</MaterialMenuItem>
      </MaterialMenu>
    </>
  );
};

export const Offset = meta.story({
  tags: ['!test'],
  args: {
    offset: [0, 4]
  },
  render: () => <MaterialMenuRenderer {...Offset.composed.args} />
});

export const Placement = meta.story({
  tags: ['!test'],
  args: {
    offset: [4, 0],
    placement: ['right', 'start']
  },
  render: () => <MaterialMenuRenderer {...Placement.composed.args} />
});

export const Submenus = meta.story({
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false
          },
          {
            id: 'aria-hidden-focus',
            enabled: false
          }
        ]
      }
    }
  },
  args: {
    offset: [0, 4],
    placement: ['bottom', 'start']
  },
  render: () => <MaterialMenuWithSubMenusRenderer {...Submenus.composed.args} />,
  play: async ({ canvas, step }) => {
    const button = canvas.getByRole('switch', { name: 'Open menu' });
    const menu = canvas.getByLabelText('Menu with submenus');

    await step('Show menu items', async () => {
      await waitFor(async () => expect(menu).toHaveAttribute('aria-hidden', 'true'));

      await userEvent.click(button);

      await waitFor(async () => expect(menu).not.toHaveAttribute('aria-hidden', 'true'));
      await expect(menu).toBeVisible();
    });

    const item1 = canvas.getByText('Menu item 1');
    const item2 = canvas.getByText('Menu item 2');
    const item3 = canvas.getByText('Menu item 3');
    const item4 = canvas.getByText('Menu item 4');
    // Menu item 5 is disabled
    const item6 = canvas.getByText('Menu item 6');
    const item7 = canvas.getByText('Menu item 7');
    const item8 = canvas.getByText('Menu item 8');
    const item9 = canvas.getByText('Menu item 9');
    const item10 = canvas.getByText('Menu item 10');

    await step('Navigate to last and first items', async () => {
      await waitFor(async () => expect(item1).toHaveFocus());

      await userEvent.keyboard('{End}');
      await waitFor(async () => expect(item3).toHaveFocus());

      await userEvent.keyboard('{Home}');
      await waitFor(async () => expect(item1).toHaveFocus());
    });

    await step('Navigate to next item', async () => {
      await waitFor(async () => expect(item1).toHaveFocus());

      await userEvent.keyboard('{ArrowDown}');
      await waitFor(async () => expect(item2).toHaveFocus());

      await userEvent.keyboard('{ArrowRight}');
      await waitFor(async () => expect(item3).toHaveFocus());
    });

    await step('Navigate to previous item', async () => {
      await waitFor(async () => expect(item3).toHaveFocus());

      await userEvent.keyboard('{ArrowLeft}');
      await waitFor(async () => expect(item2).toHaveFocus());

      await userEvent.keyboard('{ArrowUp}');
      await waitFor(async () => expect(item1).toHaveFocus());
    });

    await step('Navigate back to first or last item', async () => {
      await waitFor(async () => expect(item1).toHaveFocus());

      await userEvent.keyboard('{ArrowLeft}');
      await waitFor(async () => expect(item3).toHaveFocus());

      await userEvent.keyboard('{ArrowDown}');
      await waitFor(async () => expect(item1).toHaveFocus());

      await userEvent.keyboard('{ArrowUp}');
      await waitFor(async () => expect(item3).toHaveFocus());
    });

    await step('Navigate from menu to submenu', async () => {
      await waitFor(async () => expect(item3).toHaveFocus());

      await userEvent.keyboard('{ArrowRight}');
      await waitFor(async () => expect(item4).toHaveFocus());

      await step('Navigate to last and first items', async () => {
        await waitFor(async () => expect(item4).toHaveFocus());

        await userEvent.keyboard('{End}');
        await waitFor(async () => expect(item7).toHaveFocus());

        await userEvent.keyboard('{Home}');
        await waitFor(async () => expect(item4).toHaveFocus());
      });

      await step('Navigate in submenu to next item', async () => {
        await waitFor(async () => expect(item4).toHaveFocus());

        await userEvent.keyboard('{ArrowDown}');
        await waitFor(async () => expect(item6).toHaveFocus());

        await userEvent.keyboard('{ArrowRight}');
        await waitFor(async () => expect(item7).toHaveFocus());
      });

      await step('Navigate in submenu to previous item', async () => {
        await waitFor(async () => expect(item7).toHaveFocus());

        await userEvent.keyboard('{ArrowUp}');
        await waitFor(async () => expect(item6).toHaveFocus());

        await userEvent.keyboard('{ArrowUp}');
        await waitFor(async () => expect(item4).toHaveFocus());
      });

      await step('Navigate in submenu back to first or last item', async () => {
        await waitFor(async () => expect(item4).toHaveFocus());

        await userEvent.keyboard('{ArrowUp}');
        await waitFor(async () => expect(item7).toHaveFocus());

        await userEvent.keyboard('{ArrowDown}');
        await waitFor(async () => expect(item4).toHaveFocus());
      });
    });

    await step('Navigate from submenu to submenu', async () => {
      await waitFor(async () => expect(item4).toHaveFocus());

      await userEvent.keyboard('{ArrowRight}');
      await waitFor(async () => expect(item6).toHaveFocus());

      await userEvent.keyboard('{ArrowRight}');
      await waitFor(async () => expect(item7).toHaveFocus());

      await userEvent.keyboard('{ArrowRight}');
      await waitFor(async () => expect(item8).toHaveFocus());

      await userEvent.keyboard('{ArrowRight}');
      await waitFor(async () => expect(item9).toHaveFocus());

      await userEvent.keyboard('{ArrowRight}');
      await waitFor(async () => expect(item10).toHaveFocus());
    });

    await step('Navigate back from submenu to menu', async () => {
      await waitFor(async () => expect(item10).toHaveFocus());

      await userEvent.keyboard('{ArrowLeft}');
      await waitFor(async () => expect(item9).toHaveFocus());

      await userEvent.keyboard('{Escape}');
      await waitFor(async () => expect(item7).toHaveFocus());

      await userEvent.keyboard('{ArrowLeft}');
      await waitFor(async () => expect(item3).toHaveFocus());

      await waitFor(async () => expect(menu).not.toHaveAttribute('aria-hidden', 'true'));
      await expect(menu).toBeVisible();

      await userEvent.keyboard('{Escape}');

      await waitFor(async () => expect(menu).toHaveAttribute('aria-hidden', 'true'));
    });
  }
});
