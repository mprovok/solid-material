import type { FlowComponent } from 'solid-js';

import { Show, children, createMemo, createSignal } from 'solid-js';

import type { FixedAndFlexiblePaneLayoutProps } from '../pane-layout.types';

import { isRTL } from '../../../../utils/i18n';

import { EmptySpacer, SPACER_WIDTH, Spacer } from './spacer/Spacer';

import styles from './TwoPanesWithSpacerLayout.module.css';

const clamp = (min: number, value: number, max: number) => Math.min(Math.max(min, value), max);

const SNAP_MARGIN = 50;

export interface TwoPanesWithSpacerLayoutProps extends FixedAndFlexiblePaneLayoutProps {
  offsetLeft: number;
  offsetRight: number;
  leftPaneWidth?: number;
  rightPaneWidth?: number;
  getUpdatedPosition: (position: number, delta: number) => number;
}

export const TwoPanesWithSpacerLayout: FlowComponent<TwoPanesWithSpacerLayoutProps> = props => {
  const [isDraggingHandle, setIsDraggingHandle] = createSignal(false);

  const maximumWidth = createMemo(() => props.maximumWidth - SPACER_WIDTH);
  const clampedWidth = () => clamp(0, props.width, maximumWidth());

  const onMoveSpacer = (position: number, delta: number) => {
    const clampedPosition = clamp(0, props.getUpdatedPosition(position, delta), maximumWidth());
    props.onMoveSpacer?.(clampedPosition, [0, maximumWidth()]);
  };

  const onDragSpacer = (isDragging: boolean) => {
    setIsDraggingHandle(isDragging);

    // Snap to the closest width when user drops drag handle
    if (!isDragging) {
      const sortedSnapWidths = props.snapWidths.toSorted(
        (a, b) => Math.abs(a - props.width) - Math.abs(b - props.width)
      );
      const snapToWidth = sortedSnapWidths.find(
        value => value - SNAP_MARGIN <= props.width && props.width <= value + SNAP_MARGIN
      );
      const clampedPosition = clamp(0, snapToWidth ?? props.width, maximumWidth());
      props.onMoveSpacer?.(clampedPosition, [0, maximumWidth()]);
    }

    props.onDragSpacer?.(isDragging);
  };

  const panes = children(() => props.children);
  const visiblePanesCount = createMemo(() => panes.toArray().filter(item => item !== undefined).length);

  // Hidden panes are excluded from participating in tabbing order by
  // making them inert. A pane cannot be excluded by setting its visibility
  // to hidden in CSS because that causes the pane to disappear while the
  // the width is transitioning to zero when the user uses the arrow keys
  // on the drag handle to hide a pane
  const isLeftPaneVisible = () =>
    props.leftPaneWidth !== undefined ? props.leftPaneWidth > 0 : props.maximumWidth > (props.rightPaneWidth ?? 0);
  const isRightPaneVisible = () =>
    props.rightPaneWidth !== undefined ? props.rightPaneWidth > 0 : props.maximumWidth > (props.leftPaneWidth ?? 0);

  return (
    <sm-body-layout
      bool:data-dragging={isDraggingHandle()}
      class={styles['layout']}
      style={{
        'padding-inline-start': `${props.margin[0]}px`,
        'padding-inline-end': `${props.margin[1]}px`
      }}
    >
      <div
        class={styles['pane']}
        inert={!isLeftPaneVisible()}
        aria-hidden={!isLeftPaneVisible()}
        style={{
          'min-width': props.leftPaneWidth !== undefined ? `${props.leftPaneWidth}px` : undefined,
          'max-width': props.leftPaneWidth !== undefined ? `${props.leftPaneWidth}px` : undefined
        }}
      >
        {panes.toArray()[0]}
      </div>
      <Show when={visiblePanesCount() > 1}>
        <div
          class={styles['spacer']}
          style={{
            width: `${Math.min(props.offsetLeft, props.offsetRight)}px`,
            translate: `${(props.offsetRight - SPACER_WIDTH) * (isRTL() ? -1 : 1)}px`
          }}
        >
          <Show when={props.showDragHandle !== false} fallback={<EmptySpacer orientation="horizontal" />}>
            <Spacer
              orientation="horizontal"
              position={clampedWidth()}
              maximum={maximumWidth()}
              snapWidths={props.snapWidths}
              preferredWidth={props.preferredWidth}
              dragHandleAriaLabel={props.dragHandleAriaLabel}
              dragHandleAriaValue={props.dragHandleAriaValue}
              onMove={onMoveSpacer}
              onDrag={onDragSpacer}
            />
          </Show>
        </div>
        <div
          class={styles['pane']}
          inert={!isRightPaneVisible()}
          aria-hidden={!isRightPaneVisible()}
          style={{
            'min-width': props.rightPaneWidth !== undefined ? `${props.rightPaneWidth}px` : undefined,
            'max-width': props.rightPaneWidth !== undefined ? `${props.rightPaneWidth}px` : undefined
          }}
        >
          {panes.toArray()[1]}
        </div>
      </Show>
    </sm-body-layout>
  );
};
