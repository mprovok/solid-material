import type { VoidComponent } from 'solid-js';

import { MaterialButton } from '@solidmaterial/material/components/button';
import { MaterialButtonGroup } from '@solidmaterial/material/components/button-group';
import { MaterialIcon } from '@solidmaterial/material/components/icon';

import { CalculatorAction, ICON_SIZE, SIZE } from '../Calculator.types';

import { CalculatorButton } from './CalculatorButton';
import { FixedWidthDigit } from './FixedWidthDigit';

import BackspaceIcon from '@solidmaterial/icons/400/rounded/backspace.svg';

export interface MainButtonsLandscapeProps {
  pressAC: () => void;
  pressBackspace: () => void;
  pressEquals: () => void;
}

export const MainButtonsLandscape: VoidComponent<MainButtonsLandscapeProps> = props => {
  return (
    <>
      <MaterialButtonGroup variant="standard">
        <CalculatorButton action={CalculatorAction.DIGIT_7}>7</CalculatorButton>
        <CalculatorButton action={CalculatorAction.DIGIT_8}>8</CalculatorButton>
        <CalculatorButton action={CalculatorAction.DIGIT_9}>9</CalculatorButton>
        <CalculatorButton action={CalculatorAction.OPERATOR_DIVIDE}>÷</CalculatorButton>
        <MaterialButton variant="tonal" size={SIZE} ariaLabel="Clear" onClick={props.pressAC}>
          <FixedWidthDigit>AC</FixedWidthDigit>
        </MaterialButton>
      </MaterialButtonGroup>
      <MaterialButtonGroup variant="standard">
        <CalculatorButton action={CalculatorAction.DIGIT_4}>4</CalculatorButton>
        <CalculatorButton action={CalculatorAction.DIGIT_5}>5</CalculatorButton>
        <CalculatorButton action={CalculatorAction.DIGIT_6}>6</CalculatorButton>
        <CalculatorButton action={CalculatorAction.OPERATOR_MULTIPLY}>×</CalculatorButton>
        <CalculatorButton action={CalculatorAction.PARENTHESES} ariaLabel="Opening or closing parenthesis">
          ( )
        </CalculatorButton>
      </MaterialButtonGroup>
      <MaterialButtonGroup variant="standard">
        <CalculatorButton action={CalculatorAction.DIGIT_1}>1</CalculatorButton>
        <CalculatorButton action={CalculatorAction.DIGIT_2}>2</CalculatorButton>
        <CalculatorButton action={CalculatorAction.DIGIT_3}>3</CalculatorButton>
        <CalculatorButton action={CalculatorAction.OPERATOR_SUBTRACT}>−</CalculatorButton>
        <CalculatorButton action={CalculatorAction.PERCENT}>%</CalculatorButton>
      </MaterialButtonGroup>
      <MaterialButtonGroup variant="standard">
        <CalculatorButton action={CalculatorAction.DIGIT_0}>0</CalculatorButton>
        <CalculatorButton action={CalculatorAction.DECIMAL_SEPARATOR} ariaLabel="Decimal separator">
          .
        </CalculatorButton>
        <MaterialButton variant="tonal" size={SIZE} ariaLabel="Backspace" onClick={props.pressBackspace}>
          <MaterialIcon size={ICON_SIZE}>
            <BackspaceIcon />
          </MaterialIcon>
        </MaterialButton>
        <CalculatorButton action={CalculatorAction.OPERATOR_ADD}>+</CalculatorButton>
        <MaterialButton variant="tonal" size={SIZE} ariaLabel="Evaluate" onClick={props.pressEquals}>
          <FixedWidthDigit>=</FixedWidthDigit>
        </MaterialButton>
      </MaterialButtonGroup>
    </>
  );
};
