import type { JSX } from '@solidjs/web';
import type { VoidComponent } from 'solid-js';

import { For, Show, createSignal, omit } from 'solid-js';

import type { MaterialFabColor, MaterialFabSize } from '../fab/MaterialFab';

import { Transition } from '../../utils/transitions';
import { MaterialButton } from '../button/MaterialButton';
import { MaterialFab } from '../fab/MaterialFab';

import styles from './MaterialFabMenu.module.css';

import CloseIcon from '@solidmaterial/icons/400/outlined/close.svg';

export type MaterialFabMenuItem = {
  label: string;
  icon?: JSX.Element;
  ariaLabel?: string;
  onClick: (event: PointerEvent | KeyboardEvent) => void;
};

export interface MaterialFabMenuProps {
  items: MaterialFabMenuItem[];
  icon: JSX.Element;

  color?: MaterialFabColor;
  size?: MaterialFabSize;

  title?: string;
  ariaLabel?: string;

  closeButtonAriaLabel?: string;
}

export const MaterialFabMenu: VoidComponent<MaterialFabMenuProps> = props => {
  const otherProps = omit(props, 'items', 'icon', 'ariaLabel', 'closeButtonAriaLabel');

  const [isOpen, setOpen] = createSignal(false);

  const onClickFab = () => {
    setOpen(v => !v);
  };

  return (
    <sm-fab-menu class={styles['fab-menu']}>
      <div data-open={isOpen()} class={styles['fab']}>
        <MaterialFab
          {...otherProps}
          icon={isOpen() ? <CloseIcon /> : props.icon}
          iconOnly={true}
          shape={isOpen() ? 'round' : 'square'}
          ariaLabel={isOpen() ? props.closeButtonAriaLabel : props.ariaLabel}
          ariaExpanded={isOpen()}
          onClick={onClickFab}
        />
      </div>
      <Transition>
        <Show when={isOpen()}>
          <div role="menu" class={styles['menu']}>
            <For each={props.items}>
              {item => (
                <div role="menuitem" class={styles['item']}>
                  <MaterialButton
                    variant="tonal"
                    size="medium"
                    icon={item.icon}
                    ariaLabel={item.ariaLabel}
                    onClick={(event: PointerEvent) => {
                      item.onClick(event);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </MaterialButton>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Transition>
    </sm-fab-menu>
  );
};
