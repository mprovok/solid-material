import type { Accessor, MemoOptions } from 'solid-js';

import { createScheduled, debounce } from '@solid-primitives/scheduled';
import { createMemo } from 'solid-js';

export const createDebouncedMemo = <T>(
  fn: (prev: T | undefined) => T,
  timeoutMs: number,
  value?: T,
  options?: MemoOptions<T | undefined>
): Accessor<T> => {
  const scheduled = createScheduled(f => debounce(f, timeoutMs));
  return createMemo((prev: T | undefined) => (scheduled() || prev === undefined ? fn(value) : prev), value, options);
};
