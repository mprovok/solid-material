import { CalculatorAction } from '../Calculator.types';

import type { DigitToken, OperatorToken, PeriodToken, Token } from './types';

import { isClosingParenthesis, isDigit, isFunction, isOpeningParenthesis, isOperator, isPeriod } from './types';

type ActionTokenizer = (tokens: Token[]) => Token[];

const getEndIndexForOperator = (tokens: Token[]): -2 | -1 | undefined => {
  const lastToken = tokens.at(-1);
  const prevToken = tokens.at(-2);

  if (!isOperator(lastToken)) {
    // Avoid slicing to replace last token
    return undefined;
  }
  // Replace both the previous token and the last token if last is a '-'
  return isOperator(prevToken) && lastToken.operator === '-' ? -2 : -1;
};

const getBalance = (tokens: Token[]): number => {
  let balance = 0;

  for (const token of tokens) {
    if (isOpeningParenthesis(token) || isFunction(token)) {
      balance += 1;
    } else if (isClosingParenthesis(token)) {
      balance -= 1;
    }
  }

  return balance;
};

const ACTION_TOKENIZER: Record<CalculatorAction, ActionTokenizer> = {
  [CalculatorAction.DIGIT_0]: (tokens: Token[]) => [...tokens, { type: 'DIGIT', digit: 0 }],
  [CalculatorAction.DIGIT_1]: (tokens: Token[]) => [...tokens, { type: 'DIGIT', digit: 1 }],
  [CalculatorAction.DIGIT_2]: (tokens: Token[]) => [...tokens, { type: 'DIGIT', digit: 2 }],
  [CalculatorAction.DIGIT_3]: (tokens: Token[]) => [...tokens, { type: 'DIGIT', digit: 3 }],
  [CalculatorAction.DIGIT_4]: (tokens: Token[]) => [...tokens, { type: 'DIGIT', digit: 4 }],
  [CalculatorAction.DIGIT_5]: (tokens: Token[]) => [...tokens, { type: 'DIGIT', digit: 5 }],
  [CalculatorAction.DIGIT_6]: (tokens: Token[]) => [...tokens, { type: 'DIGIT', digit: 6 }],
  [CalculatorAction.DIGIT_7]: (tokens: Token[]) => [...tokens, { type: 'DIGIT', digit: 7 }],
  [CalculatorAction.DIGIT_8]: (tokens: Token[]) => [...tokens, { type: 'DIGIT', digit: 8 }],
  [CalculatorAction.DIGIT_9]: (tokens: Token[]) => [...tokens, { type: 'DIGIT', digit: 9 }],
  [CalculatorAction.DECIMAL_SEPARATOR]: (tokens: Token[]) => {
    const index = tokens.findLastIndex(isPeriod);

    if (index === -1 || !tokens.slice(index + 1).every(isDigit)) {
      return [...tokens, { type: 'PERIOD' }];
    }
    return tokens;
  },
  [CalculatorAction.PERCENT]: (tokens: Token[]) => [...tokens, { type: 'PERCENT' }],
  [CalculatorAction.PARENTHESES]: (tokens: Token[]) => {
    const lastToken = tokens.at(-1);

    if (isOperator(lastToken) || isFunction(lastToken) || isOpeningParenthesis(lastToken)) {
      return [...tokens, { type: 'PARENTHESIS_OPEN' }];
    }

    if (getBalance(tokens) > 0) {
      return [...tokens, { type: 'PARENTHESIS_CLOSE' }];
    }
    return [...tokens, { type: 'PARENTHESIS_OPEN' }];
  },
  [CalculatorAction.OPERATOR_SUBTRACT]: (tokens: Token[]) => {
    const lastToken = tokens.at(-1);
    const oldTokens =
      isOperator(lastToken) && !['*', '/', '^'].includes(lastToken?.operator) ? tokens.slice(0, -1) : tokens;
    return [...oldTokens, { type: 'OPERATOR', operator: '-' }];
  },
  [CalculatorAction.OPERATOR_ADD]: (tokens: Token[]) => {
    return [...tokens.slice(0, getEndIndexForOperator(tokens)), { type: 'OPERATOR', operator: '+' }];
  },
  [CalculatorAction.OPERATOR_MULTIPLY]: (tokens: Token[]) => {
    return [...tokens.slice(0, getEndIndexForOperator(tokens)), { type: 'OPERATOR', operator: '*' }];
  },
  [CalculatorAction.OPERATOR_DIVIDE]: (tokens: Token[]) => {
    return [...tokens.slice(0, getEndIndexForOperator(tokens)), { type: 'OPERATOR', operator: '/' }];
  },
  [CalculatorAction.OPERATOR_POWER]: (tokens: Token[]) => {
    return [...tokens.slice(0, getEndIndexForOperator(tokens)), { type: 'OPERATOR', operator: '^' }];
  },
  [CalculatorAction.TEN_POWER_X]: (tokens: Token[]) => [
    ...tokens,
    { type: 'DIGIT', digit: 1 },
    { type: 'DIGIT', digit: 0 },
    { type: 'OPERATOR', operator: '^' }
  ],
  [CalculatorAction.EXP]: (tokens: Token[]) => [...tokens, { type: 'FUNCTION', function: 'exp' }],
  [CalculatorAction.LN]: (tokens: Token[]) => [...tokens, { type: 'FUNCTION', function: 'ln' }],
  [CalculatorAction.LOG]: (tokens: Token[]) => [...tokens, { type: 'FUNCTION', function: 'log' }],
  [CalculatorAction.SIN]: (tokens: Token[]) => [...tokens, { type: 'FUNCTION', function: 'sin' }],
  [CalculatorAction.COS]: (tokens: Token[]) => [...tokens, { type: 'FUNCTION', function: 'cos' }],
  [CalculatorAction.TAN]: (tokens: Token[]) => [...tokens, { type: 'FUNCTION', function: 'tan' }],
  [CalculatorAction.ARCSIN]: (tokens: Token[]) => [...tokens, { type: 'FUNCTION', function: 'arcsin' }],
  [CalculatorAction.ARCCOS]: (tokens: Token[]) => [...tokens, { type: 'FUNCTION', function: 'arccos' }],
  [CalculatorAction.ARCTAN]: (tokens: Token[]) => [...tokens, { type: 'FUNCTION', function: 'arctan' }],
  [CalculatorAction.PI]: (tokens: Token[]) => [...tokens, { type: 'CONSTANT', constant: 'pi' }],
  [CalculatorAction.E]: (tokens: Token[]) => [...tokens, { type: 'CONSTANT', constant: 'e' }],
  [CalculatorAction.FACTORIAL]: (tokens: Token[]) => [...tokens, { type: 'FACTORIAL' }],
  [CalculatorAction.SQRT]: (tokens: Token[]) => [...tokens, { type: 'SQRT' }],
  [CalculatorAction.SQUARE]: (tokens: Token[]) => [...tokens, { type: 'SQUARE' }]
};

export const process = (tokens: Token[], action: CalculatorAction): Token[] => ACTION_TOKENIZER[action](tokens);

// Undo the last button press
export const backspace = (tokens: Token[]): Token[] => tokens.slice(0, -1);

/**
 * Return an array of tokens in which the number of closing parentheses
 * is equal to the number of opening parentheses and functions
 *
 * @param tokens An array of `Token`, possibly containing less closing parentheses than it should have
 * @returns an array of `Token` in which the parentheses are balanced
 */
export const balanceParentheses = (tokens: Token[]): Token[] => {
  const amount = Math.max(0, getBalance(tokens));
  const parentheses: Token[] = Array.from({ length: amount }).map(_ => ({ type: 'PARENTHESIS_CLOSE' }));

  return [...tokens, ...parentheses];
};

type StringifiedDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

const isNonDigit = (value: string) => ['.', '-'].includes(value);

const isSingleDigit = (value: string): value is StringifiedDigit =>
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(value);

const isNumberWithoutExponent = (values: string[]): values is (StringifiedDigit | '.' | '-')[] =>
  values.every(value => isSingleDigit(value) || isNonDigit(value));

const DIGIT_TOKENS: Record<StringifiedDigit | '.' | '-', DigitToken | OperatorToken | PeriodToken> = {
  '0': { type: 'DIGIT', digit: 0 },
  '1': { type: 'DIGIT', digit: 1 },
  '2': { type: 'DIGIT', digit: 2 },
  '3': { type: 'DIGIT', digit: 3 },
  '4': { type: 'DIGIT', digit: 4 },
  '5': { type: 'DIGIT', digit: 5 },
  '6': { type: 'DIGIT', digit: 6 },
  '7': { type: 'DIGIT', digit: 7 },
  '8': { type: 'DIGIT', digit: 8 },
  '9': { type: 'DIGIT', digit: 9 },
  '.': { type: 'PERIOD' },
  '-': { type: 'OPERATOR', operator: '-' }
};

/**
 * Return the tokenized number
 *
 * @param value A number
 * @returns an array with zero, one, or multiple `Token`
 */
export const tokenizeNumber = (value: number): Token[] => {
  if (!Number.isFinite(value)) {
    return [];
  }

  // oxlint-disable-next-line unicorn/prefer-spread
  const digits = Array.from(value.toString());

  if (isNumberWithoutExponent(digits)) {
    return digits.map(digit => DIGIT_TOKENS[digit]);
  }

  return [{ type: 'NUMBER', value }];
};
