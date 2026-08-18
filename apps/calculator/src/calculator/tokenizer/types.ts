export type TokenType =
  | 'NUMBER'
  | 'DIGIT'
  | 'PERIOD'
  | 'OPERATOR'
  | 'FUNCTION'
  | 'CONSTANT'
  | 'SQRT'
  | 'SQUARE'
  | 'PARENTHESIS_OPEN'
  | 'PARENTHESIS_CLOSE'
  | 'FACTORIAL'
  | 'PERCENT';

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Operator = '+' | '-' | '*' | '/' | '^';

export type Constant = 'pi' | 'e';

export type FunctionName = 'sin' | 'cos' | 'tan' | 'arcsin' | 'arccos' | 'arctan' | 'ln' | 'log' | 'exp';

export type NumberToken = { type: 'NUMBER'; value: number };

export type DigitToken = { type: 'DIGIT'; digit: Digit };

export type PeriodToken = { type: 'PERIOD' };

export type OperatorToken = { type: 'OPERATOR'; operator: Operator };

export type FunctionToken = { type: 'FUNCTION'; function: FunctionName };

export type ConstantToken = { type: 'CONSTANT'; constant: Constant };

export type ParenthesisOpenToken = { type: 'PARENTHESIS_OPEN' };

export type ParenthesisCloseToken = { type: 'PARENTHESIS_CLOSE' };

export type SqrtToken = { type: 'SQRT' };

export type SquareToken = { type: 'SQUARE' };

export type FactorialToken = { type: 'FACTORIAL' };

export type PercentToken = { type: 'PERCENT' };

export type Token =
  | NumberToken
  | DigitToken
  | PeriodToken
  | OperatorToken
  | FunctionToken
  | ConstantToken
  | ParenthesisOpenToken
  | ParenthesisCloseToken
  | SqrtToken
  | SquareToken
  | FactorialToken
  | PercentToken;

export const isOperator = (token: Token | undefined): token is OperatorToken => token?.type === 'OPERATOR';

export const isFunction = (token: Token | undefined): token is FunctionToken => token?.type === 'FUNCTION';

export const isConstant = (token: Token | undefined): token is ConstantToken => token?.type === 'CONSTANT';

export const isNumber = (token: Token | undefined): token is NumberToken => token?.type === 'NUMBER';

export const isDigit = (token: Token | undefined): token is DigitToken => token?.type === 'DIGIT';

export const isPeriod = (token: Token | undefined): token is PeriodToken => token?.type === 'PERIOD';

export const isClosingParenthesis = (token: Token | undefined): token is ParenthesisCloseToken =>
  token?.type === 'PARENTHESIS_CLOSE';

export const isOpeningParenthesis = (token: Token | undefined): token is ParenthesisOpenToken =>
  token?.type === 'PARENTHESIS_OPEN';

export const isFactorial = (token: Token | undefined): token is FactorialToken => token?.type === 'FACTORIAL';

export const isPercent = (token: Token | undefined): token is PercentToken => token?.type === 'PERCENT';

export const isSquare = (token: Token | undefined): boolean => token?.type === 'SQUARE';
