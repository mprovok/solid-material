import type { VoidComponent } from 'solid-js';

import { Show } from 'solid-js';

import { MaterialIconButton } from '../icon-button/MaterialIconButton';

import MenuIcon from '@solidmaterial/icons/400/outlined/menu.svg';
import MenuOpenIcon from '@solidmaterial/icons/400/outlined/menu_open.svg';

export type MaterialNavigationMenuButton = {
  ariaLabel?: string;
  ariaLabelSelected?: string;
  title?: string;
  titleSelected?: string;
};

export interface MaterialNavigationRailMenuButtonProps extends MaterialNavigationMenuButton {
  expanded: boolean;
  onClick?: (event: PointerEvent) => void;
}

export const MaterialNavigationRailMenuButton: VoidComponent<MaterialNavigationRailMenuButtonProps> = props => {
  const label = () => (props.expanded ? props.ariaLabelSelected : props.ariaLabel);
  const title = () => (props.expanded ? props.titleSelected : props.title);

  return (
    <MaterialIconButton
      variant="text"
      icon={
        <Show when={props.expanded} fallback={<MenuIcon />}>
          <MenuOpenIcon />
        </Show>
      }
      toggle={props.expanded}
      ariaLabel={label()}
      title={title()}
      onClick={props.onClick}
    />
  );
};
