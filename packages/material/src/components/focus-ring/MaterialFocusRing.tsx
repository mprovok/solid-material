import type { MdFocusRing } from '@material/web/focus/md-focus-ring';

import '@material/web/focus/md-focus-ring.js';
import type { VoidComponent } from 'solid-js';

import { createEffect } from 'solid-js';

export interface MaterialFocusRingProps {
  attachTo: HTMLElement | undefined;
  visible?: boolean;
  inward?: boolean;
}

export const MaterialFocusRing: VoidComponent<MaterialFocusRingProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: MdFocusRing;

  createEffect(
    () => props.attachTo,
    attachTo => {
      if (attachTo) {
        ref.attach(attachTo);
      }
      return () => ref.detach();
    }
  );

  return <md-focus-ring ref={ref} visible={props.visible} inward={props.inward}></md-focus-ring>;
};
