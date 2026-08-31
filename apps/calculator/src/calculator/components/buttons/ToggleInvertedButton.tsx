import type { VoidComponent } from 'solid-js';

import { MaterialButton } from '@solidmaterial/material/components/button';

import { SIZE } from '../../Calculator.types';
import { FixedWidthDigit } from '../FixedWidthDigit';

import styles from './ToggleInvertedButton.module.css';

export interface ToggleInvertedButtonProps {
  toggle: boolean;
  onClick: () => void;
}

export const ToggleInvertedButton: VoidComponent<ToggleInvertedButtonProps> = props => {
  return (
    <div class={styles['button']}>
      <MaterialButton
        variant="tonal"
        size={SIZE}
        toggle={props.toggle}
        ariaLabel="Invert scientific buttons"
        onClick={props.onClick}
      >
        <FixedWidthDigit>Inv</FixedWidthDigit>
      </MaterialButton>
    </div>
  );
};
