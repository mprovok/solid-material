import type { JSX } from 'solid-js';

import { Superscript } from '../components/Superscript';

import type { Constant, Operator, Token, TokenType } from './types';

import { isConstant, isDigit, isFunction, isNumber, isOperator } from './types';

type TokenStringifier = (token: Token) => JSX.Element;

const OPERATORS: Record<Operator, string> = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
  '^': '^'
};

const CONSTANTS: Record<Constant, string> = {
  pi: 'π',
  e: 'e'
};

const TOKEN_STRINGIFIER: Record<TokenType, TokenStringifier> = {
  NUMBER: (token: Token) => (isNumber(token) ? token.value.toString() : ''),
  DIGIT: (token: Token) => (isDigit(token) ? token.digit.toString() : ''),
  PERIOD: (_token: Token) => '.',
  OPERATOR: (token: Token) => (isOperator(token) ? OPERATORS[token.operator] : ''),
  FUNCTION: (token: Token) => (isFunction(token) ? `${token.function}(` : ''),
  CONSTANT: (token: Token) => (isConstant(token) ? CONSTANTS[token.constant] : ''),
  SQRT: (_token: Token) => '√',
  SQUARE: (_token: Token) => <Superscript base="" superscript="2" />,
  PARENTHESIS_OPEN: (_token: Token) => '(',
  PARENTHESIS_CLOSE: (_token: Token) => ')',
  FACTORIAL: (_token: Token) => '!',
  PERCENT: (_token: Token) => '%'
};

export const toString = (tokens: Token[]): JSX.Element[] => {
  return tokens.map(token => TOKEN_STRINGIFIER[token.type](token));
};
