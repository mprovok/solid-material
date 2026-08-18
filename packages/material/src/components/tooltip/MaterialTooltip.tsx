import type { FlowComponent, JSX } from 'solid-js';

import { createFocusSignal } from '@solid-primitives/active-element';
import { createPerPointerListeners } from '@solid-primitives/pointer';
import { Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup, onMount } from 'solid-js';

import { createDebouncedMemo } from '../../utils/utils';

import styles from './MaterialTooltip.module.css';

export type MaterialTooltipVariant = 'plain' | 'rich';

export type MaterialTooltipPersistence = 'click' | 'mount';

export interface MaterialTooltipProps {
  tooltip: JSX.Element;
  variant?: MaterialTooltipVariant;
  persistent?: MaterialTooltipPersistence;
}

export const MaterialTooltip: FlowComponent<MaterialTooltipProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let refAnchor!: HTMLDivElement | undefined;

  // oxlint-disable-next-line no-unassigned-vars
  let refTooltip!: HTMLDivElement | undefined;

  const isPersistentOnMount = () => props.persistent === 'mount' && props.variant === 'rich';
  const isPersistentOnClick = () => props.persistent === 'click' && props.variant === 'rich';
  const isPersistent = createMemo(() => props.persistent !== undefined && props.variant === 'rich');

  const [isOpen, setIsOpen] = createSignal(isPersistentOnMount());
  const [shouldOpen, setShouldOpen] = createSignal({ open: isPersistentOnMount(), immediately: false });
  const [isHoveringOverTooltip, setIsHoveringOverTooltip] = createSignal(false);
  const [isClicking, setIsClicking] = createSignal(false);
  const [pointerId, setPointerId] = createSignal<number>();

  const isAnchorFocused = createFocusSignal(() => refAnchor!);

  onMount(() => {
    if (isPersistent()) {
      return;
    }

    // Detect hovering over the anchor element
    createPerPointerListeners({
      target: refAnchor,
      onEnter(pointer, { onLeave, onDown, onUp }) {
        if (pointer.pointerId === pointerId()) {
          setShouldOpen({ open: true, immediately: false });
          onDown(() => setIsClicking(true));
          onUp(() => {
            setIsClicking(false);

            // Avoid showing a tooltip shortly after a fast click
            setShouldOpen({ open: false, immediately: false });
          });
          onLeave(() => setShouldOpen({ open: false, immediately: false }));
        }
      }
    });

    // Detect hovering over tooltip
    createPerPointerListeners({
      target: refTooltip,
      onEnter(_pointer, { onLeave }) {
        setIsHoveringOverTooltip(true);
        onLeave(() => setIsHoveringOverTooltip(false));
      }
    });
  });

  createEffect(() => {
    const { open, immediately } = shouldOpen();
    if (immediately) {
      setIsOpen(open);
      return;
    }

    createEffect(() => {
      let timerId: number;

      if (open && !isOpen()) {
        timerId = setTimeout(() => setIsOpen(!isClicking()), 450);
      } else if (!open && isOpen() && !isHoveringOverTooltip()) {
        timerId = setTimeout(() => setIsOpen(false), 1_500);
      }

      onCleanup(() => {
        clearTimeout(timerId);
      });
    });
  });

  const isTooltipVisible = () => Boolean(refTooltip?.matches(':popover-open'));
  const hasAnchorOrTooltipFocus = createDebouncedMemo(() => isAnchorFocused(), 50);

  // Show or hide when anchor element or tooltip gains/loses focus
  createEffect(() => {
    // Tooltip must not be persistent or already open (so user can tab into interactive element inside tooltip)
    const shouldBeVisible = (!isPersistent() || isOpen()) && hasAnchorOrTooltipFocus();
    if (shouldBeVisible !== isTooltipVisible()) {
      // If the tooltip should be visible, make sure the active element has a focus ring, this
      // prevents the tooltip from showing after a click (in that case the element gets focus, but no ring)
      setShouldOpen({ open: shouldBeVisible, immediately: true });
    }
  });

  // Actually show/hide tooltip using Popover API
  createEffect(() => {
    if (isOpen() !== isTooltipVisible()) {
      refTooltip?.togglePopover();
    }
  });

  // Support showing persistent rich tooltips by clicking on anchor
  // element instead of hovering over it
  const onClick = () => {
    if (isPersistentOnClick()) {
      setShouldOpen({ open: true, immediately: true });
    }
  };

  // Sync state when tooltip is hidden by browser/user
  const onToggle = () => {
    setShouldOpen({ open: isTooltipVisible(), immediately: true });
  };

  const onPointerEnter = (event: PointerEvent) => setPointerId(event.pointerId);
  const onPointerLeave = () => setPointerId(undefined);

  const tooltipId = createUniqueId();

  // Use popover="hint" when supported in Safari
  return (
    <Show when={props.tooltip !== undefined} fallback={props.children}>
      {/* oxlint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        ref={refAnchor}
        class={styles['anchor']}
        aria-controls={tooltipId}
        onClick={onClick /* oxlint-disable click-events-have-key-events */}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        {props.children}
        <sm-tooltip
          ref={refTooltip}
          class={styles['tooltip']}
          attr:data-variant={props.variant ?? 'plain'}
          popover="auto"
          id={tooltipId}
          onToggle={onToggle}
        >
          {props.tooltip}
        </sm-tooltip>
      </div>
    </Show>
  );
};
