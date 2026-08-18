import type { FlowComponent } from 'solid-js';

import { MaterialNavigationBarLayout } from '../navigation-bar-layout/MaterialNavigationBarLayout';
import { MaterialNavigationRailLayout } from '../navigation-rail-layout/MaterialNavigationRailLayout';

import type { MaterialNavigationLayoutProps } from './MaterialNavigationLayout.types';

export const MaterialNavigationLayout: FlowComponent<MaterialNavigationLayoutProps> = props => {
  return (
    <MaterialNavigationBarLayout {...props}>
      <MaterialNavigationRailLayout {...props}>{props.children}</MaterialNavigationRailLayout>
    </MaterialNavigationBarLayout>
  );
};
