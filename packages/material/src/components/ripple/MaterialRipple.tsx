import '@material/web/ripple/ripple.js';
import type { MdRipple } from '@material/web/ripple/ripple';
import type { VoidComponent } from 'solid-js';

import { createEffect, onCleanup } from 'solid-js';

export interface MaterialRippleProps {
  attachTo: HTMLElement | undefined;
  disabled?: boolean;
}

export const MaterialRipple: VoidComponent<MaterialRippleProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: MdRipple;

  createEffect(() => {
    if (props.attachTo && ref !== undefined) {
      ref.attach(props.attachTo);

      onCleanup(() => {
        ref.detach();
      });
    }
  });

  return <md-ripple ref={ref} bool:disabled={props.disabled}></md-ripple>;
};
