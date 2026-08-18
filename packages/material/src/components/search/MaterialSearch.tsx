import type { Accessor, Context, FlowComponent, Signal } from 'solid-js';

import { createContext, createEffect, createSignal } from 'solid-js';

import { Breakpoints } from '../../utils/breakpoints';

import styles from './MaterialSearch.module.css';

export const MaterialSearchFocusContext: Context<Signal<boolean>> = createContext(createSignal(false));
export const MaterialSearchOpenContext: Context<Accessor<boolean>> = createContext<Accessor<boolean>>(() => false);

export type MaterialSearchLayout = 'fullscreen' | 'docked';

export interface MaterialSearchProps {
  open: boolean;
  layout?: MaterialSearchLayout;
  scrim?: boolean;
  ariaLabel?: string;
}

export const MaterialSearch: FlowComponent<MaterialSearchProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDialogElement;

  const [hasFocus, setHasFocus] = createSignal(false);
  const [isOpen, setIsOpen] = createSignal(props.open && hasFocus());

  createEffect(() => {
    setIsOpen(props.open && hasFocus());
  });

  const layout = () => props.layout ?? (Breakpoints.isCompactWidth() ? 'fullscreen' : 'docked');
  const isDocked = () => isOpen() && layout() === 'docked';

  createEffect(() => {
    if (isOpen()) {
      if (ref.open) {
        ref.close();
      }
      if (layout() === 'docked') {
        ref.showModal();
      } else {
        ref.show();
      }
      ref.querySelector('input')?.focus();
    } else {
      ref.close();
    }
  });

  const onClick = (event: MouseEvent) => {
    if (event.target === ref) {
      setHasFocus(false);
      ref.querySelector('input')?.blur();
    }
  };

  const onCancel = (event: Event) => {
    event.preventDefault();
    setHasFocus(false);
    ref.querySelector('input')?.blur();
  };

  return (
    <div class={styles['wrapper']}>
      {/* oxlint-disable-next-line jsx_a11y/click-events-have-key-events jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={ref}
        closedby="closerequest"
        popover="manual"
        bool:data-modal={isDocked()}
        bool:data-scrim={props.scrim ?? true}
        class={styles['dialog']}
        onClick={onClick}
        onCancel={onCancel}
      >
        <search
          attr:data-layout={layout()}
          bool:data-open={isOpen()}
          aria-label={props.ariaLabel}
          class={styles['container']}
        >
          <MaterialSearchFocusContext.Provider value={[hasFocus, setHasFocus]}>
            <MaterialSearchOpenContext.Provider value={isOpen}>{props.children}</MaterialSearchOpenContext.Provider>
          </MaterialSearchFocusContext.Provider>
        </search>
      </dialog>
    </div>
  );
};
