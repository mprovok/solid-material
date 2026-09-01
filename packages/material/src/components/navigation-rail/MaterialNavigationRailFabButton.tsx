import type { VoidComponent } from 'solid-js';

import { Dynamic } from '@solidjs/web';
import { omit } from 'solid-js';

import type { MaterialFabProps } from '../fab/MaterialFab';
import type { MaterialIconSvg } from '../icon/MaterialIcon';

import { MaterialFab } from '../fab/MaterialFab';

export type MaterialNavigationRailFab = Omit<MaterialFabProps, 'icon' | 'size'> & {
  label: string;
  icon: MaterialIconSvg;
};

export interface MaterialNavigationRailFabButtonProps extends MaterialNavigationRailFab {
  expanded: boolean;
}

export const MaterialNavigationRailFabButton: VoidComponent<MaterialNavigationRailFabButtonProps> = props => {
  const otherProps = omit(props, 'expanded', 'icon', 'label', 'title', 'ariaLabel');

  return (
    <MaterialFab
      {...otherProps}
      size="small"
      icon={<Dynamic component={props.icon} />}
      ariaLabel={props.expanded ? undefined : (props.ariaLabel ?? props.label)}
      title={props.expanded ? undefined : (props.title ?? props.label)}
    >
      {props.expanded ? props.label : undefined}
    </MaterialFab>
  );
};
