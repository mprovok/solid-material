import { describe, expect, it } from 'vitest';

import { getBadgeValue } from './badge';

describe('getBadgeValue', () => {
  it('formats undefined as empty string', () => {
    // oxlint-disable-next-line unicorn/no-useless-undefined
    expect(getBadgeValue(undefined)).toBe('');
  });

  it.each([
    ['', ''],
    ['a', 'a'],
    ['xyzw', 'xyzw'],
    ['solid', 'sol\u2026'],
    ['9999', '9999']
  ])('formats string "$0"', (value, expected) => {
    expect(getBadgeValue(value)).toBe(expected);
  });

  it.each([
    [0, '0'],
    [1, '1'],
    [10, '10'],
    [999, '999'],
    [1000, '999+'],
    [Number.MAX_SAFE_INTEGER, '999+']
  ])('formats number $0', (value, expected) => {
    expect(getBadgeValue(value)).toBe(expected);
  });

  it.each([999.5, -1, -100, Number.NaN, Infinity, -Infinity])('throws if number is $0 (not integer >= 0)', value => {
    expect(() => getBadgeValue(value)).toThrow();
  });
});
