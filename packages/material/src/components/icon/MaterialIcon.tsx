import '@material/web/icon/icon.js';
import type { ComponentProps } from '@solidjs/web';
import type { Component, FlowComponent } from 'solid-js';

import styles from './MaterialIcon.module.css';

export type MaterialIconSvg = Component<ComponentProps<'svg'>>;

export type MaterialIconSize = 'small' | 'medium' | 'large';

export interface MaterialIconProps {
  size?: MaterialIconSize;
  slot?: string;
  ariaLabel?: string;
}

const SIZE_MAPPING: Record<MaterialIconSize, string> = {
  small: styles['size-small']!,
  medium: styles['size-medium']!,
  large: styles['size-large']!
};

export const MaterialIcon: FlowComponent<MaterialIconProps> = props => {
  return (
    <md-icon
      slot={props.slot}
      aria-label={props.ariaLabel}
      aria-hidden={props.ariaLabel === undefined}
      class={props.size !== undefined ? SIZE_MAPPING[props.size] : undefined}
    >
      {props.children}
    </md-icon>
  );
};
