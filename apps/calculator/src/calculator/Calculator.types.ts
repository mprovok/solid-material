import type { Context } from 'solid-js';

import { createContext } from 'solid-js';

export const SIZE = 'medium';

export const ICON_SIZE = 'medium';

// Duration in milliseconds to vibrate when pressing a button
export const BUTTON_PRESS_VIBRATE_MS = 100;

// oxlint-disable typescript/prefer-enum-initializers
export enum CalculatorAction {
  DIGIT_0,
  DIGIT_1,
  DIGIT_2,
  DIGIT_3,
  DIGIT_4,
  DIGIT_5,
  DIGIT_6,
  DIGIT_7,
  DIGIT_8,
  DIGIT_9,
  DECIMAL_SEPARATOR,
  PERCENT,
  PARENTHESES,
  OPERATOR_ADD,
  OPERATOR_SUBTRACT,
  OPERATOR_MULTIPLY,
  OPERATOR_DIVIDE,
  OPERATOR_POWER,
  TEN_POWER_X,
  EXP,
  LN,
  LOG,
  SIN,
  COS,
  TAN,
  ARCSIN,
  ARCCOS,
  ARCTAN,
  PI,
  E,
  FACTORIAL,
  SQRT,
  SQUARE
}

export const CalculatorExecuteActionContext: Context<((action: CalculatorAction) => void) | undefined> =
  createContext<(action: CalculatorAction) => void>();
