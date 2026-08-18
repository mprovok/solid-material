import '@material/web/focus/md-focus-ring.js';
import type { MdFocusRing } from '@material/web/focus/md-focus-ring';
import type { VoidComponent } from 'solid-js';

import { createEffect, onCleanup } from 'solid-js';

export interface MaterialFocusRingProps {
  attachTo: HTMLElement | undefined;
  visible?: boolean;
  inward?: boolean;
}

export const MaterialFocusRing: VoidComponent<MaterialFocusRingProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: MdFocusRing;

  createEffect(() => {
    if (props.attachTo && ref !== undefined) {
      ref.attach(props.attachTo);

      onCleanup(() => {
        ref.detach();
      });
    }
  });

  return <md-focus-ring ref={ref} bool:visible={props.visible} bool:inward={props.inward}></md-focus-ring>;
};
