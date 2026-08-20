import type { FlowComponent, JSX } from 'solid-js';

import { Show, createEffect, createSignal } from 'solid-js';

import { MaterialDivider } from '../divider/MaterialDivider';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';
import { H1 } from '../typography/Typography';

import styles from './MaterialSideSheet.module.css';

import ArrowBackIcon from '@solidmaterial/icons/400/outlined/arrow_back.svg';
import CloseIcon from '@solidmaterial/icons/400/outlined/close.svg';

const EASING_DECELERATE_MS = 250;

const CLOSED_BY: Record<MaterialSideSheetVariant, 'any' | 'closerequest' | 'none' | undefined> = {
  modal: 'any',
  standard: 'none'
};

export type MaterialSideSheetVariant = 'standard' | 'modal';

export interface MaterialSideSheetProps {
  variant: MaterialSideSheetVariant;
  open: boolean;
  title?: string;
  actions?: JSX.Element;
  divider?: boolean;
  detached?: boolean;
  backButtonAriaLabel?: string;
  closeButtonAriaLabel?: string;
  onClickBack?: (event: PointerEvent) => void;
  onClickClose?: (event?: PointerEvent) => void;
  onClose?: (event: ToggleEvent) => void;
}

export const MaterialSideSheet: FlowComponent<MaterialSideSheetProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDialogElement;

  const [isOpen, setIsOpen] = createSignal(props.open);

  createEffect(() => {
    setIsOpen(props.open);
  });

  createEffect(() => {
    if (isOpen()) {
      if (props.variant === 'modal') {
        ref.showModal();
      } else {
        ref.show();
      }
    } else {
      setTimeout(() => {
        ref.close();
      }, EASING_DECELERATE_MS);
    }
  });

  const onToggle = (event: ToggleEvent) => {
    if (event.newState === 'closed') {
      // Notify the user of this component that the side sheet has been closed
      props.onClose?.(event);
    }
  };

  const onClick = (event: MouseEvent) => {
    // Detect the user wants to close by clicking on the backdrop
    if (event.target === ref) {
      setIsOpen(false);
    }
  };

  return (
    // oxlint-disable-next-line jsx_a11y/click-events-have-key-events jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      bool:data-open={isOpen()}
      closedby={CLOSED_BY[props.variant]}
      class={styles['dialog']}
      onToggle={onToggle}
      onClick={onClick}
    >
      <sm-side-sheet
        class={styles['sheet']}
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
        role="complementary"
        bool:data-detached={props.variant === 'standard' && props.detached === true}
        bool:data-divider={props.variant === 'standard' && props.detached !== true && props.divider}
        attr:data-variant={props.variant}
      >
        <div class={styles['container']}>
          <md-elevation></md-elevation>
          <div class={styles['body']}>
            <div class={styles['header']}>
              <Show when={props.onClickBack}>
                <div class={styles['back-button']}>
                  <MaterialIconButton
                    variant="text"
                    icon={<ArrowBackIcon />}
                    ariaLabel={props.backButtonAriaLabel}
                    onClick={(event: PointerEvent) => props.onClickBack?.(event)}
                  />
                </div>
              </Show>
              <Show when={props.title}>
                <H1 role="title" size="large">
                  {props.title}
                </H1>
              </Show>
              <Show when={props.onClickClose}>
                <div class={styles['close-button']}>
                  <MaterialIconButton
                    variant="text"
                    icon={<CloseIcon />}
                    ariaLabel={props.closeButtonAriaLabel}
                    onClick={(event: PointerEvent) => props.onClickClose?.(event)}
                  />
                </div>
              </Show>
            </div>
            <div class={styles['content']}>{props.children}</div>
          </div>
          <Show when={props.actions}>
            <div class={styles['footer']}>
              <Show when={props.divider}>
                <MaterialDivider />
              </Show>
              <div class={styles['actions']}>{props.actions}</div>
            </div>
          </Show>
        </div>
      </sm-side-sheet>
    </dialog>
  );
};
