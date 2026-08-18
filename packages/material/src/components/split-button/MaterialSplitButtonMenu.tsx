import type { ParentComponent } from 'solid-js';

import { For, createSignal, splitProps } from 'solid-js';

import type { MaterialMenuPlacement } from '../menu/MaterialMenu';

import { MaterialMenu } from '../menu/MaterialMenu';
import { MaterialMenuItem } from '../menu/MaterialMenuItem';

import type { MaterialSplitButtonProps } from './MaterialSplitButton';

import { MaterialSplitButton } from './MaterialSplitButton';

export type MaterialSplitButtonMenuItem = {
  label: string;
  ariaLabel?: string;
  onClick: (event: PointerEvent | KeyboardEvent) => void;
};

export interface MaterialSplitButtonMenuProps extends Omit<
  MaterialSplitButtonProps,
  'open' | 'menuButtonRef' | 'onToggle'
> {
  menuItems: MaterialSplitButtonMenuItem[];
  menuPlacement?: MaterialMenuPlacement;
  menuAriaLabel?: string;
}

export const MaterialSplitButtonMenu: ParentComponent<MaterialSplitButtonMenuProps> = props => {
  const [localProps, otherProps] = splitProps(props, ['menuItems', 'menuPlacement', 'menuAriaLabel']);

  const [menuRef, setMenuRef] = createSignal<Element>();
  const [isOpen, setOpen] = createSignal(false);

  const onCloseMenu = () => {
    setOpen(false);
  };

  const onToggle = (open: boolean) => {
    setOpen(open);
  };

  return (
    <>
      <MaterialSplitButton {...otherProps} menuButtonRef={setMenuRef} open={isOpen()} onToggle={onToggle} />
      <MaterialMenu
        offset={[0, 4]}
        placement={localProps.menuPlacement ?? ['bottom', 'start']}
        open={isOpen()}
        anchor={menuRef()}
        ariaLabel={localProps.menuAriaLabel}
        onClose={onCloseMenu}
      >
        <For each={localProps.menuItems}>
          {item => (
            <MaterialMenuItem ariaLabel={item.ariaLabel} onClick={item.onClick}>
              {item.label}
            </MaterialMenuItem>
          )}
        </For>
      </MaterialMenu>
    </>
  );
};
