import '@material/web/progress/circular-progress.js';
import '@material/web/progress/linear-progress.js';
import type { ParentComponent, VoidComponent } from 'solid-js';

import { Dynamic } from '@solidjs/web';
import { Show, children, omit, onSettled } from 'solid-js';

import styles from './MaterialProgress.module.css';

export type MaterialProgressSize = 'small' | 'medium' | 'large' | 'extra-large';

export type MaterialProgressVariant = 'linear' | 'circular';

export interface MaterialProgressProps {
  variant: MaterialProgressVariant;
  size?: MaterialProgressSize;

  value?: number;
  maximum?: number;

  // Only used by linear variant
  buffer?: number;

  indeterminate?: boolean;
  fourColor?: boolean;

  ariaLabel?: string;
}

const MaterialLinearProgress: VoidComponent<MaterialProgressProps> = props => {
  return (
    <md-linear-progress
      aria-label={props.ariaLabel}
      value={props.value}
      max={props.maximum}
      buffer={props.buffer}
      indeterminate={props.indeterminate}
      four-color={props.fourColor}
    ></md-linear-progress>
  );
};

const MaterialCircularProgress: VoidComponent<MaterialProgressProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLElement;

  onSettled(() => {
    // Fix tiny empty gap between left and right side of circle
    const styleSheet = new CSSStyleSheet();
    ref.shadowRoot?.adoptedStyleSheets.push(styleSheet);
    styleSheet.replaceSync('div.right {transform: translateX(-50%) rotateZ(-1deg) translateX(50%);}');
  });

  return (
    <md-circular-progress
      ref={ref}
      aria-label={props.ariaLabel}
      value={props.value}
      max={props.maximum}
      indeterminate={props.indeterminate}
      four-color={props.fourColor}
    ></md-circular-progress>
  );
};

const SIZE_MAPPING: Record<MaterialProgressSize, string> = {
  small: styles['size-small']!,
  medium: styles['size-medium']!,
  large: styles['size-large']!,
  'extra-large': styles['size-extra-large']!
};

const progress: Record<MaterialProgressVariant, VoidComponent<MaterialProgressProps>> = {
  linear: MaterialLinearProgress,
  circular: MaterialCircularProgress
};

export const MaterialProgress: ParentComponent<MaterialProgressProps> = props => {
  const otherProps = omit(props, 'children');

  const isCircular = () => props.variant === 'circular';
  const iconButton = children(() => isCircular() && props.children);

  return (
    <div
      class={[
        props.size !== undefined ? SIZE_MAPPING[props.size] : undefined,
        {
          [styles['circular-button']!]: isCircular() && iconButton() !== undefined
        }
      ]}
    >
      <Dynamic component={progress[props.variant]} {...otherProps} />
      <Show when={isCircular()}>{iconButton()}</Show>
    </div>
  );
};
