import type { FlowComponent } from 'solid-js';

import { Show, createEffect } from 'solid-js';

import styles from './MaterialCarouselFullscreen.module.css';

export interface MaterialCarouselFullscreenProps {
  fullscreen: boolean;
}

export const MaterialCarouselFullscreen: FlowComponent<MaterialCarouselFullscreenProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDialogElement;

  createEffect(() => {
    if (ref !== undefined) {
      if (props.fullscreen) {
        ref.showModal();
      } else {
        ref.close();
      }
    }
  });

  return (
    <Show when={props.fullscreen} fallback={props.children}>
      <dialog ref={ref} closedby="none" class={styles['dialog']}>
        {props.children}
      </dialog>
    </Show>
  );
};
