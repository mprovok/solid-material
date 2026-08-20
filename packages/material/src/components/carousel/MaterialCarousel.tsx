import type { FlowComponent } from 'solid-js';

import { createPerPointerListeners } from '@solid-primitives/pointer';
import { Show, createSignal } from 'solid-js';

import { clickElement, createOnKeyDown, focusElement, isFocusableElement } from '../../utils/a11y';
import { getPreviousOrNextFocusableElement } from '../../utils/focus';
import { MaterialButton } from '../button/MaterialButton';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';
import { H3 } from '../typography/Typography';

import { MaterialCarouselFullscreen } from './MaterialCarouselFullscreen';

import styles from './MaterialCarousel.module.css';

import ArrowForwardIcon from '@solidmaterial/icons/400/outlined/arrow_forward.svg';

export type MaterialCarouselVariant = 'multi-browse' | 'uncontained' | 'hero' | 'centered-hero' | 'full-screen';

export interface MaterialCarouselProps {
  variant: MaterialCarouselVariant;
  height?: string;
  itemMaxWidth?: string;
  header?: string;
  ariaLabel?: string;
  showAllButtonLabel?: string;
  showAllButtonAriaLabel?: string;
  showAllHeaderTitle?: string;
  onShowAll?: (event: PointerEvent) => void;
}

export const MaterialCarousel: FlowComponent<MaterialCarouselProps> = props => {
  const [isActive, setIsActive] = createSignal(false);
  const [pointerId, setPointerId] = createSignal<number>();

  // oxlint-disable-next-line no-unassigned-vars
  let pointerRef!: HTMLDivElement;

  createPerPointerListeners({
    target: pointerRef,
    onDown(pointer, onMove, onUp) {
      if (pointer.pointerType !== 'touch' && pointer.pointerId === pointerId()) {
        const startPosition = pointerRef.scrollLeft;
        onMove(e => {
          pointer.preventDefault();
          setIsActive(true);
          const dx = e.clientX - pointer.clientX;
          pointerRef.scrollLeft = startPosition - dx;
        });
        onUp(() => setIsActive(false));
      }
    }
  });

  const onPointerEnter = (event: PointerEvent) => setPointerId(event.pointerId);
  const onPointerLeave = () => setPointerId(undefined);

  // Move focus to element before or after carousel when pressing arrow up/down
  const onKeyPress = (key: string, items: HTMLElement[]) => {
    if (key === 'ArrowUp') {
      const firstItem = items.at(0);
      if (firstItem) {
        focusElement(getPreviousOrNextFocusableElement(firstItem, false));
      }
    } else if (key === 'ArrowDown') {
      const lastItem = items.at(-1);
      if (lastItem) {
        focusElement(getPreviousOrNextFocusableElement(lastItem, true));
      }
    }
  };

  const onKeyDown = createOnKeyDown(
    () => 'listitem',
    () => ['ArrowRight'],
    () => ['ArrowLeft'],
    isFocusableElement,
    () => pointerRef,
    clickElement,
    focusElement,
    onKeyPress
  );

  const isFullscreen = () => props.variant === 'full-screen';

  return (
    <>
      <Show when={props.header}>
        <div class={styles['header']}>
          <H3 role="title" size="large">
            {props.header}
          </H3>
          <Show when={props.onShowAll}>
            <div class={styles['arrow-icon']}>
              <MaterialIconButton
                variant="text"
                icon={<ArrowForwardIcon />}
                ariaLabel={props.showAllButtonAriaLabel}
                title={props.showAllHeaderTitle}
                onClick={(event: PointerEvent) => props.onShowAll?.(event)}
              />
            </div>
          </Show>
        </div>
      </Show>
      <MaterialCarouselFullscreen fullscreen={isFullscreen()}>
        <sm-carousel
          ref={pointerRef}
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
          role="list"
          aria-label={props.ariaLabel}
          tabindex={-1}
          attr:data-variant={props.variant}
          bool:data-dragging={isActive()}
          class={styles['carousel']}
          style={
            isFullscreen()
              ? undefined
              : {
                  '--md-comp-carousel-container-height': props.height,
                  '--md-comp-carousel-item-large-max-width': props.itemMaxWidth
                }
          }
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onKeyDown={onKeyDown}
        >
          {props.children}
        </sm-carousel>
      </MaterialCarouselFullscreen>
      <Show when={props.showAllButtonLabel}>
        <div class={styles['show-all-button']}>
          <MaterialButton
            variant="text"
            ariaLabel={props.showAllButtonAriaLabel}
            onClick={(event: PointerEvent) => props.onShowAll?.(event)}
          >
            {props.showAllButtonLabel}
          </MaterialButton>
        </div>
      </Show>
    </>
  );
};
