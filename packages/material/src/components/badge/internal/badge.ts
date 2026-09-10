export const getBadgeValue = (value?: string | number): string => {
  if (value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value.length <= 4 ? value : `${value.slice(0, 3)}…`;
  }

  if (!Number.isInteger(value) || value < 0) {
    throw new Error('Value must be non-negative integer');
  }

  return value <= 999 ? value.toString() : '999+';
};
