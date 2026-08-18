import type { JSX, ParentComponent, Ref } from 'solid-js';

import { splitProps } from 'solid-js';

import type { MaterialButtonSize } from '../button/MaterialButton';

import { MaterialButton } from '../button/MaterialButton';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';

import styles from './MaterialSplitButton.module.css';

import ChevronRightIcon from '@solid-material/icons/400/outlined/chevron_right.svg';

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
  const [openProps, sharedProps, menuProps, otherProps] = splitProps(
    props,
    ['open', 'onToggle'],
    ['variant', 'size', 'disabled'],
    ['menuButtonRef', 'menuButtonAriaLabel', 'menuButtonTitle']
  );

  const onClickArrowButton = () => {
    openProps.onToggle(!openProps.open);
  };

  return (
    <sm-split-button attr:data-variant={sharedProps.variant} class={styles['button']}>
      <MaterialButton {...sharedProps} {...otherProps} shape="round">
        {props.children}
      </MaterialButton>
      <MaterialIconButton
        {...sharedProps}
        ref={menuProps.menuButtonRef}
        icon={<ChevronRightIcon />}
        shape="square"
        toggle={openProps.open}
        title={menuProps.menuButtonTitle}
        ariaLabel={menuProps.menuButtonAriaLabel}
        ariaExpanded={openProps.open}
        onClick={onClickArrowButton}
      />
    </sm-split-button>
  );
};
