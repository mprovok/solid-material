import type { JSX, ParentComponent } from 'solid-js';

import { Show, children } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type { TypographyRole, TypographySize } from '../typography/Typography';

import { MaterialFocusRing } from '../focus-ring/MaterialFocusRing';
import { MaterialIcon } from '../icon/MaterialIcon';
import { MaterialRipple } from '../ripple/MaterialRipple';
import { Span } from '../typography/Typography';

import styles from './MaterialButton.module.css';

export type MaterialButtonType = 'button' | 'reset' | 'submit';

export type MaterialButtonIconPosition = 'start' | 'end';

export type MaterialButtonShape = 'round' | 'square';

export type MaterialButtonSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';

export type MaterialButtonVariant = 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text';

export interface MaterialButtonProps {
  variant: MaterialButtonVariant;
  size?: MaterialButtonSize;
  shape?: MaterialButtonShape;

  toggle?: boolean;
  disabled?: boolean;

  icon?: JSX.Element;
  iconPosition?: MaterialButtonIconPosition;

  type?: MaterialButtonType;
  ariaLabel?: string;
  ariaExpanded?: boolean;

  // Links
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  download?: string;
  transition?: string;

  onClick?: (event: PointerEvent) => void;
}

const LABEL_ROLE: Record<MaterialButtonSize, TypographyRole> = {
  'extra-small': 'title',
  small: 'title',
  medium: 'title',
  large: 'headline',
  'extra-large': 'headline'
};

const LABEL_SIZE: Record<MaterialButtonSize, TypographySize> = {
  'extra-small': 'small',
  small: 'small',
  medium: 'medium',
  large: 'small',
  'extra-large': 'large'
};

export const MaterialButton: ParentComponent<MaterialButtonProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDivElement;

  // oxlint-disable-next-line no-unassigned-vars
  let refButton!: HTMLButtonElement;

  const size = () => props.size ?? 'small';
  const label = children(() => props.children);

  return (
    <sm-button
      ref={ref}
      attr:data-variant={props.variant}
      attr:data-size={size()}
      attr:data-shape={props.shape}
      attr:data-toggle={props.toggle}
      attr:data-position={props.iconPosition}
      class={styles['button']}
      onClick={(event: PointerEvent) => props.onClick?.(event)}
    >
      <Dynamic
        component={props.href === undefined ? 'button' : 'a'}
        ref={refButton}
        disabled={props.disabled}
        type={props.type ?? 'button'}
        href={props.href}
        target={props.target}
        download={props.download}
        state={props.transition !== undefined ? JSON.stringify({ transition: props.transition }) : undefined}
        role={props.href === undefined && props.toggle !== undefined ? 'switch' : undefined}
        aria-label={props.ariaLabel}
        aria-expanded={props.ariaExpanded}
        attr:aria-checked={props.toggle}
      >
        <MaterialFocusRing attachTo={refButton} />
        <MaterialRipple attachTo={ref} disabled={props.disabled} />
        <md-elevation></md-elevation>
        <Show when={props.icon}>
          <MaterialIcon>{props.icon}</MaterialIcon>
        </Show>
        <Show when={label()}>
          <div class={styles['label']}>
            <Show when={typeof label() === 'string'} fallback={label()}>
              <Span role={LABEL_ROLE[size()]} size={LABEL_SIZE[size()]}>
                {label()}
              </Span>
            </Show>
          </div>
        </Show>
        <Show when={props.variant === 'outlined'}>
          <div class={styles['outline']} />
        </Show>
      </Dynamic>
    </sm-button>
  );
};
