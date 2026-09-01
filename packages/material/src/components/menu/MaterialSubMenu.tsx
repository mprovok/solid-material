import '@material/web/menu/sub-menu.js';
import type { JSX } from '@solidjs/web';
import type { FlowComponent } from 'solid-js';

import { MaterialIcon } from '../icon/MaterialIcon';

import type { MenuPlacementAlignment, MenuPlacementSide } from './MaterialMenu.types';

import { getAnchorCorner, getMenuCorner } from './menu-utils';

import ArrowRightIcon from '@solidmaterial/icons/400/outlined/arrow_right.svg';

export interface MaterialSubMenuProps {
  label: JSX.Element;
  disabled?: boolean;
  placement?: [MenuPlacementSide, MenuPlacementAlignment];
}

export const MaterialSubMenu: FlowComponent<MaterialSubMenuProps> = props => {
  return (
    <md-sub-menu
      anchor-corner={Array.isArray(props.placement) ? getAnchorCorner(...props.placement) : undefined}
      menu-corner={Array.isArray(props.placement) ? getMenuCorner(...props.placement) : undefined}
    >
      <md-menu-item slot="item" disabled={props.disabled}>
        {props.label}
        <MaterialIcon slot="end">
          <ArrowRightIcon />
        </MaterialIcon>
      </md-menu-item>
      <md-menu slot="menu" positioning="popover">
        {props.children}
      </md-menu>
    </md-sub-menu>
  );
};
