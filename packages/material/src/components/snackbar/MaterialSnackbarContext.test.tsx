import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { For, useContext } from 'solid-js';
import { afterEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialButton } from '../button/MaterialButton';

import { MaterialSnackbarContext, showSnack } from './MaterialSnackbarContext';

// Written by GLM 5.3 Flash

// This file targets the module-level default store: no Provider is used

const SnackTrigger: VoidComponent<{ label: string; text: string }> = props => (
  <MaterialButton
    variant="tonal"
    onClick={() => showSnack({ text: props.text, dismissable: false, duration: 'indefinite' })}
  >
    {props.label}
  </MaterialButton>
);

const SnackList: VoidComponent = () => {
  const [snacks] = useContext(MaterialSnackbarContext);

  return (
    <div>
      <For each={snacks}>{snack => <p>{snack.text}</p>}</For>
    </div>
  );
};

afterEach(() => {
  // Clear the module-level default store so state does not leak between tests:
  // the context's default value holds the module-level [get, set] tuple
  const [, setState] = MaterialSnackbarContext.defaultValue;
  setState(() => []);
});

describe('MaterialSnackbarContext', () => {
  describe('showSnack', () => {
    it('appends a snack to the default store when called', async () => {
      const { baseElement } = render(
        () => (
          <>
            <SnackTrigger label="Show first" text="First snack" />
            <SnackList />
          </>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given no snack is in the store
      await expect.element(screen.getByRole('button', { name: 'Show first' })).toBeVisible();
      await expect.element(screen.getByText('First snack')).not.toBeInTheDocument();

      // When the button calls showSnack
      await userEvent.click(screen.getByRole('button', { name: 'Show first' }));

      // Then the consumer renders the snack's text
      await expect.element(screen.getByText('First snack')).toBeVisible();
    });

    it('appends multiple snacks sequentially', async () => {
      const { baseElement } = render(
        () => (
          <>
            <SnackTrigger label="Show first" text="First snack" />
            <SnackTrigger label="Show second" text="Second snack" />
            <SnackList />
          </>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given no snack is in the store
      await expect.element(screen.getByText('First snack')).not.toBeInTheDocument();

      // When the two buttons call showSnack one after the other
      await userEvent.click(screen.getByRole('button', { name: 'Show first' }));
      await userEvent.click(screen.getByRole('button', { name: 'Show second' }));

      // Then both snacks are listed in the order they were added
      const first = screen.getByText('First snack');
      const second = screen.getByText('Second snack');
      await expect.element(first).toBeVisible();
      await expect.element(second).toBeVisible();

      // The second snack follows the first one in the document
      expect(second.element().previousElementSibling).toBe(first.element());
    });
  });
});
