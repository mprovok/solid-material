import { assert, describe, expect, it } from 'vitest';

import type { Token } from '../tokenizer/types';

import { parse } from './parser';

// The initial draft of these unit tests was written by Mistral Small 4.
// The code was subsequently heavily edited and a number of tests were
// manually added to more thoroughly test complex expressions and associativity

describe('Parser', () => {
  describe('Number Literals', () => {
    it('should parse single digit as a NUMBER_LITERAL', () => {
      const tokens: Token[] = [{ type: 'DIGIT', digit: 3 }];
      const ast = parse(tokens, true);
      expect(ast).toEqual({ type: 'NUMBER_LITERAL', value: '3' });
    });

    it('should parse multiple adjacent digits as a single NUMBER_LITERAL', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 2 },
        { type: 'DIGIT', digit: 3 }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({ type: 'NUMBER_LITERAL', value: '23' });
    });

    it('should parse decimal numbers', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 3 },
        { type: 'PERIOD' },
        { type: 'DIGIT', digit: 1 },
        { type: 'DIGIT', digit: 4 }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({ type: 'NUMBER_LITERAL', value: '3.14' });
    });

    it('should parse number starting with decimal separator', () => {
      const tokens: Token[] = [{ type: 'PERIOD' }, { type: 'DIGIT', digit: 1 }, { type: 'DIGIT', digit: 4 }];
      const ast = parse(tokens, true);
      expect(ast).toEqual({ type: 'NUMBER_LITERAL', value: '.14' });
    });

    it('should parse number ending with decimal separator', () => {
      const tokens: Token[] = [{ type: 'DIGIT', digit: 3 }, { type: 'DIGIT', digit: 1 }, { type: 'PERIOD' }];
      const ast = parse(tokens, true);
      expect(ast).toEqual({ type: 'NUMBER_LITERAL', value: '31.' });
    });

    it('should parse negative numbers', () => {
      const tokens: Token[] = [
        { type: 'OPERATOR', operator: '-' },
        { type: 'DIGIT', digit: 3 }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({ type: 'NUMBER_LITERAL', value: '-3' });
    });

    it('should parse unary plus', () => {
      const tokens: Token[] = [
        { type: 'OPERATOR', operator: '+' },
        { type: 'DIGIT', digit: 3 },
        { type: 'PERIOD' },
        { type: 'DIGIT', digit: 0 }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({ type: 'NUMBER_LITERAL', value: '3.0' });
    });

    it('should parse number tokens', () => {
      const tokens: Token[] = [{ type: 'NUMBER', value: 1.2e24 }];
      const ast = parse(tokens, true);
      expect(ast).toEqual({ type: 'NUMBER_LITERAL', value: '1.2e+24' });
    });
  });

  describe('Binary Operations', () => {
    it('should parse addition', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 2 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'DIGIT', digit: 3 }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '+',
        left: { type: 'NUMBER_LITERAL', value: '2' },
        right: { type: 'NUMBER_LITERAL', value: '3' }
      });
    });

    it('should parse multiplication', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 2 },
        { type: 'OPERATOR', operator: '*' },
        { type: 'DIGIT', digit: 3 }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '*',
        left: { type: 'NUMBER_LITERAL', value: '2' },
        right: { type: 'NUMBER_LITERAL', value: '3' }
      });
    });

    it('should parse implicit multiplication', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 2 },
        { type: 'PARENTHESIS_OPEN' },
        { type: 'DIGIT', digit: 3 },
        { type: 'PARENTHESIS_CLOSE' }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '*',
        left: { type: 'NUMBER_LITERAL', value: '2' },
        right: { type: 'NUMBER_LITERAL', value: '3' }
      });
    });

    it('should parse multiple binary operations with correct precedence (1)', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 2 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'DIGIT', digit: 3 },
        { type: 'OPERATOR', operator: '*' },
        { type: 'DIGIT', digit: 4 }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
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
    });

    it('should parse multiple binary operations with correct precedence (2)', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 2 },
        { type: 'OPERATOR', operator: '*' },
        { type: 'DIGIT', digit: 3 },
        { type: 'OPERATOR', operator: '-' },
        { type: 'DIGIT', digit: 4 }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '-',
        left: {
          type: 'BINARY_OPERATION',
          operator: '*',
          left: { type: 'NUMBER_LITERAL', value: '2' },
          right: { type: 'NUMBER_LITERAL', value: '3' }
        },
        right: { type: 'NUMBER_LITERAL', value: '4' }
      });
    });

    it('should parse multiple binary operations with correct precedence (3)', () => {
      const tokens: Token[] = [
        { type: 'PARENTHESIS_OPEN' },
        { type: 'DIGIT', digit: 2 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'DIGIT', digit: 3 },
        { type: 'PARENTHESIS_CLOSE' },
        { type: 'OPERATOR', operator: '*' },
        { type: 'DIGIT', digit: 4 }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
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
    });

    it('should parse multiplication/division with left associativity', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 1 },
        { type: 'OPERATOR', operator: '/' },
        { type: 'DIGIT', digit: 2 },
        { type: 'OPERATOR', operator: '*' },
        { type: 'DIGIT', digit: 3 }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '*',
        left: {
          type: 'BINARY_OPERATION',
          operator: '/',
          left: { type: 'NUMBER_LITERAL', value: '1' },
          right: { type: 'NUMBER_LITERAL', value: '2' }
        },
        right: { type: 'NUMBER_LITERAL', value: '3' }
      });
    });

    it('should parse addition/subtraction with left associativity', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 4 },
        { type: 'OPERATOR', operator: '-' },
        { type: 'DIGIT', digit: 2 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'DIGIT', digit: 3 }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
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
    });

    it('should parse exponentiation with right associativity', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 4 },
        { type: 'OPERATOR', operator: '^' },
        { type: 'DIGIT', digit: 2 },
        { type: 'OPERATOR', operator: '^' },
        { type: 'DIGIT', digit: 3 }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
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
    });
  });

  describe('Unary Operations', () => {
    it('should parse factorial', () => {
      const tokens: Token[] = [{ type: 'DIGIT', digit: 5 }, { type: 'FACTORIAL' }];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'UNARY_OPERATION',
        operator: '!',
        operand: { type: 'NUMBER_LITERAL', value: '5' }
      });
    });

    it('should parse percentage', () => {
      const tokens: Token[] = [{ type: 'DIGIT', digit: 5 }, { type: 'PERCENT' }];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'UNARY_OPERATION',
        operator: '%',
        operand: { type: 'NUMBER_LITERAL', value: '5' }
      });
    });

    it('should parse square root', () => {
      const tokens: Token[] = [{ type: 'SQRT' }, { type: 'DIGIT', digit: 5 }, { type: 'DIGIT', digit: 0 }];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'UNARY_OPERATION',
        operator: 'sqrt',
        operand: { type: 'NUMBER_LITERAL', value: '50' }
      });
    });

    it('should parse square', () => {
      const tokens: Token[] = [{ type: 'DIGIT', digit: 3 }, { type: 'SQUARE' }];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'UNARY_OPERATION',
        operator: 'square',
        operand: { type: 'NUMBER_LITERAL', value: '3' }
      });
    });

    it('should parse square having a higher associativity', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 1 },
        { type: 'OPERATOR', operator: '-' },
        { type: 'DIGIT', digit: 5 },
        { type: 'SQUARE' }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '-',
        left: { type: 'NUMBER_LITERAL', value: '1' },
        right: {
          type: 'UNARY_OPERATION',
          operator: 'square',
          operand: { type: 'NUMBER_LITERAL', value: '5' }
        }
      });
    });

    it('should parse factorial having a higher associativity', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 1 },
        { type: 'OPERATOR', operator: '-' },
        { type: 'DIGIT', digit: 5 },
        { type: 'FACTORIAL' }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '-',
        left: { type: 'NUMBER_LITERAL', value: '1' },
        right: {
          type: 'UNARY_OPERATION',
          operator: '!',
          operand: { type: 'NUMBER_LITERAL', value: '5' }
        }
      });
    });

    it('should parse percentage having a higher associativity', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 1 },
        { type: 'OPERATOR', operator: '-' },
        { type: 'DIGIT', digit: 5 },
        { type: 'PERCENT' }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '-',
        left: { type: 'NUMBER_LITERAL', value: '1' },
        right: {
          type: 'UNARY_OPERATION',
          operator: '%',
          operand: { type: 'NUMBER_LITERAL', value: '5' }
        }
      });
    });
  });

  describe('Functions', () => {
    it('should parse function with number as argument', () => {
      const tokens: Token[] = [
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 2 },
        { type: 'PARENTHESIS_CLOSE' }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'FUNCTION_CALL',
        name: 'sin',
        argument: { type: 'NUMBER_LITERAL', value: '2' },
        isRadians: true
      });
    });

    it('should parse function with expression as argument', () => {
      const tokens: Token[] = [
        { type: 'FUNCTION', function: 'cos' },
        { type: 'DIGIT', digit: 2 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'DIGIT', digit: 3 },
        { type: 'PARENTHESIS_CLOSE' }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'FUNCTION_CALL',
        name: 'cos',
        argument: {
          type: 'BINARY_OPERATION',
          operator: '+',
          left: { type: 'NUMBER_LITERAL', value: '2' },
          right: { type: 'NUMBER_LITERAL', value: '3' }
        },
        isRadians: true
      });
    });

    it('should parse sin function with degrees', () => {
      const tokens: Token[] = [
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 9 },
        { type: 'DIGIT', digit: 0 },
        { type: 'PARENTHESIS_CLOSE' }
      ];
      const ast = parse(tokens, false);
      expect(ast).toEqual({
        type: 'FUNCTION_CALL',
        name: 'sin',
        argument: { type: 'NUMBER_LITERAL', value: '90' },
        isRadians: false
      });
    });

    it('should parse multiple functions', () => {
      const tokens: Token[] = [
        { type: 'FUNCTION', function: 'sin' },
        { type: 'DIGIT', digit: 2 },
        { type: 'PARENTHESIS_CLOSE' },
        { type: 'OPERATOR', operator: '+' },
        { type: 'FUNCTION', function: 'cos' },
        { type: 'DIGIT', digit: 3 },
        { type: 'PARENTHESIS_CLOSE' }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '+',
        left: {
          type: 'FUNCTION_CALL',
          name: 'sin',
          argument: { type: 'NUMBER_LITERAL', value: '2' },
          isRadians: true
        },
        right: {
          type: 'FUNCTION_CALL',
          name: 'cos',
          argument: { type: 'NUMBER_LITERAL', value: '3' },
          isRadians: true
        }
      });
    });
  });

  describe('Constants', () => {
    it('should parse pi constant', () => {
      const tokens: Token[] = [{ type: 'CONSTANT', constant: 'pi' }];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'CONSTANT_LITERAL',
        value: 'pi'
      });
    });

    it('should parse e constant', () => {
      const tokens: Token[] = [{ type: 'CONSTANT', constant: 'e' }];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'CONSTANT_LITERAL',
        value: 'e'
      });
    });
  });

  describe('Complex Expressions', () => {
    it('should parse a complex expression with multiple operations (1)', () => {
      // 2 ^ 3 + 4 * 5
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 2 },
        { type: 'OPERATOR', operator: '^' },
        { type: 'DIGIT', digit: 3 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'DIGIT', digit: 4 },
        { type: 'OPERATOR', operator: '*' },
        { type: 'DIGIT', digit: 5 }
      ];
      const ast = parse(tokens, true);
      // (2 ^ 3) + (4 * 5)
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '+',
        left: {
          type: 'BINARY_OPERATION',
          operator: '^',
          left: { type: 'NUMBER_LITERAL', value: '2' },
          right: { type: 'NUMBER_LITERAL', value: '3' }
        },
        right: {
          type: 'BINARY_OPERATION',
          operator: '*',
          left: { type: 'NUMBER_LITERAL', value: '4' },
          right: { type: 'NUMBER_LITERAL', value: '5' }
        }
      });
    });

    it('should parse a complex expression with multiple operations (2)', () => {
      // 1 - 2 - 3 ^ 4 / 5 * 6
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 1 },
        { type: 'OPERATOR', operator: '-' },
        { type: 'DIGIT', digit: 2 },
        { type: 'OPERATOR', operator: '-' },
        { type: 'DIGIT', digit: 3 },
        { type: 'OPERATOR', operator: '^' },
        { type: 'DIGIT', digit: 4 },
        { type: 'OPERATOR', operator: '/' },
        { type: 'DIGIT', digit: 5 },
        { type: 'OPERATOR', operator: '*' },
        { type: 'DIGIT', digit: 6 }
      ];
      const ast = parse(tokens, true);
      // (1 - 2) - (((3 ^ 4) / 5) * 6)
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '-',
        left: {
          type: 'BINARY_OPERATION',
          operator: '-',
          left: {
            type: 'NUMBER_LITERAL',
            value: '1'
          },
          right: {
            type: 'NUMBER_LITERAL',
            value: '2'
          }
        },
        right: {
          type: 'BINARY_OPERATION',
          operator: '*',
          left: {
            type: 'BINARY_OPERATION',
            operator: '/',
            left: {
              type: 'BINARY_OPERATION',
              operator: '^',
              left: {
                type: 'NUMBER_LITERAL',
                value: '3'
              },
              right: {
                type: 'NUMBER_LITERAL',
                value: '4'
              }
            },
            right: {
              type: 'NUMBER_LITERAL',
              value: '5'
            }
          },
          right: {
            type: 'NUMBER_LITERAL',
            value: '6'
          }
        }
      });
    });

    it('should parse a complex expression with functions and constants', () => {
      const tokens: Token[] = [
        { type: 'FUNCTION', function: 'sin' },
        { type: 'CONSTANT', constant: 'pi' },
        { type: 'OPERATOR', operator: '/' },
        { type: 'DIGIT', digit: 2 },
        { type: 'PARENTHESIS_CLOSE' },
        { type: 'OPERATOR', operator: '+' },
        { type: 'CONSTANT', constant: 'e' }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '+',
        left: {
          type: 'FUNCTION_CALL',
          name: 'sin',
          argument: {
            type: 'BINARY_OPERATION',
            operator: '/',
            left: { type: 'CONSTANT_LITERAL', value: 'pi' },
            right: { type: 'NUMBER_LITERAL', value: '2' }
          },
          isRadians: true
        },
        right: {
          type: 'CONSTANT_LITERAL',
          value: 'e'
        }
      });
    });

    it('should parse sqrt followed by multiplication', () => {
      const tokens: Token[] = [
        { type: 'SQRT' },
        { type: 'DIGIT', digit: 5 },
        { type: 'DIGIT', digit: 0 },
        { type: 'OPERATOR', operator: '*' },
        { type: 'PARENTHESIS_OPEN' },
        { type: 'DIGIT', digit: 1 },
        { type: 'PARENTHESIS_CLOSE' }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '*',
        left: {
          type: 'UNARY_OPERATION',
          operator: 'sqrt',
          operand: { type: 'NUMBER_LITERAL', value: '50' }
        },
        right: { type: 'NUMBER_LITERAL', value: '1' }
      });
    });

    it('should parse sqrt with implicit multiplication', () => {
      const tokens: Token[] = [
        { type: 'SQRT' },
        { type: 'DIGIT', digit: 5 },
        { type: 'DIGIT', digit: 0 },
        { type: 'PARENTHESIS_OPEN' },
        { type: 'DIGIT', digit: 2 },
        { type: 'OPERATOR', operator: '+' },
        { type: 'DIGIT', digit: 3 },
        { type: 'PARENTHESIS_CLOSE' }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '*',
        left: {
          type: 'UNARY_OPERATION',
          operator: 'sqrt',
          operand: { type: 'NUMBER_LITERAL', value: '50' }
        },
        right: {
          type: 'BINARY_OPERATION',
          operator: '+',
          left: { type: 'NUMBER_LITERAL', value: '2' },
          right: { type: 'NUMBER_LITERAL', value: '3' }
        }
      });
    });

    it('should parse combination of binary and unary operations', () => {
      const tokens: Token[] = [
        { type: 'DIGIT', digit: 5 },
        { type: 'SQUARE' },
        { type: 'OPERATOR', operator: '/' },
        { type: 'DIGIT', digit: 2 },
        { type: 'FACTORIAL' }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '/',
        left: {
          type: 'UNARY_OPERATION',
          operator: 'square',
          operand: { type: 'NUMBER_LITERAL', value: '5' }
        },
        right: {
          type: 'UNARY_OPERATION',
          operator: '!',
          operand: { type: 'NUMBER_LITERAL', value: '2' }
        }
      });
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error when given empty input', () => {
      const tokens: Token[] = [];
      assert.throws(() => parse(tokens, true), Error, 'Unexpected end of input');
    });

    it('should handle superfluous parentheses', () => {
      const tokens: Token[] = [
        { type: 'PARENTHESIS_OPEN' },
        { type: 'DIGIT', digit: 2 },
        { type: 'PARENTHESIS_CLOSE' },
        { type: 'OPERATOR', operator: '+' },
        { type: 'PARENTHESIS_OPEN' },
        { type: 'DIGIT', digit: 3 },
        { type: 'PARENTHESIS_CLOSE' }
      ];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'BINARY_OPERATION',
        operator: '+',
        left: { type: 'NUMBER_LITERAL', value: '2' },
        right: { type: 'NUMBER_LITERAL', value: '3' }
      });
    });

    it('should handle multiple unary operators', () => {
      const tokens: Token[] = [{ type: 'DIGIT', digit: 5 }, { type: 'FACTORIAL' }, { type: 'PERCENT' }];
      const ast = parse(tokens, true);
      expect(ast).toEqual({
        type: 'UNARY_OPERATION',
        operator: '%',
        operand: {
          type: 'UNARY_OPERATION',
          operator: '!',
          operand: { type: 'NUMBER_LITERAL', value: '5' }
        }
      });
    });
  });
});
