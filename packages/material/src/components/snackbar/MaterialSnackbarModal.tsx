import type { VoidComponent } from 'solid-js';

import { onSettled, untrack } from 'solid-js';

import type { MaterialSnack, MaterialSnackDuration } from './MaterialSnackbarContext';

import { MaterialSnackbar } from './components/snackbar/MaterialSnackbar';

import styles from './MaterialSnackbarModal.module.css';

const DURATIONS: Record<Exclude<MaterialSnackDuration, 'indefinite'>, number> = {
  short: 4_000,
  long: 10_000
};

export type MaterialSnackbarModalAlignment = 'start' | 'center';

export interface MaterialSnackbarModalProps {
  alignment?: MaterialSnackbarModalAlignment;
  closeTitle?: string;
  snack: MaterialSnack;
  onClose: () => void;
}

export const MaterialSnackbarModal: VoidComponent<MaterialSnackbarModalProps> = props => {
  const snack = untrack(() => props.snack);

  onSettled(() => {
    let timer: number | undefined;

    if (!snack.dismissable && snack.duration !== 'indefinite') {
      const duration = DURATIONS[snack.duration ?? (snack.action?.label !== undefined ? 'long' : 'short')];
      timer = setTimeout(props.onClose, duration);
    }

    return () => clearTimeout(timer);
  });

  const onAction = () => {
    snack.action?.onClick();
    props.onClose();
  };

  const onClose = () => {
    props.onClose();
  };

  return (
    <div popover="manual" class={styles['modal']} data-alignment={props.alignment}>
      <MaterialSnackbar
        actionLabel={snack.action?.label}
        closeTitle={props.closeTitle}
        onAction={onAction}
        onClose={snack.dismissable ? onClose : undefined}
      >
        {snack.text}
      </MaterialSnackbar>
    </div>
  );
};
