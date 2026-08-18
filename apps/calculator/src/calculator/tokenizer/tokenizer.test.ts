import { describe, expect, it } from 'vitest';

import { CalculatorAction } from '../Calculator.types';

import type { Operator, Token } from './types';

import { backspace, balanceParentheses, process, tokenizeNumber } from './tokenizer';

// The initial draft of these unit tests was written by Mistral Small 4

describe('Tokenizer', () => {
  describe('process()', () => {
    it('should add a digit to empty input', () => {
      const initialTokens: Token[] = [];
      const result = process(initialTokens, CalculatorAction.DIGIT_0);
      expect(result).toEqual([{ type: 'DIGIT', digit: 0 }]);
    });

    it('should add multiple digits as separate tokens', () => {
      let tokens: Token[] = [];
      tokens = process(tokens, CalculatorAction.DIGIT_1);
      tokens = process(tokens, CalculatorAction.DIGIT_2);
      expect(tokens).toEqual([
        { type: 'DIGIT', digit: 1 },
        { type: 'DIGIT', digit: 2 }
      ]);
    });

    it.each([
      [CalculatorAction.DIGIT_0, 0],
      [CalculatorAction.DIGIT_1, 1],
      [CalculatorAction.DIGIT_2, 2],
      [CalculatorAction.DIGIT_3, 3],
      [CalculatorAction.DIGIT_4, 4],
      [CalculatorAction.DIGIT_5, 5],
      [CalculatorAction.DIGIT_6, 6],
      [CalculatorAction.DIGIT_7, 7],
      [CalculatorAction.DIGIT_8, 8],
      [CalculatorAction.DIGIT_9, 9]
    ])('should add digits $1 as a token', (action, digit) => {
      let tokens: Token[] = [];
      tokens = process(tokens, action);
      expect(tokens).toEqual([{ type: 'DIGIT', digit }]);
    });

    it('should add percent sign', () => {
      let tokens: Token[] = [];
      tokens = process(tokens, CalculatorAction.PERCENT);
      expect(tokens).toEqual([{ type: 'PERCENT' }]);
    });

    it('should add factorial sign', () => {
      let tokens: Token[] = [];
      tokens = process(tokens, CalculatorAction.FACTORIAL);
      expect(tokens).toEqual([{ type: 'FACTORIAL' }]);
    });

    it('should add x^2', () => {
      let tokens: Token[] = [];
      tokens = process(tokens, CalculatorAction.SQUARE);
      expect(tokens).toEqual([{ type: 'SQUARE' }]);
    });

    it('should add sqrt', () => {
      let tokens: Token[] = [];
      tokens = process(tokens, CalculatorAction.SQRT);
      expect(tokens).toEqual([{ type: 'SQRT' }]);
    });

    it('should add 10^x', () => {
      let tokens: Token[] = [];
      tokens = process(tokens, CalculatorAction.TEN_POWER_X);
      expect(tokens).toEqual([
        { type: 'DIGIT', digit: 1 },
        { type: 'DIGIT', digit: 0 },
        { type: 'OPERATOR', operator: '^' }
      ]);
    });

    it('should add a decimal separator', () => {
      const initialTokens: Token[] = [{ type: 'DIGIT', digit: 3 }];
      const result = process(initialTokens, CalculatorAction.DECIMAL_SEPARATOR);
      expect(result).toEqual([{ type: 'DIGIT', digit: 3 }, { type: 'PERIOD' }]);
    });

    it('should not add a second decimal separator to a number', () => {
      const initialTokens: Token[] = [{ type: 'DIGIT', digit: 4 }, { type: 'PERIOD' }, { type: 'DIGIT', digit: 5 }];
      const result = process(initialTokens, CalculatorAction.DECIMAL_SEPARATOR);
      // No change
      expect(result).toEqual(initialTokens);
    });

    it('should add an operator', () => {
      const initialTokens: Token[] = [{ type: 'DIGIT', digit: 6 }];
      const result = process(initialTokens, CalculatorAction.OPERATOR_ADD);
      expect(result).toEqual([
        { type: 'DIGIT', digit: 6 },
        { type: 'OPERATOR', operator: '+' }
      ]);
    });

    it('should replace the last operator with higher precedence', () => {
      const initialTokens: Token[] = [
        { type: 'DIGIT', digit: 7 },
        { type: 'OPERATOR', operator: '*' }
      ];
      const result = process(initialTokens, CalculatorAction.OPERATOR_ADD);
      expect(result).toEqual([
        { type: 'DIGIT', digit: 7 },
        { type: 'OPERATOR', operator: '+' }
      ]);
    });

    it.each(['*', '/', '^'] satisfies Operator[])('should add minus operator if last operator is $0', operator => {
      const initialTokens: Token[] = [
        { type: 'DIGIT', digit: 8 },
        { type: 'OPERATOR', operator }
      ];
      const result = process(initialTokens, CalculatorAction.OPERATOR_SUBTRACT);
      expect(result).toEqual([
        { type: 'DIGIT', digit: 8 },
        { type: 'OPERATOR', operator },
        { type: 'OPERATOR', operator: '-' }
      ]);
    });

    it.each(['+', '-'] satisfies Operator[])('should replace with minus operator if last operator is $0', operator => {
      const initialTokens: Token[] = [
        { type: 'DIGIT', digit: 9 },
        { type: 'OPERATOR', operator }
      ];
      const result = process(initialTokens, CalculatorAction.OPERATOR_SUBTRACT);
      expect(result).toEqual([
        { type: 'DIGIT', digit: 9 },
        { type: 'OPERATOR', operator: '-' }
      ]);
    });

    it.each(['+', '*', '/', '^'] satisfies Operator[])(
      'should replace operator followed by minus operator by new operator $0',
      operator => {
        const ACTIONS: Record<Operator, CalculatorAction> = {
          '+': CalculatorAction.OPERATOR_ADD,
          '-': CalculatorAction.OPERATOR_SUBTRACT,
          '*': CalculatorAction.OPERATOR_MULTIPLY,
          '/': CalculatorAction.OPERATOR_DIVIDE,
          '^': CalculatorAction.OPERATOR_POWER
        };

        const initialTokens: Token[] = [
          { type: 'DIGIT', digit: 5 },
          { type: 'OPERATOR', operator: '*' },
          { type: 'OPERATOR', operator: '-' }
        ];
        const result = process(initialTokens, ACTIONS[operator]);
        expect(result).toEqual([
          { type: 'DIGIT', digit: 5 },
          { type: 'OPERATOR', operator }
        ]);
      }
    );

    it.each(['*', '/'] satisfies Operator[])(
      'should not replace minus operator and previous operator by operator -',
      operator => {
        const initialTokens: Token[] = [
          { type: 'DIGIT', digit: 5 },
          { type: 'OPERATOR', operator },
          { type: 'OPERATOR', operator: '-' }
        ];
        const result = process(initialTokens, CalculatorAction.OPERATOR_SUBTRACT);
        // No change
        expect(result).toEqual(initialTokens);
      }
    );

    it('should add a factorial sign', () => {
      const initialTokens: Token[] = [{ type: 'DIGIT', digit: 5 }];
      const result = process(initialTokens, CalculatorAction.FACTORIAL);
      expect(result).toEqual([{ type: 'DIGIT', digit: 5 }, { type: 'FACTORIAL' }]);
    });

    it.each([
      [CalculatorAction.EXP, 'exp'],
      [CalculatorAction.LN, 'ln'],
      [CalculatorAction.LOG, 'log'],
      [CalculatorAction.SIN, 'sin'],
      [CalculatorAction.COS, 'cos'],
      [CalculatorAction.TAN, 'tan'],
      [CalculatorAction.ARCSIN, 'arcsin'],
      [CalculatorAction.ARCCOS, 'arccos'],
      [CalculatorAction.ARCTAN, 'arctan']
    ])('should add function $1', (action: CalculatorAction, name: string) => {
      const initialTokens: Token[] = [];
      const result = process(initialTokens, action);
      expect(result).toEqual([{ type: 'FUNCTION', function: name }]);
    });

    it('should add constant pi', () => {
      const initialTokens: Token[] = [];
      const result = process(initialTokens, CalculatorAction.PI);
      expect(result).toEqual([{ type: 'CONSTANT', constant: 'pi' }]);
    });

    it('should add constant e', () => {
      const initialTokens: Token[] = [];
      const result = process(initialTokens, CalculatorAction.E);
      expect(result).toEqual([{ type: 'CONSTANT', constant: 'e' }]);
    });

    it('should add opening parenthesis after operator', () => {
      const initialTokens: Token[] = [
        { type: 'DIGIT', digit: 5 },
        { type: 'OPERATOR', operator: '+' }
      ];
      const result = process(initialTokens, CalculatorAction.PARENTHESES);
      expect(result).toEqual([
        { type: 'DIGIT', digit: 5 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'PARENTHESIS_OPEN' }
      ]);
    });

    it('should add opening parenthesis after function', () => {
      const initialTokens: Token[] = [{ type: 'FUNCTION', function: 'sin' }];
      const result = process(initialTokens, CalculatorAction.PARENTHESES);
      expect(result).toEqual([{ type: 'FUNCTION', function: 'sin' }, { type: 'PARENTHESIS_OPEN' }]);
    });

    it('should add opening parenthesis after opening parenthesis', () => {
      const initialTokens: Token[] = [
        { type: 'DIGIT', digit: 5 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'PARENTHESIS_OPEN' }
      ];
      const result = process(initialTokens, CalculatorAction.PARENTHESES);
      expect(result).toEqual([
        { type: 'DIGIT', digit: 5 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'PARENTHESIS_OPEN' },
        { type: 'PARENTHESIS_OPEN' }
      ]);
    });

    it('should add closing parenthesis when more opening than closing parentheses', () => {
      const initialTokens: Token[] = [
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 0 }
      ];

      const result = process(initialTokens, CalculatorAction.PARENTHESES);
      expect(result).toEqual([
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 0 },
        { type: 'PARENTHESIS_CLOSE' }
      ]);
    });

    it('should add opening parenthesis when no more opening than closing parentheses', () => {
      const initialTokens: Token[] = [
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 0 },
        { type: 'PARENTHESIS_CLOSE' }
      ];

      const result = process(initialTokens, CalculatorAction.PARENTHESES);
      expect(result).toEqual([
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 0 },
        { type: 'PARENTHESIS_CLOSE' },
        { type: 'PARENTHESIS_OPEN' }
      ]);
    });
  });

  describe('backspace()', () => {
    it('should remove the last token', () => {
      const initialTokens: Token[] = [
        { type: 'DIGIT', digit: 5 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'DIGIT', digit: 3 }
      ];
      const result = backspace(initialTokens);
      expect(result).toEqual([
        { type: 'DIGIT', digit: 5 },
        { type: 'OPERATOR', operator: '+' }
      ]);
    });

    it('should remove a closing parenthesis without affecting others', () => {
      const initialTokens: Token[] = [{ type: 'DIGIT', digit: 5 }, { type: 'PARENTHESIS_CLOSE' }];
      const result = backspace(initialTokens);
      expect(result).toEqual([{ type: 'DIGIT', digit: 5 }]);
    });

    it('should handle empty input', () => {
      const initialTokens: Token[] = [];
      const result = backspace(initialTokens);
      expect(result).toEqual([]);
    });

    it('should remove a function token', () => {
      const initialTokens: Token[] = [
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 3 },
        { type: 'DIGIT', digit: 0 },
        { type: 'PARENTHESIS_CLOSE' }
      ];
      const result = backspace(initialTokens);
      expect(result).toEqual([
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 3 },
        { type: 'DIGIT', digit: 0 }
      ]);
    });
  });

  describe('balanceParentheses()', () => {
    it('should add missing closing parenthesis after function', () => {
      const initialTokens: Token[] = [
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 0 }
      ];
      const result = balanceParentheses(initialTokens);
      expect(result).toEqual([
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 0 },
        { type: 'PARENTHESIS_CLOSE' }
      ]);
    });

    it('should add missing closing parenthesis after opening parenthesis', () => {
      const initialTokens: Token[] = [{ type: 'DIGIT', digit: 0 }, { type: 'PARENTHESIS_OPEN' }];
      const result = balanceParentheses(initialTokens);
      expect(result).toEqual([
        { type: 'DIGIT', digit: 0 },
        { type: 'PARENTHESIS_OPEN' },
        { type: 'PARENTHESIS_CLOSE' }
      ]);
    });

    it('should add missing closing parenthesis after function and opening parenthesis', () => {
      const initialTokens: Token[] = [
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 0 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'PARENTHESIS_OPEN' },
        { type: 'DIGIT', digit: 1 }
      ];
      const result = balanceParentheses(initialTokens);
      expect(result).toEqual([
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 0 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'PARENTHESIS_OPEN' },
        { type: 'DIGIT', digit: 1 },
        { type: 'PARENTHESIS_CLOSE' },
        { type: 'PARENTHESIS_CLOSE' }
      ]);
    });

    it('should not add closing parentheses if token array is already balanced', () => {
      const initialTokens: Token[] = [
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 0 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'PARENTHESIS_OPEN' },
        { type: 'DIGIT', digit: 1 },
        { type: 'PARENTHESIS_CLOSE' },
        { type: 'PARENTHESIS_CLOSE' }
      ];
      const result = balanceParentheses(initialTokens);

      // No change
      expect(result).toEqual(initialTokens);
    });
  });

  describe('tokenizeNumber()', () => {
    it('should not tokenize an infinite number', () => {
      const result = tokenizeNumber(1 / 0);
      expect(result).toHaveLength(0);
    });

    it('should tokenize small number to multiple digits', () => {
      const result = tokenizeNumber(-1.2);
      expect(result).toEqual([
        { type: 'OPERATOR', operator: '-' },
        { type: 'DIGIT', digit: 1 },
        { type: 'PERIOD' },
        { type: 'DIGIT', digit: 2 }
      ]);
    });

    it('should tokenize very large number to one number token', () => {
      const result = tokenizeNumber(1.2e24);
      expect(result).toEqual([{ type: 'NUMBER', value: 1.2e24 }]);
    });
  });
});
