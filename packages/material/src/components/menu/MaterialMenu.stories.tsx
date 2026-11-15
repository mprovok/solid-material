import type { Component } from 'solid-js';

import { createSignal } from 'solid-js';
import { fn } from 'storybook/test';

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
  render: () => <MaterialMenuWithSubMenusRenderer {...Submenus.composed.args} />
});
