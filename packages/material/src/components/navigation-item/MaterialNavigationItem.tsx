import type { VoidComponent } from 'solid-js';

import { A } from '@solidjs/router';
import { Dynamic } from 'solid-js/web';

import type { MaterialIconSvg } from '../icon/MaterialIcon';

import { MaterialBadge } from '../badge/MaterialBadge';
import { MaterialFocusRing } from '../focus-ring/MaterialFocusRing';
import { MaterialIcon } from '../icon/MaterialIcon';
import { MaterialRipple } from '../ripple/MaterialRipple';

import styles from './MaterialNavigationItem.module.css';

export const isEnabledNavigationItem = (target: EventTarget): target is HTMLAnchorElement =>
  target instanceof HTMLAnchorElement && target.dataset['disabled'] !== '';

export type MaterialNavigationItemType = {
  label: string;
  icon: MaterialIconSvg;
  activeIcon: MaterialIconSvg;
  end?: boolean;
  badge?: {
    value: string | number;
    ariaLabel?: string;
  };
  disabled?: boolean;
  ariaLabel?: string;

  // Links
  href: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
};

export interface MaterialNavigationItemProps extends MaterialNavigationItemType {
  expanded?: boolean;
  ariaControls?: string;
}

export const MaterialNavigationItem: VoidComponent<MaterialNavigationItemProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let refAnchor!: HTMLAnchorElement;
  // oxlint-disable-next-line no-unassigned-vars
  let refIndicator!: HTMLDivElement;

  const ariaLabel = () => props.ariaLabel ?? props.label;

  return (
    <A
      ref={refAnchor}
      href={props.href}
      target={props.target}
      end={props.end}
      state={{ transition: 'top-level' }}
      role="menuitem"
      tabindex={props.disabled === true ? -1 : 0}
      bool:data-disabled={props.disabled}
      bool:data-expanded={props.expanded}
      aria-label={props.badge?.ariaLabel !== undefined ? `[${ariaLabel()}] ${props.badge?.ariaLabel}` : ariaLabel()}
      aria-controls={props.ariaControls}
      class={styles['button']}
      activeClass={styles['active']}
      inactiveClass={styles['inactive']}
    >
      <MaterialFocusRing attachTo={refAnchor} />
      <div ref={refIndicator} class={styles['indicator']}>
        <MaterialRipple attachTo={refIndicator} disabled={props.disabled} />
        <div class={styles['icon']}>
          <MaterialBadge value={props.badge?.value} ariaLabel={props.badge?.ariaLabel}>
            <MaterialIcon size="medium">
              <Dynamic component={props.activeIcon} class={styles['active']} />
              <Dynamic component={props.icon} class={styles['inactive']} />
            </MaterialIcon>
          </MaterialBadge>
        </div>
        <span class={styles['indicator-label']}>{props.label}</span>
      </div>
      <div class={styles['label-wrapper']}>
        <span class={styles['label']}>{props.label}</span>
      </div>
    </A>
  );
};
