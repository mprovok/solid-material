import type { Accessor, MemoOptions } from 'solid-js';

import { createScheduled, debounce } from '@solid-primitives/scheduled';
import { createMemo } from 'solid-js';

export const createDebouncedMemo = <T>(
  fn: (prev: T | undefined) => T,
  timeoutMs: number,
  value?: T,
  options?: MemoOptions<T>
): Accessor<T> => {
  const scheduled = createScheduled(f => debounce(f, timeoutMs));
  return createMemo<T>(
    (prev: T | undefined = value): T => (scheduled() || prev === undefined ? fn(value) : prev),
    options
  );
};
