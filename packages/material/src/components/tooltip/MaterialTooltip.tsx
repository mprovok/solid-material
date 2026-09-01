import type { JSX } from '@solidjs/web';
import type { FlowComponent } from 'solid-js';

import { createFocusSignal } from '@solid-primitives/focus';
import { Show, createEffect, createMemo, createSignal, createUniqueId } from 'solid-js';

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
  const [refAnchor, setRefAnchor] = createSignal<HTMLDivElement>();

  // oxlint-disable-next-line no-unassigned-vars
  let refTooltip!: HTMLDivElement | undefined;

  const isPersistentOnMount = () => props.persistent === 'mount' && props.variant === 'rich';
  const isPersistentOnClick = () => props.persistent === 'click' && props.variant === 'rich';
  const isPersistent = createMemo(() => props.persistent !== undefined && props.variant === 'rich');

  const [isOpen, setIsOpen] = createSignal(() => isPersistentOnMount());
  const [shouldOpen, setShouldOpen] = createSignal(() => ({ open: isPersistentOnMount(), immediately: false }));
  const [isHoveringOverTooltip, setIsHoveringOverTooltip] = createSignal(false);
  const [isClicking, setIsClicking] = createSignal(false);

  const isAnchorFocused = createFocusSignal(() => refAnchor()!);

  createEffect(
    () => {
      const { open: isShouldOpen, immediately } = shouldOpen();
      return [isShouldOpen, immediately, isOpen(), isClicking(), isHoveringOverTooltip()] as const;
    },
    ([isShouldOpen, immediately, isOpen, isClicking, isHoveringOverTooltip]) => {
      if (immediately) {
        setIsOpen(isShouldOpen);
      }

      let timerId: number;

      if (!immediately) {
        if (isShouldOpen && !isOpen) {
          timerId = setTimeout(() => setIsOpen(!isClicking), 450);
        } else if (!isShouldOpen && isOpen && !isHoveringOverTooltip) {
          timerId = setTimeout(() => setIsOpen(false), 1_500);
        }
      }

      return () => {
        clearTimeout(timerId);
      };
    }
  );

  const isTooltipVisible = () => Boolean(refTooltip?.matches(':popover-open'));
  const hasAnchorOrTooltipFocus = createDebouncedMemo(
    () => isAnchorFocused() && refAnchor()?.querySelector(':focus-visible') !== null,
    50
  );

  // Show or hide when anchor element or tooltip gains/loses focus
  createEffect(
    () => {
      // Tooltip must not be persistent or already open (so user can tab into interactive element inside tooltip)
      const shouldBeVisible = (!isPersistent() || isOpen()) && hasAnchorOrTooltipFocus();
      return [shouldBeVisible, isTooltipVisible()] as const;
    },
    ([shouldBeVisible, isTooltipVisible]) => {
      if (shouldBeVisible !== isTooltipVisible) {
        // If the tooltip should be visible, make sure the active element has a focus ring, this
        // prevents the tooltip from showing after a click (in that case the element gets focus, but no ring)
        setShouldOpen({ open: shouldBeVisible, immediately: true });
      }
    }
  );

  // Actually show/hide tooltip using Popover API
  createEffect(
    () => isOpen() !== isTooltipVisible(),
    shouldToggleVisibility => {
      if (shouldToggleVisibility) {
        refTooltip?.togglePopover();
      }
    }
  );

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

  // Detect hovering over the anchor element
  const onPointerEnterAnchor = () => {
    if (!isPersistent()) {
      setShouldOpen({ open: true, immediately: false });
    }
  };
  const onPointerLeaveAnchor = () => {
    if (!isPersistent()) {
      setShouldOpen({ open: false, immediately: false });
    }
  };
  const onPointerDownAnchor = () => {
    if (!isPersistent()) {
      setIsClicking(true);
    }
  };
  const onPointerUpAnchor = () => {
    if (!isPersistent()) {
      setIsClicking(false);

      // Avoid showing a tooltip shortly after a fast click
      setShouldOpen({ open: false, immediately: false });
    }
  };

  // Detect hovering over tooltip
  const onPointerEnterTooltip = () => {
    if (!isPersistent()) {
      setIsHoveringOverTooltip(true);
    }
  };
  const onPointerLeaveTooltip = () => {
    if (!isPersistent()) {
      setIsHoveringOverTooltip(false);
    }
  };

  const tooltipId = createUniqueId();

  // Use popover="hint" when supported in Safari
  return (
    <Show when={props.tooltip !== undefined} fallback={props.children}>
      {/* oxlint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        ref={setRefAnchor}
        class={styles['anchor']}
        aria-controls={tooltipId}
        onClick={onClick /* oxlint-disable click-events-have-key-events */}
        onPointerEnter={onPointerEnterAnchor}
        onPointerLeave={onPointerLeaveAnchor}
        onPointerDown={onPointerDownAnchor}
        onPointerUp={onPointerUpAnchor}
      >
        {props.children}
        <sm-tooltip
          ref={refTooltip}
          class={styles['tooltip']}
          data-variant={props.variant ?? 'plain'}
          popover="auto"
          id={tooltipId}
          onToggle={onToggle}
          onPointerEnter={onPointerEnterTooltip}
          onPointerLeave={onPointerLeaveTooltip}
        >
          {props.tooltip}
        </sm-tooltip>
      </div>
    </Show>
  );
};
