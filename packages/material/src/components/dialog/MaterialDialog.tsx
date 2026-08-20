import '@material/web/dialog/dialog.js';
import type { FlowComponent, JSX } from 'solid-js';

import { createMediaQuery } from '@solid-primitives/media';
import { Show } from 'solid-js';

import { MaterialIconButton } from '../icon-button/MaterialIconButton';
import { MaterialIcon } from '../icon/MaterialIcon';

import styles from './MaterialDialog.module.css';

import CloseIcon from '@solidmaterial/icons/400/outlined/close.svg';

export interface MaterialDialogProps {
  open: boolean;
  icon?: JSX.Element;
  title?: string;
  ariaLabel?: string;
  actions?: JSX.Element[];
  closeButton?: boolean;
  closebuttonAriaLabel?: string;
  alert?: boolean;
  onClose?: (event: Event) => void;
}

export const MaterialDialog: FlowComponent<MaterialDialogProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDialogElement;

  const onClickCloseButton = () => ref?.close();

  const prefersReducedMotion = createMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <Show when={props.open}>
      <md-dialog
        ref={ref}
        class={styles['dialog']}
        attr:open=""
        bool:quick={prefersReducedMotion()}
        bool:no-focus-trap={props.closeButton}
        attr:type={props.alert === true ? 'alert' : undefined}
        attr:aria-label={props.ariaLabel}
        onClosed={(event: Event) => props.onClose?.(event)}
      >
        <Show when={props.icon}>
          <MaterialIcon slot="icon">{props.icon}</MaterialIcon>
        </Show>
        <Show when={props.title}>
          <div slot="headline">
            <span>{props.title}</span>
            <Show when={props.closeButton}>
              <MaterialIconButton
                variant="text"
                icon={<CloseIcon />}
                ariaLabel={props.closebuttonAriaLabel}
                onClick={onClickCloseButton}
              />
            </Show>
          </div>
        </Show>
        <div slot="content">{props.children}</div>
        <Show when={(props.actions ?? []).length > 0}>
          <div slot="actions">{props.actions}</div>
        </Show>
      </md-dialog>
    </Show>
  );
};
