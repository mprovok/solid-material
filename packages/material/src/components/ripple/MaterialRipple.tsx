import type { MdRipple } from '@material/web/ripple/ripple';

import '@material/web/ripple/ripple.js';
import type { VoidComponent } from 'solid-js';

import { createEffect } from 'solid-js';

export interface MaterialRippleProps {
  attachTo: HTMLElement | undefined;
  disabled?: boolean;
}

export const MaterialRipple: VoidComponent<MaterialRippleProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: MdRipple;

  createEffect(
    () => props.attachTo,
    attachTo => {
      if (attachTo) {
        ref.attach(attachTo);
      }
      return () => ref.detach();
    }
  );

  return <md-ripple ref={ref} disabled={props.disabled}></md-ripple>;
};
