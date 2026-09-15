import type { Accessor, Context, FlowComponent, Signal } from 'solid-js';

import { createContext, createEffect, createSignal, untrack } from 'solid-js';

import { Breakpoints } from '../../utils/breakpoints';

import styles from './MaterialSearch.module.css';

export const MaterialSearchShouldExpandContext: Context<Accessor<boolean>> = createContext<Accessor<boolean>>();
export const MaterialSearchOpenContext: Context<Signal<boolean>> = createContext<Signal<boolean>>();

export type MaterialSearchLayout = 'fullscreen' | 'docked';

export interface MaterialSearchProps {
  layout?: MaterialSearchLayout;
  scrim?: boolean;
  ariaLabel?: string;
}

export const MaterialSearch: FlowComponent<MaterialSearchProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDialogElement;

  const [isOpen, setOpen] = createSignal(false);
  const [shouldExpand, setShouldExpand] = createSignal(false);

  const layout = () => props.layout ?? (Breakpoints.isCompactWidth() ? 'fullscreen' : 'docked');
  const isDocked = () => isOpen() && layout() === 'docked';

  createEffect(
    () => isOpen(),
    isOpen => {
      const currentLayout = untrack(() => layout());
      if (isOpen) {
        if (ref.open) {
          ref.close();
        }
        if (currentLayout === 'docked') {
          ref.showModal();
        } else {
          ref.show();
        }
        setShouldExpand(true);
        ref.querySelector('input')?.focus();
      } else {
        ref.close();
      }
    }
  );

  const onClick = (event: MouseEvent) => {
    if (event.target === ref) {
      ref.querySelector('input')?.blur();
      setOpen(false);
      setShouldExpand(false);
    }
  };

  const onCancel = (event: Event) => {
    event.preventDefault();
    ref.querySelector('input')?.blur();
    setOpen(false);
    setShouldExpand(false);
  };

  return (
    <div class={styles['wrapper']}>
      {/* oxlint-disable-next-line jsx_a11y/click-events-have-key-events jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={ref}
        closedby="closerequest"
        popover="manual"
        data-modal={isDocked()}
        data-scrim={props.scrim ?? true}
        class={styles['dialog']}
        onClick={onClick}
        onCancel={onCancel}
      >
        <search data-layout={layout()} data-open={isOpen()} aria-label={props.ariaLabel} class={styles['container']}>
          <MaterialSearchShouldExpandContext value={shouldExpand}>
            <MaterialSearchOpenContext value={[isOpen, setOpen]}>{props.children}</MaterialSearchOpenContext>
          </MaterialSearchShouldExpandContext>
        </search>
      </dialog>
    </div>
  );
};
