import type { VoidComponent } from 'solid-js';

import { createFocusSignal } from '@solid-primitives/active-element';
import { createPerPointerListeners } from '@solid-primitives/pointer';
import { createEffect, createSignal, untrack } from 'solid-js';

import type { DragHandleDirection, DragHandleMovement } from '../../../../drag-handle/DragHandle';
import type { DragHandlePosition } from '../../../MaterialBodyLayout.types';

import { DragHandle } from '../../../../drag-handle/DragHandle';

import styles from './Spacer.module.css';

export interface SpacerProps {
  orientation: DragHandleDirection;
  position: number;
  maximum: number;
  snapWidths: number[];
  preferredWidth?: number;
  dragHandleAriaLabel?: string;
  dragHandleAriaValue?: (position: DragHandlePosition) => string;
  onMove: (position: number, delta: number) => void;
  onDrag: (isDragging: boolean) => void;
}

export const SPACER_WIDTH = 24;

export const Spacer: VoidComponent<SpacerProps> = props => {
  // The drag handle can be activated by the pointer, but
  // also by the keyboard
  const [isActive, setIsActive] = createSignal(false);

  const [isPointerActive, setIsPointerActive] = createSignal(false);
  const [pointerId, setPointerId] = createSignal<number>();
  const [hasMoved, setHasMoved] = createSignal(false);

  // oxlint-disable-next-line no-unassigned-vars
  let pointerRef!: HTMLDivElement;

  createPerPointerListeners({
    target: pointerRef,
    onDown(pointer, onMove, onUp) {
      if (pointer.pointerId === pointerId()) {
        setIsPointerActive(true);

        const startPosition = props.position;

        onMove(e => {
          if (isActive()) {
            setHasMoved(true);

            switch (props.orientation) {
              case 'horizontal': {
                props.onMove?.(startPosition, e.clientX - pointer.clientX);
                break;
              }
              case 'vertical': {
                props.onMove?.(startPosition, e.clientY - pointer.clientY);
                break;
              }
              // No default
            }
          }
        });
        onUp(() => setIsPointerActive(false));
      }
    }
  });

  createEffect(() => {
    const active = isPointerActive();
    untrack(() => {
      // If the drag handle was activated by the pointer, then call onDrag
      // so that animations for the width of the fixed pane can be disabled.
      // This causes the width of the pane to adjust instantly and not lag behind.
      props.onDrag(active);

      setIsActive(active);
      setHasMoved(false);
    });
  });

  const isFocused = createFocusSignal(() => pointerRef);

  createEffect(() => {
    if (!isFocused()) {
      untrack(() => {
        if (!isPointerActive()) {
          setIsActive(false);
        }
      });
    }
  });

  const onPointerEnter = (event: PointerEvent) => setPointerId(event.pointerId);
  const onPointerLeave = () => setPointerId(undefined);

  const onClickDragHandle = (event: PointerEvent) => {
    if (!hasMoved() && (event.detail >= 2 || event.pointerType !== 'mouse')) {
      const value = props.preferredWidth;

      if (value !== undefined) {
        props.onMove(value, 0);
      }
    }
  };

  const onKeyDownDragHandle = () => {
    if (!hasMoved()) {
      setIsActive(active => !active);
    }
  };

  const onMoveDragHandle = (direction: DragHandleMovement) => {
    // If the user has activated the drag handle, move it to one of the
    // snap positions when the user presses the ArrowLeft or ArrowRight keys
    if (isActive()) {
      // Insert the current position in the sorted array of snap positions
      // before computing the previous/next value
      const snapWidths = props.snapWidths.includes(props.position)
        ? props.snapWidths
        : [...props.snapWidths, props.position].toSorted((a, b) => a - b);

      const index = snapWidths.indexOf(props.position);
      const value = snapWidths[index + direction];

      if (value !== undefined) {
        props.onMove(value, 0);
      }
    }
  };

  const dragHandleValuePercentage = () => Math.round((props.position / props.maximum) * 100);
  const dragHandlePositionData = (): DragHandlePosition => ({
    value: props.position,
    maximum: props.maximum,
    percentage: dragHandleValuePercentage(),
    snapWidths: props.snapWidths
  });

  const onContextMenu = (event: Event) => {
    // Prevent activating long-press when holding drag handle on mobile
    event.preventDefault();
  };

  return (
    <sm-spacer
      ref={pointerRef}
      class={styles['spacer']}
      bool:data-active={isActive()}
      attr:data-orientation={props.orientation}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onContextMenu={onContextMenu}
    >
      <DragHandle
        active={isActive()}
        direction="horizontal"
        ariaLabel={props.dragHandleAriaLabel}
        ariaValueText={props.dragHandleAriaValue ? props.dragHandleAriaValue(dragHandlePositionData()) : undefined}
        ariaValue={dragHandleValuePercentage()}
        onClick={onClickDragHandle}
        onKeyDown={onKeyDownDragHandle}
        onMove={onMoveDragHandle}
      />
    </sm-spacer>
  );
};

export interface EmptySpacerProps {
  orientation: DragHandleDirection;
}

export const EmptySpacer: VoidComponent<EmptySpacerProps> = props => {
  return <sm-spacer attr:data-orientation={props.orientation} class={styles['spacer']} />;
};
