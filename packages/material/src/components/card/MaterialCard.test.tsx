import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import { MaterialCard } from './MaterialCard';

describe('MaterialCard', () => {
  describe('Interaction', () => {
    it('can be clicked when interactive', async () => {
      const onClick = vi.fn();
      const { baseElement } = render(
        () => (
          <MaterialCard variant="filled" ariaLabel="Card" onClick={onClick}>
            Body
          </MaterialCard>
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      // Given the card is visible
      const card = screen.getByLabelText('Card');
      await expect.element(card).toBeVisible();

      expect(onClick).not.toHaveBeenCalled();

      // When clicked
      await userEvent.click(card);

      // Then the onClick callback is called
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('cannot be clicked when interactive but disabled', async () => {
      const onClick = vi.fn();
      const { baseElement } = render(
        () => (
          <MaterialCard variant="filled" ariaLabel="Card" disabled={true} onClick={onClick}>
            Body
          </MaterialCard>
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      // Given the card is visible
      const card = screen.getByLabelText('Card');
      await expect.element(card).toBeVisible();

      expect(onClick).not.toHaveBeenCalled();

      // When clicked
      await userEvent.click(card);

      // Then the onClick callback is called
      expect(onClick).not.toHaveBeenCalled();
    });

    it('can be actived by keyboard when interactive', async () => {
      const onClick = vi.fn();
      const { baseElement } = render(
        () => (
          <MaterialCard variant="filled" ariaLabel="Card" onClick={onClick}>
            Body
          </MaterialCard>
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      // Given the card is visible
      const card = screen.getByLabelText('Card');
      await expect.element(card).toBeVisible();

      expect(onClick).not.toHaveBeenCalled();

      // and the card has focus
      card.element().focus();
      await expect.element(card).toHaveFocus();

      // When pressed Enter
      await userEvent.keyboard('{Enter}');

      // Then the onClick callback is called
      expect(onClick).toHaveBeenCalledTimes(1);

      // When pressed Space
      await userEvent.keyboard('{Space}');

      // Then the onClick callback is called
      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });
});
