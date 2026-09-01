import type { FlowComponent } from 'solid-js';

import { Show } from 'solid-js';

import { MaterialFocusRing } from '../focus-ring/MaterialFocusRing';
import { MaterialRipple } from '../ripple/MaterialRipple';

import styles from './MaterialCard.module.css';

export type MaterialCardVariant = 'elevated' | 'filled' | 'outlined';

export type MaterialCardSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface MaterialCardProps {
  variant: MaterialCardVariant;
  size?: MaterialCardSize;
  ariaLabel?: string;
  disabled?: boolean;
  onClick?: (event: PointerEvent) => void;
}

export const MaterialCard: FlowComponent<MaterialCardProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDivElement;

  const isClickable = () => props.onClick !== undefined && props.disabled !== true;

  const onKeyDown = (event: KeyboardEvent) => {
    const { key } = event;

    if (key === 'Enter' || key === ' ') {
      ref.click();
    }
  };

  return (
    <sm-card
      ref={ref}
      data-variant={props.variant}
      data-size={props.size}
      data-disabled={props.disabled}
      tabindex={isClickable() ? 0 : undefined}
      aria-label={props.ariaLabel}
      class={[styles['card'], { [styles['clickable']!]: isClickable() }]}
      onClick={(event: PointerEvent) => props.disabled !== true && props.onClick?.(event)}
      onKeyDown={onKeyDown}
    >
      <MaterialFocusRing attachTo={ref} />
      <MaterialRipple attachTo={ref} disabled={!isClickable()} />
      <md-elevation></md-elevation>
      {props.children}
      <Show when={props.variant === 'outlined'}>
        <div class={styles['outline']} />
      </Show>
    </sm-card>
  );
};

export const MaterialCardBody: FlowComponent = props => {
  return <div class={styles['card-body']}>{props.children}</div>;
};
