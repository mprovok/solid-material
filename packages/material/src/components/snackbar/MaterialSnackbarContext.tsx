import type { Context } from 'solid-js';
import type { SetStoreFunction } from 'solid-js/store';

import { createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

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

export const MaterialSnackbarContext: Context<[get: MaterialSnack[], set: SetStoreFunction<MaterialSnack[]>]> =
  createContext(createStore<MaterialSnack[]>([]));

export const showSnack = (snack: MaterialSnack): void => {
  const [state, setState] = useContext(MaterialSnackbarContext);
  setState(state.length, snack);
};
