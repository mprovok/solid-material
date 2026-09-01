import type { VoidComponent } from 'solid-js';

import { focus } from '@solid-primitives/active-element';
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

  const [isPointerActive, setIsPointerActive] = createSignal(false, { ownedWrite: true });
  const [hasMoved, setHasMoved] = createSignal(false, { ownedWrite: true });

  // oxlint-disable-next-line no-unassigned-vars
  let pointerRef!: HTMLDivElement;

  createPerPointerListeners({
    onDown(pointer, onMove, onUp) {
      if (!(pointer.target instanceof HTMLElement) || !pointerRef?.contains(pointer.target)) {
        return;
      }

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
  });

  createEffect(
    () => isPointerActive(),
    isPointerActive => {
      // If the drag handle was activated by the pointer, then call onDrag
      // so that animations for the width of the fixed pane can be disabled.
      // This causes the width of the pane to adjust instantly and not lag behind.
      props.onDrag(isPointerActive);

      setIsActive(isPointerActive);
      setHasMoved(false);
    }
  );

  const onFocus = (focus: boolean) => {
    const pointerActive = untrack(() => isPointerActive());

    if (!focus && !pointerActive) {
      setIsActive(false);
    }
  };

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
      const index = props.snapWidths.indexOf(props.position);
      const value = props.snapWidths[index + direction];

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
      ref={[
        focus(onFocus),
        (el: HTMLDivElement) => {
          pointerRef = el;
        }
      ]}
      class={styles['spacer']}
      data-active={isActive()}
      data-orientation={props.orientation}
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
  return <sm-spacer data-orientation={props.orientation} class={styles['spacer']} />;
};
