import type { FlowComponent } from 'solid-js';

import { MaterialButton } from '@solidmaterial/material/components/button';
import { useContext } from 'solid-js';

import type { CalculatorAction } from '../Calculator.types';

import { CalculatorExecuteActionContext, SIZE } from '../Calculator.types';

import { FixedWidthDigit } from './FixedWidthDigit';

export interface CalculatorButtonProps {
  action: CalculatorAction;
  ariaLabel?: string;
}

export const CalculatorButton: FlowComponent<CalculatorButtonProps> = props => {
  const execute = useContext(CalculatorExecuteActionContext);

  return (
    <MaterialButton variant="tonal" size={SIZE} ariaLabel={props.ariaLabel} onClick={() => execute?.(props.action)}>
      <FixedWidthDigit>{props.children}</FixedWidthDigit>
    </MaterialButton>
  );
};
