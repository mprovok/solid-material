import type { JSX } from '@solidjs/web';
import type { ParentComponent, Ref } from 'solid-js';

import { omit } from 'solid-js';

import type { MaterialButtonSize } from '../button/MaterialButton';

import { MaterialButton } from '../button/MaterialButton';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';

import styles from './MaterialSplitButton.module.css';

import ChevronRightIcon from '@solidmaterial/icons/400/outlined/chevron_right.svg';

export type MaterialSplitButtonVariant = 'elevated' | 'filled' | 'tonal' | 'outlined';

export interface MaterialSplitButtonProps {
  open: boolean;
  variant: MaterialSplitButtonVariant;

  size?: MaterialButtonSize;
  disabled?: boolean;

  icon?: JSX.Element;
  ariaLabel?: string;

  menuButtonRef?: Ref<Element>;
  menuButtonAriaLabel?: string;
  menuButtonTitle?: string;

  onClick: (event: PointerEvent) => void;
  onToggle: (open: boolean) => void;
}

export const MaterialSplitButton: ParentComponent<MaterialSplitButtonProps> = props => {
  const otherProps = omit(
    props,
    'open',
    'onToggle',
    'variant',
    'size',
    'disabled',
    'menuButtonRef',
    'menuButtonAriaLabel',
    'menuButtonTitle'
  );

  const onClickArrowButton = () => {
    props.onToggle(!props.open);
  };

  return (
    <sm-split-button data-variant={props.variant} class={styles['button']}>
      <MaterialButton variant={props.variant} size={props.size} disabled={props.disabled} {...otherProps} shape="round">
        {props.children}
      </MaterialButton>
      <MaterialIconButton
        variant={props.variant}
        size={props.size}
        disabled={props.disabled}
        ref={props.menuButtonRef}
        icon={<ChevronRightIcon />}
        shape="square"
        toggle={props.open}
        title={props.menuButtonTitle}
        ariaLabel={props.menuButtonAriaLabel}
        ariaExpanded={props.open}
        onClick={onClickArrowButton}
      />
    </sm-split-button>
  );
};
