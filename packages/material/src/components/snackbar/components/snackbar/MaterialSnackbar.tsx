import type { FlowComponent } from 'solid-js';

import { Show, createUniqueId } from 'solid-js';

import { MaterialButton } from '../../../button/MaterialButton';
import { MaterialIconButton } from '../../../icon-button/MaterialIconButton';
import { Span } from '../../../typography/Typography';

import styles from './MaterialSnackbar.module.css';

import CloseIcon from '@solid-material/icons/400/outlined/close.svg';

export interface MaterialSnackbarProps {
  actionLabel?: string;
  closeTitle?: string;
  onAction?: () => void;
  onClose?: () => void;
}

export const MaterialSnackbar: FlowComponent<MaterialSnackbarProps> = props => {
  const id = createUniqueId();

  return (
    <sm-snackbar
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="status"
      attr:aria-atomic="true"
      attr:aria-live="polite"
      attr:aria-labelledby={id}
      class={styles['snackbar']}
    >
      <md-elevation></md-elevation>
      <div class={styles['body']}>
        <div class={styles['supporting-text']}>
          <Span role="body" size="medium" id={id}>
            {props.children}
          </Span>
        </div>
        <Show when={props.actionLabel}>
          <div class={styles['action']}>
            <MaterialButton variant="text" onClick={props.onAction}>
              {props.actionLabel}
            </MaterialButton>
          </div>
        </Show>
        <Show when={props.onClose}>
          <div class={styles['icon']}>
            <MaterialIconButton variant="text" icon={<CloseIcon />} title={props.closeTitle} onClick={props.onClose} />
          </div>
        </Show>
      </div>
    </sm-snackbar>
  );
};
