import type { VoidComponent } from 'solid-js';

import { splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

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
  const [localProps, otherProps] = splitProps(props, ['expanded', 'icon', 'label', 'title', 'ariaLabel']);

  return (
    <MaterialFab
      {...otherProps}
      size="small"
      icon={<Dynamic component={localProps.icon} />}
      ariaLabel={localProps.expanded ? undefined : (localProps.ariaLabel ?? localProps.label)}
      title={localProps.expanded ? undefined : (localProps.title ?? localProps.label)}
    >
      {localProps.expanded ? localProps.label : undefined}
    </MaterialFab>
  );
};
