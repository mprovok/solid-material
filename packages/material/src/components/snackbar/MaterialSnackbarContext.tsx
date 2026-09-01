import type { StoreSetter } from 'solid-js';

import { createStore } from 'solid-js';

export type MaterialSnackDuration = 'short' | 'long' | 'indefinite';

export type MaterialSnack = {
  text: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: MaterialSnackDuration;
  dismissable: boolean;
};

export const snackStore: [get: MaterialSnack[], set: StoreSetter<MaterialSnack[]>] = createStore<MaterialSnack[]>([]);

export const showSnack = (snack: MaterialSnack): void => {
  const [_state, setState] = snackStore;
  setState(draft => {
    draft.push(snack);
  });
};
