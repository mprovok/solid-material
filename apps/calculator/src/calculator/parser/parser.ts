import type { Operator, Token } from '../tokenizer/types';

import {
  isClosingParenthesis,
  isDigit,
  isFactorial,
  isOperator,
  isPercent,
  isPeriod,
  isSquare
} from '../tokenizer/types';

import type { ASTNode } from './types';

const PRECEDENCE: Record<Operator, number> = {
  '^': 4,
  '*': 3,
  '/': 3,
  '+': 2,
  '-': 2
};

const RIGHT_ASSOCIATIVITY = new Set(['^']);

const getBindingPower = (token: Token): number => {
  if (isOperator(token)) {
    return PRECEDENCE[token.operator];
  }

  return isSquare(token) || isFactorial(token) || isPercent(token) ? 5 : 0;
};

// The initial draft of the Pratt parsing algorithm in the class Parser below
// was written by Mistral Small 4. The private methods of the Parser class
// were modified to properly parse expressions and pass the previously
// generated unit tests.

class Parser {
  private readonly tokens: Token[];
  private pos: number;
  private readonly radians: boolean;

  public constructor(tokens: Token[], radians: boolean) {
    this.tokens = tokens;
    this.pos = 0;
    this.radians = radians;
  }

  private parsePrimary(): ASTNode {
    if (this.pos >= this.tokens.length) {
      throw new Error('Unexpected end of input');
    }

    const token = this.tokens[this.pos];
    this.pos += 1;

    // oxlint-disable-next-line typescript/switch-exhaustiveness-check
    switch (token?.type) {
      case 'NUMBER': {
        return { type: 'NUMBER_LITERAL', value: token.value.toString() };
      }
      case 'PERIOD':
      case 'DIGIT': {
        this.pos -= 1;
        return this.parseNumber(true);
      }
      case 'CONSTANT': {
        return { type: 'CONSTANT_LITERAL', value: token.constant };
      }
      case 'PARENTHESIS_OPEN': {
        const expr = this.parseExpression();
        if (this.pos >= this.tokens.length || !isClosingParenthesis(this.tokens[this.pos])) {
          throw new Error("Expected ')'");
        }

        // Consume ')'
        this.pos += 1;

        return expr;
      }
      case 'FUNCTION': {
        const arg = this.parseExpression();
        if (this.pos >= this.tokens.length || !isClosingParenthesis(this.tokens[this.pos])) {
          throw new Error("Expected ')' after function argument");
        }

        // Consume ')'
        this.pos += 1;

        return {
          type: 'FUNCTION_CALL',
          name: token.function,
          argument: arg,
          isRadians: this.radians
        };
      }
      case 'SQRT': {
        const operand = this.parsePrimary();
        return { type: 'UNARY_OPERATION', operator: 'sqrt', operand };
      }
      case 'OPERATOR': {
        // oxlint-disable-next-line typescript/switch-exhaustiveness-check
        switch (token.operator) {
          case '-': {
            return this.parseNumber(false);
          }
          case '+': {
            return this.parseNumber(true);
          }
          default: {
            throw new Error(`Unexpected operator token: ${token.operator}`);
          }
        }
      }
      default: {
        throw new Error(`Unexpected token: ${token?.type}`);
      }
    }
  }

  private parseNumber(positive: boolean): ASTNode {
    let value = positive ? '' : '-';
    let hasDecimal = false;

    while (this.pos < this.tokens.length) {
      const token = this.tokens[this.pos]!;
      this.pos += 1;

      if (isDigit(token)) {
        value += token.digit.toString();
      } else if (isPeriod(token)) {
        if (hasDecimal) {
          throw new Error('Invalid number format: multiple decimal points');
        }
        value += '.';
        hasDecimal = true;
      } else {
        this.pos -= 1;
        break;
      }
    }

    if (value === '' || value === '.') {
      throw new Error('Invalid number format');
    }

    return { type: 'NUMBER_LITERAL', value };
  }

  private parseExpression(minBp: number = 0): ASTNode {
    let left = this.parsePrimary();

    while (this.pos < this.tokens.length) {
      const token = this.tokens[this.pos]!;
      const bp = getBindingPower(token);

      if (bp < minBp || isClosingParenthesis(token)) {
        break;
      }

      this.pos += 1;

      if (isOperator(token)) {
        if (!RIGHT_ASSOCIATIVITY.has(token.operator) && bp === minBp) {
          this.pos -= 1;
          break;
        }
        const right = this.parseExpression(bp);
        left = { type: 'BINARY_OPERATION', operator: token.operator, left, right };
      } else if (isSquare(token)) {
        left = { type: 'UNARY_OPERATION', operator: 'square', operand: left };
      } else if (isFactorial(token)) {
        left = { type: 'UNARY_OPERATION', operator: '!', operand: left };
      } else if (isPercent(token)) {
        left = { type: 'UNARY_OPERATION', operator: '%', operand: left };
      } else {
        this.pos -= 1;

        // Handle implicit multiplication
        const right = this.parseExpression(0);
        left = { type: 'BINARY_OPERATION', operator: '*', left, right };
      }
    }

    return left;
  }

  public parse(): ASTNode {
    return this.parseExpression();
  }
}

export const parse = (tokens: Token[], radians: boolean): ASTNode => {
  const parser = new Parser(tokens, radians);
  return parser.parse();
};
