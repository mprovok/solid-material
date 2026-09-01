import type { JSX } from '@solidjs/web';
import type { FlowComponent } from 'solid-js';

import { createVisibilityObserver } from '@solid-primitives/intersection-observer';
import { Show, createEffect, createMemo, createSignal, untrack } from 'solid-js';

import type { DragHandleMovement } from '../../layouts/drag-handle/DragHandle';

import { DragHandle } from '../../layouts/drag-handle/DragHandle';
import { mod } from '../../utils/a11y';

import styles from './MaterialBottomSheet.module.css';

export type MaterialBottomSheetVariant = 'standard' | 'modal';

export interface MaterialBottomSheetProps {
  variant: MaterialBottomSheetVariant;
  open: boolean;
  flat?: boolean;
  supportFullHeight?: boolean;
  dragHandle?: boolean;
  dragHandleAriaLabel?: string;
  availableIndices?: number[];
  onClose?: (event?: ToggleEvent) => void;
}

const POPOVER_TYPE: Record<MaterialBottomSheetVariant, JSX.HTMLAttributes<HTMLDialogElement>['popover']> = {
  standard: 'manual',
  modal: undefined
};

export const MaterialBottomSheet: FlowComponent<MaterialBottomSheetProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDialogElement;

  const [refSheet, setRefSheet] = createSignal<HTMLDivElement>();

  // Use the IntersectionObserver API to detect the user has swiped the sheet out of view
  const isVisible = createVisibilityObserver(refSheet, { initialValue: false });

  const [currentIndex, setCurrentIndex] = createSignal(0);

  const supportFullHeight = () => props.supportFullHeight === true;

  const showItem = (index: number) => {
    const query = `.${styles['container']} > section > :nth-child(${index + 1})`;
    const element = ref?.querySelector(query);
    element?.scrollIntoView(false);
  };

  const showAllItems = () => {
    const element = ref.querySelector(`.${styles['container']}`);
    element?.scrollIntoView(false);
  };

  const showFullHeight = () => {
    const element = ref.querySelector('sm-bottom-sheet');
    element?.scrollIntoView(false);
  };

  const showBottomSheet = () => {
    // Make sure the bottom sheet is instantly moved to just below the viewport
    // before scrolling it to one of the children of the bottom sheet
    ref.scroll({ top: 0, behavior: 'instant' });

    const availableIndices = untrack(() => props.availableIndices);
    const firstIndex = availableIndices?.[0];

    // Always use the first index if it exists, otherwise show the whole bottom sheet
    if (firstIndex !== undefined) {
      showItem(firstIndex);

      // Reset the current index, set to -2 (all items) if there are one or no indices
      setCurrentIndex((availableIndices?.length ?? 0) > 0 ? 0 : -2);
    } else {
      showAllItems();
    }
  };

  const hideBottomSheet = () => {
    ref.scroll({ top: 0, behavior: 'auto' });
  };

  createEffect(
    () => props.open,
    open => {
      const variant = untrack(() => props.variant);
      switch (variant) {
        case 'modal': {
          if (open) {
            ref.showModal();
            showBottomSheet();
          } else {
            hideBottomSheet();
          }
          break;
        }
        case 'standard': {
          if (open) {
            ref.showPopover();
            showBottomSheet();
          } else {
            hideBottomSheet();
          }
          break;
        }
        // No default
      }
    }
  );

  createEffect(
    () => isVisible(),
    visible => {
      const variant = untrack(() => props.variant);
      if (!visible) {
        if (variant === 'modal') {
          ref.close();
        } else {
          ref.hidePopover();
        }
      }
    }
  );

  const onToggle = (event: ToggleEvent) => {
    if (event.newState === 'closed') {
      // Notify the user of this component that the bottom sheet has been closed
      props.onClose?.(event);
    }
  };

  const onClick = (event: MouseEvent) => {
    // Detect the user wants to close by clicking on the backdrop
    if (event.target === ref) {
      // Just scroll the sheet to the bottom and out of view
      // The effect above will subsequently close the (already hidden) dialog/popover
      hideBottomSheet();
    }
  };

  /**
   * Return the index of the next position
   *
   * @param advanceIndex A function which controls in which direction the index is advanced
   * @returns the index of the next position to show
   */
  const getNextPosition = (advanceIndex: (index: number) => number) => {
    const count = props.availableIndices?.length ?? 0;
    const getNextIndex = (index: number): number => mod(advanceIndex(index) + 2, count + 2) - 2;

    let nextIndex = getNextIndex(currentIndex());

    // -1 is an invalid index if the full height is not supported; simply
    // skip it by moving the index one more time
    if (!supportFullHeight() && nextIndex === -1) {
      nextIndex = getNextIndex(nextIndex);
    }

    // Show all items if no valid index was found, this happens when
    // props.availableIndices has zero or one item
    if (nextIndex >= 0 && props.availableIndices?.[nextIndex] === undefined) {
      throw new Error('Expected valid available index');
    }

    return nextIndex;
  };

  const moveSheet = (index: number) => {
    if (index === -2) {
      showAllItems();
    } else if (index === -1) {
      showFullHeight();
    } else {
      const indexItem = props.availableIndices?.[index];

      if (indexItem === undefined) {
        throw new Error('Expected available index');
      }

      showItem(indexItem);
    }
  };

  const onKeyDownDragHandle = () => {
    const nextIndex = getNextPosition(index => index + 1);
    moveSheet(nextIndex);
    setCurrentIndex(nextIndex);
  };

  const onClickDragHandle = (event: PointerEvent) => {
    if (event.detail === 2) {
      const nextIndex = getNextPosition(index => index + 1);
      moveSheet(nextIndex);
      setCurrentIndex(nextIndex);
    }
  };

  const onMoveDragHandle = (direction: DragHandleMovement) => {
    const nextIndex = getNextPosition(index => index + direction);

    if (direction === 1 && currentIndex() === (supportFullHeight() ? -1 : -2)) {
      return;
    }

    // Using nextIndex instead of currentIndex() because it is never 0
    // (currentIndex() can be 0 if props.availableIndices has values, otherwise it is -2)
    if (direction === -1 && nextIndex === (supportFullHeight() ? -1 : -2)) {
      return;
    }

    moveSheet(nextIndex);
    setCurrentIndex(nextIndex);
  };

  const dragHandleIndexCount = createMemo(() => {
    return (props.availableIndices?.length ?? 0) + (supportFullHeight() ? 2 : 1);
  });

  const dragHandleIndex = () => {
    const index = currentIndex();
    const count = dragHandleIndexCount();

    if (index === -2) {
      // All items
      return supportFullHeight() ? count - 1 : count;
    } else if (index === -1) {
      // Full height
      return count;
    }

    const indexItem = props.availableIndices?.[index];

    if (indexItem === undefined) {
      // Sheet is moved to reveal all items in showBottomSheet()
      return supportFullHeight() ? count - 1 : count;
    }

    // + 1 to make the index 1-based
    return indexItem + 1;
  };

  const dragHandleValuePercentage = () => Math.round((dragHandleIndex() / dragHandleIndexCount()) * 100);

  return (
    // oxlint-disable-next-line jsx_a11y/click-events-have-key-events jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      closedby="any"
      popover={POPOVER_TYPE[props.variant]}
      class={styles['dialog']}
      onToggle={onToggle}
      onClick={onClick}
    >
      <div role="presentation" class={styles['space']} />
      <sm-bottom-sheet
        ref={setRefSheet}
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
        role="complementary"
        data-variant={props.variant}
        data-flat={props.flat}
        data-full-height={supportFullHeight()}
        class={styles['sheet']}
      >
        <md-elevation></md-elevation>
        <div class={styles['container']}>
          <Show when={props.dragHandle}>
            <div class={styles['drag-handle']}>
              <DragHandle
                direction="vertical"
                active={false}
                ariaLabel={props.dragHandleAriaLabel}
                ariaValue={dragHandleValuePercentage()}
                onClick={onClickDragHandle}
                onKeyDown={onKeyDownDragHandle}
                onMove={onMoveDragHandle}
              />
            </div>
          </Show>
          <section>{props.children}</section>
        </div>
      </sm-bottom-sheet>
    </dialog>
  );
};
