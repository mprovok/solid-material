import { describe, expect, it } from 'vitest';

import type { FunctionName, Operator } from '../tokenizer/types';

import { evaluate } from './evaluate';

describe('Evaluate', () => {
  describe('Number Literals', () => {
    it('should evaluate the number zero', () => {
      const result = evaluate({ type: 'NUMBER_LITERAL', value: '0' });
      expect(result).toBe(0);
    });

    it('should evaluate a positive number', () => {
      const result = evaluate({ type: 'NUMBER_LITERAL', value: '12' });
      expect(result).toBe(12);
    });

    it('should evaluate a negative number', () => {
      const result = evaluate({ type: 'NUMBER_LITERAL', value: '-10' });
      expect(result).toBe(-10);
    });

    it('should evaluate a number with a decimal separator', () => {
      const result = evaluate({ type: 'NUMBER_LITERAL', value: '3.14' });
      expect(result).toBeCloseTo(3.14, 2);
    });
  });

  describe('Constants', () => {
    it('should evaluate the constant pi', () => {
      const result = evaluate({ type: 'CONSTANT_LITERAL', value: 'pi' });
      // oxlint-disable-next-line oxc/approx-constant
      expect(result).toBeCloseTo(3.141592653589793, 15);
    });

    it('should evaluate the constant e', () => {
      const result = evaluate({ type: 'CONSTANT_LITERAL', value: 'e' });
      // oxlint-disable-next-line oxc/approx-constant
      expect(result).toBeCloseTo(2.718281828459045, 15);
    });
  });

  describe('Binary Operations', () => {
    it.each([
      ['+', 2, 3, 5],
      ['-', 2, 3, -1],
      ['*', 2, 3, 6],
      ['/', 3, 2, 1.5],
      ['^', 2, 3, 8]
    ] satisfies [Operator, number, number, number][])(
      'should evaluate binary operation $0',
      (operator, left, right, expected) => {
        const result = evaluate({
          type: 'BINARY_OPERATION',
          operator,
          left: { type: 'NUMBER_LITERAL', value: left.toString() },
          right: { type: 'NUMBER_LITERAL', value: right.toString() }
        });
        expect(result).toBeCloseTo(expected, 1);
      }
    );

    it('should evaluate nested binary operations', () => {
      const resultLeft = evaluate({
        type: 'BINARY_OPERATION',
        operator: '*',
        left: {
          type: 'BINARY_OPERATION',
          operator: '+',
          left: { type: 'NUMBER_LITERAL', value: '2' },
          right: { type: 'NUMBER_LITERAL', value: '3' }
        },
        right: { type: 'NUMBER_LITERAL', value: '4' }
      });
      expect(resultLeft).toBe(20);

      const resultRight = evaluate({
        type: 'BINARY_OPERATION',
        operator: '+',
        left: { type: 'NUMBER_LITERAL', value: '2' },
        right: {
          type: 'BINARY_OPERATION',
          operator: '*',
          left: { type: 'NUMBER_LITERAL', value: '3' },
          right: { type: 'NUMBER_LITERAL', value: '4' }
        }
      });
      expect(resultRight).toBe(14);
    });
  });

  describe('Unary Operations', () => {
    it.each([
      [0, 1],
      [1, 1],
      [2, 2],
      [3, 6],
      [5, 120],
      [-1, -1],
      [-2, -2],
      [-5, -120]
    ])('should evaluate the factorial of $0 to be $1', (input, expected) => {
      const result = evaluate({
        type: 'UNARY_OPERATION',
        operator: '!',
        operand: { type: 'NUMBER_LITERAL', value: input.toString() }
      });
      expect(result).toBe(expected);
    });

    it('should evaluate a percentage', () => {
      const result = evaluate({
        type: 'UNARY_OPERATION',
        operator: '%',
        operand: { type: 'NUMBER_LITERAL', value: '5' }
      });
      expect(result).toBeCloseTo(0.05, 2);
    });

    it('should evaluate the square root', () => {
      const result = evaluate({
        type: 'UNARY_OPERATION',
        operator: 'sqrt',
        operand: { type: 'NUMBER_LITERAL', value: '144' }
      });
      expect(result).toBe(12);
    });

    it('should evaluate the square', () => {
      const result = evaluate({
        type: 'UNARY_OPERATION',
        operator: 'square',
        operand: { type: 'NUMBER_LITERAL', value: '8' }
      });
      expect(result).toBe(64);
    });
  });

  describe('Functions', () => {
    it.each([
      ['sin', Math.PI / 6, 0.5],
      ['cos', Math.PI / 3, 0.5],
      ['tan', Math.PI / 4, 1],
      ['arcsin', 1, Math.PI / 2],
      ['arccos', -1, Math.PI],
      ['arctan', 10 ** 1_000, Math.PI / 2],
      ['exp', 2, Math.E ** 2],
      ['ln', Math.E, 1],
      ['log', 10, 1]
    ] satisfies [FunctionName, number, number][])(
      'should evaluate function $0 of $1 as radians',
      (name, value, expected) => {
        const result = evaluate({
          type: 'FUNCTION_CALL',
          name,
          argument: { type: 'NUMBER_LITERAL', value: value.toString() },
          isRadians: true
        });
        expect(result).toBeCloseTo(expected, 6);
      }
    );

    it.each([
      ['sin', 30, 0.5],
      ['cos', 60, 0.5],
      ['tan', 45, 1],
      ['arcsin', 1, 90],
      ['arccos', -1, 180],
      ['arctan', 10 ** 1_000, 90],
      ['exp', 2, Math.E ** 2],
      ['ln', Math.E, 1],
      ['log', 10, 1]
    ] satisfies [FunctionName, number, number][])(
      'should evaluate function $0 of $1 as degrees',
      (name, value, expected) => {
        const result = evaluate({
          type: 'FUNCTION_CALL',
          name,
          argument: { type: 'NUMBER_LITERAL', value: value.toString() },
          isRadians: false
        });
        expect(result).toBeCloseTo(expected, 6);
      }
    );
  });

  describe('Precision using decimal.js', () => {
    it('should evaluate 4 - 2 + 3 to be 5', () => {
      const result = evaluate({
        type: 'BINARY_OPERATION',
        operator: '+',
        left: {
          type: 'BINARY_OPERATION',
          operator: '-',
          left: { type: 'NUMBER_LITERAL', value: '4' },
          right: { type: 'NUMBER_LITERAL', value: '2' }
        },
        right: { type: 'NUMBER_LITERAL', value: '3' }
      });
      expect(result).toBe(5);
    });

    it('should evaluate 4^2^3 to be 65_536', () => {
      const result = evaluate({
        type: 'BINARY_OPERATION',
        operator: '^',
        left: { type: 'NUMBER_LITERAL', value: '4' },
        right: {
          type: 'BINARY_OPERATION',
          operator: '^',
          left: { type: 'NUMBER_LITERAL', value: '2' },
          right: { type: 'NUMBER_LITERAL', value: '3' }
        }
      });
      expect(result).toBe(65536);
    });

    it('should evalute 1 / 98 * 98 to be 1', () => {
      const result = evaluate({
        type: 'BINARY_OPERATION',
        operator: '*',
        left: {
          type: 'BINARY_OPERATION',
          operator: '/',
          left: { type: 'NUMBER_LITERAL', value: '1' },
          right: { type: 'NUMBER_LITERAL', value: '98' }
        },
        right: { type: 'NUMBER_LITERAL', value: '98' }
      });
      expect(result).toBe(1);
    });

    it('should evaluate 4.55 / 0.05 to be 91', () => {
      const result = evaluate({
        type: 'BINARY_OPERATION',
        operator: '/',
        left: { type: 'NUMBER_LITERAL', value: '4.55' },
        right: { type: 'NUMBER_LITERAL', value: '0.05' }
      });
      expect(result).toBe(91);
    });
  });
});
