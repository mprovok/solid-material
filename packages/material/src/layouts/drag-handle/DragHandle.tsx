import type { VoidComponent } from 'solid-js';

import { MaterialFocusRing } from '../../components/focus-ring/MaterialFocusRing';
import { MaterialRipple } from '../../components/ripple/MaterialRipple';
import { isRTL } from '../../utils/i18n';

import styles from './DragHandle.module.css';

export type DragHandleDirection = 'horizontal' | 'vertical';

export type DragHandleMovement = -1 | 1;

type KeyboardArrowKeysHorizontal = 'ArrowLeft' | 'ArrowRight';

type KeyboardArrowKeysVertical = 'ArrowUp' | 'ArrowDown';

export interface DragHandleProps {
  active: boolean;
  direction: DragHandleDirection;
  ariaLabel?: string;
  ariaValue?: number;
  ariaValueText?: string;
  onClick?: (event: PointerEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onMove?: (direction: DragHandleMovement) => void;
}

const ORIENTATION: Record<DragHandleDirection, 'horizontal' | 'vertical'> = {
  horizontal: 'vertical',
  vertical: 'horizontal'
};

const MOVEMENT_X: Record<KeyboardArrowKeysHorizontal, DragHandleMovement> = {
  ArrowRight: 1,
  ArrowLeft: -1
};

const MOVEMENT_X_RTL: Record<KeyboardArrowKeysHorizontal, DragHandleMovement> = {
  ArrowRight: -1,
  ArrowLeft: 1
};

const MOVEMENT_Y: Record<KeyboardArrowKeysVertical, DragHandleMovement> = {
  ArrowUp: 1,
  ArrowDown: -1
};

export const DragHandle: VoidComponent<DragHandleProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDivElement;

  const onClick = (event: MouseEvent) => {
    if (event instanceof PointerEvent) {
      props.onClick?.(event);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const { key } = event;

    if (key === 'Enter' || key === ' ') {
      props.onKeyDown?.(event);
    } else if (props.direction === 'horizontal' && (key === 'ArrowLeft' || key === 'ArrowRight')) {
      event.preventDefault();
      props.onMove?.(isRTL() ? MOVEMENT_X_RTL[key] : MOVEMENT_X[key]);
    } else if (props.direction === 'vertical' && (key === 'ArrowUp' || key === 'ArrowDown')) {
      event.preventDefault();
      props.onMove?.(MOVEMENT_Y[key]);
    }
  };

  return (
    <sm-drag-handle
      ref={ref}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="separator"
      tabindex={0}
      aria-label={props.ariaLabel}
      aria-orientation={ORIENTATION[props.direction]}
      attr:aria-valuenow={props.ariaValue}
      attr:aria-valuetext={props.ariaValueText}
      class={styles['drag-handle']}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <div
        role="presentation"
        bool:data-active={props.active}
        bool:data-clickable={props.onClick !== undefined}
        attr:data-direction={props.direction}
        class={styles['button']}
      >
        <MaterialFocusRing attachTo={ref} />
        <MaterialRipple attachTo={ref} />
        <md-elevation></md-elevation>
      </div>
    </sm-drag-handle>
  );
};
