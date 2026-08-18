import { Decimal } from 'decimal.js';

import type { ASTNode, FunctionCall, UnaryOperator } from '../parser/types';
import type { Constant, Operator } from '../tokenizer/types';

const toRadians = (value: Decimal): Decimal => value.mul(Math.PI / 180);
const toDegrees = (value: Decimal): Decimal => value.mul(180 / Math.PI);

const factorial = (value: Decimal): Decimal => {
  if (value.isInteger()) {
    if (value.isZero()) {
      return new Decimal(1);
    }

    const absoluteValue = value.abs();

    let result = new Decimal(Decimal.sign(value));
    for (let x = new Decimal(2); x.lessThanOrEqualTo(absoluteValue); x = x.add(1)) {
      result = result.mul(x);
    }

    return result;
  }
  return new Decimal(Number.NaN);
};

type BinaryOperation = (a: Decimal, b: Decimal) => Decimal;

type UnaryOperation = (a: Decimal) => Decimal;

const BINARY_OPERATIONS: Record<Operator, BinaryOperation> = {
  '*': (a, b) => a.mul(b),
  '/': (a, b) => a.div(b),
  '+': (a, b) => a.add(b),
  '-': (a, b) => a.sub(b),
  '^': (a, b) => a.pow(b)
};

const UNARY_OPERATONS: Record<UnaryOperator, UnaryOperation> = {
  '!': factorial,
  '%': a => a.div(100),
  sqrt: a => a.sqrt(),
  square: a => a.pow(2)
};

const CONSTANTS: Record<Constant, Decimal> = {
  e: Decimal.exp(1),
  pi: Decimal.acos(-1)
};

const decimalToRadians = (node: FunctionCall, arg: Decimal): Decimal => (node.isRadians ? arg : toRadians(arg));

const decimalFromRadians = (node: FunctionCall, arg: Decimal): Decimal => (node.isRadians ? arg : toDegrees(arg));

export const evaluateDecimal = (node: ASTNode): Decimal => {
  switch (node.type) {
    case 'BINARY_OPERATION': {
      const left = evaluateDecimal(node.left);
      const right = evaluateDecimal(node.right);
      return BINARY_OPERATIONS[node.operator](left, right);
    }
    case 'UNARY_OPERATION': {
      const arg = evaluateDecimal(node.operand);
      return UNARY_OPERATONS[node.operator](arg);
    }
    case 'FUNCTION_CALL': {
      const arg = evaluateDecimal(node.argument);

      switch (node.name) {
        case 'sin': {
          return Decimal.sin(decimalToRadians(node, arg));
        }
        case 'cos': {
          return Decimal.cos(decimalToRadians(node, arg));
        }
        case 'tan': {
          return Decimal.tan(decimalToRadians(node, arg));
        }
        case 'arcsin': {
          return decimalFromRadians(node, Decimal.asin(arg));
        }
        case 'arccos': {
          return decimalFromRadians(node, Decimal.acos(arg));
        }
        case 'arctan': {
          return decimalFromRadians(node, Decimal.atan(arg));
        }
        case 'exp': {
          return Decimal.exp(arg);
        }
        case 'ln': {
          return Decimal.ln(arg);
        }
        case 'log': {
          return Decimal.log10(arg);
        }
        default: {
          throw new Error('Invalid function');
        }
      }
    }
    case 'NUMBER_LITERAL': {
      return new Decimal(node.value);
    }
    case 'CONSTANT_LITERAL': {
      return CONSTANTS[node.value];
    }
    default: {
      throw new Error('Invalid expression');
    }
  }
};

export const evaluate = (node: ASTNode): number => evaluateDecimal(node).toNumber();
