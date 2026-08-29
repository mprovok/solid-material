import type { FlowComponent } from 'solid-js';

import { createWindowSize } from '@solid-primitives/resize-observer';
import { children, createEffect, createMemo, createSignal } from 'solid-js';

import type { TwoPaneLayoutProps } from '../../pane-layouts/pane-layout.types';

import { Breakpoints } from '../../../../utils/breakpoints';
import { FlexibleFixedLayout } from '../../pane-layouts/flexible-fixed-layout/FlexibleFixedLayout';
import { SPACER_WIDTH } from '../../pane-layouts/two-panes-with-spacer-layout/spacer/Spacer';

export const SplitPaneLayout: FlowComponent<TwoPaneLayoutProps> = props => {
  const windowSize = createWindowSize();

  const smallSnapWidth = () => (Breakpoints.isExtraLargeWidth() ? 412 : 360);

  const visuallyCentered = () => windowSize.width / 2 - SPACER_WIDTH / 2 - props.margin[1];
  const snapWidths = () => [smallSnapWidth(), visuallyCentered()];

  // Do not make the initial width reactive to the width of the window
  const initialWidth = visuallyCentered();

  const [width, setWidth] = createSignal(initialWidth);

  createEffect<number>(prevWindowWidth => {
    if (windowSize.width !== prevWindowWidth) {
      const oldPercentage = width() / (prevWindowWidth - SPACER_WIDTH);
      setWidth(oldPercentage * (windowSize.width - SPACER_WIDTH));
    }

    return windowSize.width;
  }, windowSize.width);

  const panes = children(() => props.children);
  const visiblePanesCount = createMemo(() => panes.toArray().filter(item => item !== undefined).length);

  const fixedPaneWidth = () => (visiblePanesCount() > 1 ? width() : 0);
  const showDragHandle = () => (visiblePanesCount() > 1 ? props.showDragHandle : false);

  const onMoveSpacer = (position: number, range: [number, number]) => {
    setWidth(position);
    props.onMoveSpacer?.(position, range);
  };

  return (
    <FlexibleFixedLayout
      margin={props.margin}
      maximumWidth={props.maximumWidth}
      width={fixedPaneWidth()}
      snapWidths={snapWidths()}
      preferredWidth={visuallyCentered()}
      showDragHandle={showDragHandle()}
      dragHandleAriaLabel={props.dragHandleAriaLabel}
      dragHandleAriaValue={props.dragHandleAriaValue}
      onMoveSpacer={onMoveSpacer}
      onDragSpacer={props.onDragSpacer}
      class={props.class}
    >
      {panes()}
    </FlexibleFixedLayout>
  );
};
