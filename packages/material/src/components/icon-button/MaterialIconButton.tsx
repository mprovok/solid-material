import type { JSX, Ref, VoidComponent } from 'solid-js';

import { splitProps } from 'solid-js';

import type {
  MaterialButtonShape,
  MaterialButtonSize,
  MaterialButtonType,
  MaterialButtonVariant
} from '../button/MaterialButton';

import { MaterialButton } from '../button/MaterialButton';
import { MaterialPlainTooltip } from '../tooltip/MaterialPlainTooltip';
import { MaterialTooltip } from '../tooltip/MaterialTooltip';

import styles from './MaterialIconButton.module.css';

export type MaterialIconButtonWidth = 'narrow' | 'default' | 'wide';

export interface MaterialIconButtonProps {
  variant: MaterialButtonVariant;
  size?: MaterialButtonSize;
  shape?: MaterialButtonShape;
  width?: MaterialIconButtonWidth;

  toggle?: boolean;
  disabled?: boolean;

  icon: JSX.Element;

  type?: MaterialButtonType;
  title?: string;
  ariaLabel?: string;
  ariaExpanded?: boolean;

  // Links
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  download?: string;
  transition?: string;

  ref?: Ref<Element>;

  onClick?: (event: PointerEvent) => void;
}

export const MaterialIconButton: VoidComponent<MaterialIconButtonProps> = props => {
  const [localProps, otherProps] = splitProps(props, ['ref', 'width', 'title', 'ariaLabel']);

  return (
    <MaterialTooltip
      variant="plain"
      tooltip={
        localProps.title !== undefined ? <MaterialPlainTooltip>{localProps.title}</MaterialPlainTooltip> : undefined
      }
    >
      <sm-icon-button ref={localProps.ref} attr:data-width={localProps.width ?? 'default'} class={styles['button']}>
        <MaterialButton {...otherProps} ariaLabel={localProps.ariaLabel ?? localProps.title} />
      </sm-icon-button>
    </MaterialTooltip>
  );
};
