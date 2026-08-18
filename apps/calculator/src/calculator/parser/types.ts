import type { Constant, FunctionName, Operator } from '../tokenizer/types';

// The initial draft of these type definitions was written by Mistral Small 4

export type ASTType = 'NUMBER_LITERAL' | 'CONSTANT_LITERAL' | 'BINARY_OPERATION' | 'UNARY_OPERATION' | 'FUNCTION_CALL';

export type ASTNode = NumberLiteral | ConstantLiteral | BinaryOperation | UnaryOperation | FunctionCall;

export type UnaryOperator = '!' | '%' | 'sqrt' | 'square';

export type NumberLiteral = {
  type: 'NUMBER_LITERAL';
  // Raw string to preserve precision (e.g., "3.14159", "-3", "30.0")
  value: string;
};

export type ConstantLiteral = {
  type: 'CONSTANT_LITERAL';
  value: Constant;
};

export type BinaryOperation = {
  type: 'BINARY_OPERATION';
  operator: Operator;
  left: ASTNode;
  right: ASTNode;
};

export type UnaryOperation = {
  type: 'UNARY_OPERATION';
  operator: UnaryOperator;
  operand: ASTNode;
};

export type FunctionCall = {
  type: 'FUNCTION_CALL';
  name: FunctionName;
  argument: ASTNode;
  // Whether the argument is in radians (for trigonometric functions)
  isRadians: boolean;
};
