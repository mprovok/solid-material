import type { JSX } from 'solid-js';

import type { MaterialNavigationItemType } from '../../components/navigation-item/MaterialNavigationItem';
import type { MaterialNavigationRailSecondaryItems } from '../../components/navigation-rail/MaterialNavigationRail';
import type { MaterialNavigationRailFab } from '../../components/navigation-rail/MaterialNavigationRailFabButton';
import type { MaterialNavigationMenuButton } from '../../components/navigation-rail/MaterialNavigationRailMenuButton';
import type { MaterialSnackbarContainerAlignment } from '../../components/snackbar/MaterialSnackbarContainer';

export type MaterialNavigationRailFabs = {
  rail?: MaterialNavigationRailFab;
  bar: JSX.Element;
};

export interface MaterialNavigationLayoutProps {
  items: MaterialNavigationItemType[];
  secondary?: MaterialNavigationRailSecondaryItems;
  fab?: MaterialNavigationRailFabs;
  menuButton?: MaterialNavigationMenuButton;
  show?: boolean;
  ariaLabel?: string;
  preferSpace?: 'horizontal' | 'vertical';
  snackbarAlignment?: MaterialSnackbarContainerAlignment;
  snackbarCloseTitle?: string;
}
