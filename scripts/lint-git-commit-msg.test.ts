import { describe, expect, it } from 'vitest';

import type { Config } from './helpers/lint-git-commit-msg';

import { validate } from './helpers/lint-git-commit-msg';

const CONFIG: Config = {
  MAX_SUBJECT_LENGTH: 72,
  MAX_BODY_LINE_LENGTH: 79,
  ALLOWED_TYPES: new Set([
    'feat',
    'fix',
    'docs',
    'style',
    'refactor',
    'perf',
    'test',
    'build',
    'ci',
    'chore',
    'revert'
  ]),
  ALLOWED_SCOPES: new Set(['valid-scope'])
} as const;

// Written by Gemma 4 31B, modified to fix lint warnings

describe('Lint Git commit message', () => {
  describe('Happy Path', () => {
    it('should accept a simple valid header', () => {
      const { exit } = validate('feat: add user authentication', CONFIG);
      expect(exit).toBe(0);
    });

    it('should accept a header with a valid scope', () => {
      const { exit } = validate(`fix(valid-scope): resolve memory leak`, CONFIG);
      expect(exit).toBe(0);
    });

    it('should accept a breaking change with scope', () => {
      const { exit } = validate(`refactor(valid-scope)!: rewrite button API`, CONFIG);
      expect(exit).toBe(0);
    });

    it('should accept a breaking change without scope', () => {
      const { exit } = validate('feat!: remove deprecated endpoints', CONFIG);
      expect(exit).toBe(0);
    });

    it('should accept a valid header and body', () => {
      const { exit } = validate('chore: update dependencies\n\nBump package to v1.2.3', CONFIG);
      expect(exit).toBe(0);
    });

    it('should accept a multi-line body', () => {
      const { exit } = validate('docs: update readme\n\nLine 1\nLine 2', CONFIG);
      expect(exit).toBe(0);
    });
  });

  describe('Header Validation', () => {
    it('should fail on empty input', () => {
      const { exit, error } = validate('', CONFIG);
      expect(exit).toBe(1);
      expect(error).toContain('commit message is empty');
    });

    it('should fail if header exceeds 72 characters', () => {
      const { exit, error } = validate(`feat: ${'a'.repeat(67)}`, CONFIG);
      expect(exit).toBe(1);
      expect(error).toContain('header exceeds 72 characters');
    });

    it('should fail on invalid format (missing colon)', () => {
      const { exit, error } = validate('this is a random commit message', CONFIG);
      expect(exit).toBe(1);
      expect(error).toContain('header must match');
    });

    it('should fail on unsupported type', () => {
      const { exit, error } = validate('update(web): change logic', CONFIG);
      expect(exit).toBe(1);
      expect(error).toContain("type 'update' is not allowed");
    });

    it('should fail on unsupported scope', () => {
      const { exit, error } = validate('feat(nonexistent-scope): add endpoint', CONFIG);
      expect(exit).toBe(1);
      expect(error).toContain("scope 'nonexistent-scope' is not allowed");
    });

    it('should fail on uppercase type', () => {
      const { exit, error } = validate('Feat: add login', CONFIG);
      expect(exit).toBe(1);
      expect(error).toContain("type 'Feat' is not allowed");
    });
  });

  describe('Description Rules', () => {
    it('should fail if description ends with a period', () => {
      const { exit, error } = validate('fix: resolve bug.', CONFIG);
      expect(exit).toBe(1);
      expect(error).toContain('description must not end with a period');
    });

    it('should fail if description starts with upper case character', () => {
      const { exit, error } = validate('feat: Add new feature', CONFIG);
      expect(exit).toBe(1);
      expect(error).toContain('description must start with a lower case character');
    });

    it('should succeed if description starts with a number', () => {
      const { exit } = validate('feat: 123 fix issue', CONFIG);
      expect(exit).toBe(0);
    });
  });

  describe('Body and Spacing', () => {
    it('should fail if blank line is missing between header and body', () => {
      const { exit, error } = validate('feat: add login\nImmediately starting body', CONFIG);
      expect(exit).toBe(1);
      expect(error).toContain('blank line required');
    });

    it('should fail if body line exceeds 79 characters', () => {
      const { exit, error } = validate(`feat: add login\n\n${'a'.repeat(80)}`, CONFIG);
      expect(exit).toBe(1);
      expect(error).toContain('body line 3 exceeds 79 characters');
    });

    it('should report correct line number for body errors', () => {
      const { exit, error } = validate(`feat: add login\n\nShort line\n${'a'.repeat(80)}`, CONFIG);
      expect(exit).toBe(1);
      expect(error).toContain('body line 4 exceeds 79 characters');
    });
  });

  describe('Edge Cases', () => {
    it('should handle unicode/emojis in description', () => {
      const { exit } = validate(`feat: add 🚀 emoji support`, CONFIG);
      expect(exit).toBe(0);
    });

    it('should ignore trailing whitespace in header for length checks', () => {
      const { exit } = validate(`feat: add login${' '.repeat(70)}`, CONFIG);
      expect(exit).toBe(0);
    });

    it('should accept a commit with only a header', () => {
      const { exit } = validate('feat: add login', CONFIG);
      expect(exit).toBe(0);
    });

    it('should allow empty lines within the body', () => {
      const { exit } = validate('feat: add login\n\nLine 1\n\nLine 3', CONFIG);
      expect(exit).toBe(0);
    });
  });
});
