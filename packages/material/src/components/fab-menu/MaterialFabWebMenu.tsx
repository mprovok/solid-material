import type { ParentComponent } from 'solid-js';

import { For, createSignal, splitProps } from 'solid-js';

import { MaterialFab } from '../fab/MaterialFab';
import { MaterialMenu } from '../menu/MaterialMenu';
import { MaterialMenuAnchor } from '../menu/MaterialMenuAnchor';
import { MaterialMenuItem } from '../menu/MaterialMenuItem';

import type { MaterialFabMenuProps } from './MaterialFabMenu';

export interface MaterialFabWebMenuProps extends Omit<MaterialFabMenuProps, 'closeButtonAriaLabel'> {
  menuAriaLabel?: string;
}

export const MaterialFabWebMenu: ParentComponent<MaterialFabWebMenuProps> = props => {
  const [localProps, otherProps] = splitProps(props, ['items', 'menuAriaLabel']);

  const [isOpen, setOpen] = createSignal(false);

  // oxlint-disable-next-line no-unassigned-vars
  let menuRef!: HTMLDivElement;

  const onClickFab = () => {
    setOpen(v => !v);
  };

  const onCloseMenu = () => {
    setOpen(false);
  };

  return (
    <sm-fab-menu>
      <MaterialMenuAnchor ref={menuRef}>
        <MaterialFab {...otherProps} ariaExpanded={isOpen()} onClick={onClickFab} />
      </MaterialMenuAnchor>
      <MaterialMenu
        offset={[0, 4]}
        placement={['bottom', 'start']}
        open={isOpen()}
        anchor={menuRef}
        ariaLabel={localProps.menuAriaLabel}
        onClose={onCloseMenu}
      >
        <For each={localProps.items}>
          {item => (
            <MaterialMenuItem ariaLabel={item.ariaLabel} onClick={item.onClick}>
              {item.label}
            </MaterialMenuItem>
          )}
        </For>
      </MaterialMenu>
    </sm-fab-menu>
  );
};
