import type { FlowComponent } from 'solid-js';

import { createWindowSize } from '@solid-primitives/resize-observer';
import { children, createMemo, splitProps, useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { Breakpoints } from '../../utils/breakpoints';
import { MaterialNavigationLayoutRailWidthContext } from '../navigation-rail-layout/MaterialNavigationRailLayout';

import type { MaterialBodyLayoutWithDragHandleProps } from './MaterialBodyLayout.types';
import type { TwoPaneLayoutProps } from './pane-layouts/pane-layout.types';

import { SplitPaneLayout } from './layouts/split-pane-layout/SplitPaneLayout';
import { TwoPaneFixedFlexibleLayout } from './layouts/two-pane-fixed-flexible-layout/TwoPaneFixedFlexibleLayout';
import { TwoPaneFlexibleFixedLayout } from './layouts/two-pane-flexible-fixed-layout/TwoPaneFlexibleFixedLayout';

export type MaterialBodyLayoutVariant = 'split' | 'flexible-fixed' | 'fixed-flexible';

export interface MaterialBodyLayoutProps extends MaterialBodyLayoutWithDragHandleProps {
  variant: MaterialBodyLayoutVariant;
}

const LAYOUTS: Record<MaterialBodyLayoutVariant, FlowComponent<TwoPaneLayoutProps>> = {
  split: SplitPaneLayout,
  'flexible-fixed': TwoPaneFlexibleFixedLayout,
  'fixed-flexible': TwoPaneFixedFlexibleLayout
};

export const MaterialBodyLayout: FlowComponent<MaterialBodyLayoutProps> = props => {
  const [localProps, otherProps] = splitProps(props, ['variant', 'children']);

  const panes = children(() => localProps.children);
  const visiblePanes = createMemo(() => panes.toArray().filter(item => item !== undefined));

  const navigationRailWidth = useContext(MaterialNavigationLayoutRailWidthContext);
  const railWidth = () => navigationRailWidth?.() ?? 0;

  const margin = () => (Breakpoints.isCompactWidth() ? 16 : 24);
  const marginLeft = () => (railWidth() === 0 && visiblePanes().length > 1 ? margin() : 0);
  const marginRight = () => (railWidth() > 0 || visiblePanes().length > 1 ? margin() : 0);

  const windowSize = createWindowSize();
  const maximumWidth = () => windowSize.width - marginLeft() - marginRight() - railWidth();

  return (
    <Dynamic
      component={LAYOUTS[localProps.variant]}
      {...otherProps}
      maximumWidth={maximumWidth()}
      margin={[marginLeft(), marginRight()]}
    >
      {visiblePanes()}
    </Dynamic>
  );
};
