import '@material/web/progress/circular-progress.js';
import '@material/web/progress/linear-progress.js';
import type { ParentComponent, VoidComponent } from 'solid-js';

import { Show, children, onMount, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

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
      attr:aria-label={props.ariaLabel}
      attr:value={props.value}
      attr:max={props.maximum}
      attr:buffer={props.buffer}
      bool:indeterminate={props.indeterminate}
      bool:four-color={props.fourColor}
    ></md-linear-progress>
  );
};

const MaterialCircularProgress: VoidComponent<MaterialProgressProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLElement;

  onMount(() => {
    // Fix tiny empty gap between left and right side of circle
    const styleSheet = new CSSStyleSheet();
    ref.shadowRoot?.adoptedStyleSheets.push(styleSheet);
    styleSheet.replaceSync('div.right {transform: translateX(-50%) rotateZ(-1deg) translateX(50%);}');
  });

  return (
    <md-circular-progress
      ref={ref}
      attr:aria-label={props.ariaLabel}
      attr:value={props.value}
      attr:max={props.maximum}
      bool:indeterminate={props.indeterminate}
      bool:four-color={props.fourColor}
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
  const [localProps, otherProps] = splitProps(props, ['children']);

  const isCircular = () => props.variant === 'circular';
  const iconButton = children(() => isCircular() && localProps.children);

  return (
    <div
      class={props.size !== undefined ? SIZE_MAPPING[props.size] : undefined}
      classList={{
        [styles['circular-button']!]: isCircular() && iconButton() !== undefined
      }}
    >
      <Dynamic component={progress[props.variant]} {...otherProps} />
      <Show when={isCircular()}>{iconButton()}</Show>
    </div>
  );
};
