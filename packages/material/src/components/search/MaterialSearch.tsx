import type { Accessor, Context, FlowComponent } from 'solid-js';

import { createContext, createEffect, createSignal } from 'solid-js';

import { Breakpoints } from '../../utils/breakpoints';

import styles from './MaterialSearch.module.css';

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

  const [isOpen, setOpen] = createSignal(() => props.open);

  const layout = () => props.layout ?? (Breakpoints.isCompactWidth() ? 'fullscreen' : 'docked');
  const isDocked = () => isOpen() && layout() === 'docked';

  createEffect(
    () => [layout(), isOpen()] as const,
    ([layout, isOpen]) => {
      if (isOpen) {
        if (ref.open) {
          ref.close();
        }
        if (layout === 'docked') {
          ref.showModal();
        } else {
          ref.show();
        }
        ref.querySelector('input')?.focus();
      } else {
        ref.close();
      }
    }
  );

  const onClick = (event: MouseEvent) => {
    if (event.target === ref) {
      setOpen(false);
    }
  };

  const onCancel = (event: Event) => {
    event.preventDefault();
    setOpen(false);
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
          <MaterialSearchOpenContext value={isOpen}>{props.children}</MaterialSearchOpenContext>
        </search>
      </dialog>
    </div>
  );
};
