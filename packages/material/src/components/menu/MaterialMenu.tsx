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

  createEffect(
    () => props.anchor,
    anchor => {
      if (ref !== null && 'anchorElement' in ref) {
        ref.anchorElement = anchor;
      }
    }
  );

  createEffect(
    () => props.open,
    open => {
      if (ref !== null && 'open' in ref) {
        ref.open = open;
      }
    }
  );

  const prefersReducedMotion = createMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <md-menu
      ref={ref}
      positioning="popover"
      anchor-corner={Array.isArray(props.placement) ? getAnchorCorner(...props.placement) : undefined}
      menu-corner={Array.isArray(props.placement) ? getMenuCorner(...props.placement) : undefined}
      quick={prefersReducedMotion()}
      stay-open-on-outside-click={props.stayOpenOnOutsideClick}
      stay-open-on-focusout={props.stayOpenOnFocusout}
      x-offset={Array.isArray(props.offset) ? props.offset[0] : undefined}
      y-offset={Array.isArray(props.offset) ? props.offset[1] : undefined}
      aria-label={props.ariaLabel}
      onClosed={(event: Event) => props.onClose?.(event)}
    >
      {props.children}
    </md-menu>
  );
};
