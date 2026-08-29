import type { FlowComponent } from 'solid-js';

import { children, splitProps } from 'solid-js';

import type { MaterialBodyLayoutWithDragHandleProps } from '../../body-layout/MaterialBodyLayout.types';
import type { MaterialNavigationLayoutProps } from '../../navigation-layout/MaterialNavigationLayout.types';

import { Breakpoints } from '../../../utils/breakpoints';
import { MaterialBodyLayout } from '../../body-layout/MaterialBodyLayout';

import styles from './MaterialListDetailLayout.module.css';

export interface MaterialListDetailLayoutProps extends MaterialBodyLayoutWithDragHandleProps {
  selected: boolean;
  preferSpace?: MaterialNavigationLayoutProps['preferSpace'];
}

export const MaterialListDetailLayout: FlowComponent<MaterialListDetailLayoutProps> = props => {
  const [localProps, otherProps] = splitProps(props, ['selected', 'preferSpace', 'showDragHandle', 'children']);

  const showOnePane = () =>
    Breakpoints.isCompactWidth() || (Breakpoints.isMediumWidth() && localProps.preferSpace !== 'horizontal');

  const panes = children(() => localProps.children);
  const visibleChildren = () => (showOnePane() ? panes.toArray()[localProps.selected ? 1 : 0] : panes());

  return (
    <MaterialBodyLayout
      variant="fixed-flexible"
      showDragHandle={localProps.showDragHandle}
      class={styles['list-detail-layout']}
      {...otherProps}
    >
      {visibleChildren()}
    </MaterialBodyLayout>
  );
};
