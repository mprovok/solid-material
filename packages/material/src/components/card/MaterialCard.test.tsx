import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialCardProps } from './MaterialCard';

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

  describe('Accessibility', () => {
    // The clickable-card pattern: tabindex="0" only when onClick is set and the card is not
    // disabled. The card exposes no interactive role; tabindex is its keyboard affordance.
    it.each([
      { name: 'clickable', onClick: vi.fn(), tabindex: '0' },
      { name: 'non-clickable' },
      { name: 'clickable but disabled', onClick: vi.fn(), disabled: true }
    ] satisfies (Pick<MaterialCardProps, 'onClick' | 'disabled'> & { name: string; tabindex?: string })[])(
      'renders a $name card with the documented tabindex and no axe violations',
      async state => {
        const { baseElement, container } = render(
          () => (
            <MaterialCard variant="filled" ariaLabel="Card" onClick={state.onClick} disabled={state.disabled}>
              <h3>Title</h3>
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

        // Then its tabindex matches the clickable-card pattern
        await (state.tabindex === undefined
          ? expect.element(card).not.toHaveAttribute('tabindex')
          : expect.element(card).toHaveAttribute('tabindex', state.tabindex));

        // and the rendered tree has no axe violations
        await expect(await axe(container)).toHaveNoViolations();
      }
    );

    it('maps ariaLabel to the aria-label attribute and has no axe violations', async () => {
      const { baseElement, container } = render(
        () => (
          <MaterialCard variant="filled" ariaLabel="Custom Card">
            <h3>Title</h3>
            Body
          </MaterialCard>
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      // Given the card is visible and its accessible name comes from ariaLabel
      const card = screen.getByLabelText('Custom Card');
      await expect.element(card).toBeVisible();
      await expect.element(card).toHaveAttribute('aria-label', 'Custom Card');

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
