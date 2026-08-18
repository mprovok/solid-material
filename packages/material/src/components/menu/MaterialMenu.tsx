import '@material/web/menu/menu.js';
import type { FlowComponent, Ref } from 'solid-js';

import { createMediaQuery } from '@solid-primitives/media';
import { createEffect } from 'solid-js';

import type { MenuPlacementAlignment, MenuPlacementSide } from './MaterialMenu.types';

import { getAnchorCorner, getMenuCorner } from './menu-utils';

export type MaterialMenuPlacement = [MenuPlacementSide, MenuPlacementAlignment];

export interface MaterialMenuProps {
  anchor?: Ref<Element>;
  open: boolean;
  placement?: MaterialMenuPlacement;
  stayOpenOnOutsideClick?: boolean;
  stayOpenOnFocusout?: boolean;
  offset?: [number, number];
  ariaLabel?: string;
  onClose: (event: Event) => void;
}

export const MaterialMenu: FlowComponent<MaterialMenuProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLElement;

  createEffect(() => {
    if (ref !== null && 'anchorElement' in ref) {
      ref.anchorElement = props.anchor;
    }
  });

  createEffect(() => {
    if (ref !== null && 'open' in ref) {
      ref.open = props.open;
    }
  });

  const prefersReducedMotion = createMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <md-menu
      ref={ref}
      attr:positioning="popover"
      attr:anchor-corner={Array.isArray(props.placement) ? getAnchorCorner(...props.placement) : undefined}
      attr:menu-corner={Array.isArray(props.placement) ? getMenuCorner(...props.placement) : undefined}
      bool:quick={prefersReducedMotion()}
      bool:stay-open-on-outside-click={props.stayOpenOnOutsideClick}
      bool:stay-open-on-focusout={props.stayOpenOnFocusout}
      attr:x-offset={Array.isArray(props.offset) ? props.offset[0] : undefined}
      attr:y-offset={Array.isArray(props.offset) ? props.offset[1] : undefined}
      attr:aria-label={props.ariaLabel}
      onClosed={(event: Event) => props.onClose?.(event)}
    >
      {props.children}
    </md-menu>
  );
};
