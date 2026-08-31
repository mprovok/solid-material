import type { VoidComponent } from 'solid-js';

import { MaterialButton } from '@solidmaterial/material/components/button';

import { SIZE } from '../../Calculator.types';
import { FixedWidthDigit } from '../FixedWidthDigit';

import styles from './ToggleDegreesButton.module.css';

export interface ToggleDegreesButtonProps {
  toggle: boolean;
  onClick: () => void;
}

export const ToggleDegreesButton: VoidComponent<ToggleDegreesButtonProps> = props => {
  return (
    <div class={styles['button']}>
      <MaterialButton variant="tonal" size={SIZE} toggle={props.toggle} ariaLabel="Degrees" onClick={props.onClick}>
        <FixedWidthDigit>Deg</FixedWidthDigit>
      </MaterialButton>
    </div>
  );
};
