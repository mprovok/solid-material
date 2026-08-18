import type { FlowComponent } from 'solid-js';

import { createWindowSize } from '@solid-primitives/resize-observer';
import { children, createMemo, createSignal } from 'solid-js';

import type { TwoPaneLayoutProps } from '../../pane-layouts/pane-layout.types';

import { Breakpoints } from '../../../../utils/breakpoints';
import { FixedFlexibleLayout } from '../../pane-layouts/fixed-flexible-layout/FixedFlexibleLayout';
import { SPACER_WIDTH } from '../../pane-layouts/two-panes-with-spacer-layout/spacer/Spacer';

export const TwoPaneFixedFlexibleLayout: FlowComponent<TwoPaneLayoutProps> = props => {
  const windowSize = createWindowSize();

  const smallSnapWidth = () => (Breakpoints.isExtraLargeWidth() ? 412 : 360);

  const rightPaneWidthFiftyPercent = () => windowSize.width / 2 - SPACER_WIDTH / 2 - props.margin[1];
  const spacerVisuallyCentered = () => props.maximumWidth - rightPaneWidthFiftyPercent() - SPACER_WIDTH;
  const snapWidths = () => [smallSnapWidth(), spacerVisuallyCentered()];

  // Do not make the initial width reactive to the width of the window
  const initialWidth = smallSnapWidth();

  const [width, setWidth] = createSignal(initialWidth);

  const panes = children(() => props.children);
  const visiblePanesCount = createMemo(() => panes.toArray().filter(item => item !== undefined).length);

  const fixedPaneWidth = () => (visiblePanesCount() > 1 ? width() : props.maximumWidth);
  const showDragHandle = () => (visiblePanesCount() > 1 ? props.showDragHandle : false);

  const onMoveSpacer = (position: number, range: [number, number]) => {
    setWidth(position);
    props.onMoveSpacer?.(position, range);
  };

  return (
    <FixedFlexibleLayout
      margin={props.margin}
      maximumWidth={props.maximumWidth}
      width={fixedPaneWidth()}
      snapWidths={snapWidths()}
      preferredWidth={spacerVisuallyCentered()}
      showDragHandle={showDragHandle()}
      dragHandleAriaLabel={props.dragHandleAriaLabel}
      dragHandleAriaValue={props.dragHandleAriaValue}
      onMoveSpacer={onMoveSpacer}
      onDragSpacer={props.onDragSpacer}
    >
      {panes()}
    </FixedFlexibleLayout>
  );
};
