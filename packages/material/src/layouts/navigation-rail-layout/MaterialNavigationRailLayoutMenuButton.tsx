import type { VoidComponent } from 'solid-js';

import { Show, useContext } from 'solid-js';

import type { MaterialNavigationMenuButton } from '../../components/navigation-rail/MaterialNavigationRailMenuButton';

import { MaterialNavigationRailMenuButton } from '../../components/navigation-rail/MaterialNavigationRailMenuButton';

import { MaterialNavigationRailMenuContext } from './MaterialNavigationRailLayout';

export type MaterialNavigationRailLayoutMenuButtonProps = MaterialNavigationMenuButton;

/**
 * Render a menu button to show or hide a navigation rail if that rail
 * is modal and hidden (when collapsed), otherwise renders nothing
 *
 * Should be used in the `leadingButton` prop of the {@link MaterialAppBar}.
 */
export const MaterialNavigationRailLayoutMenuButton: VoidComponent<
  MaterialNavigationRailLayoutMenuButtonProps
> = props => {
  const [isRailMenuButtonVisible, isRailExpanded, onClickMenuButton] = useContext(MaterialNavigationRailMenuContext);

  return (
    <Show when={isRailMenuButtonVisible()}>
      <MaterialNavigationRailMenuButton {...props} expanded={isRailExpanded()} onClick={onClickMenuButton} />
    </Show>
  );
};
