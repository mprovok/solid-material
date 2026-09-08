import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialButton } from './MaterialButton';

import PlayArrowIcon from '@solidmaterial/icons/400/outlined/play_arrow.svg';

describe('MaterialButton', () => {
  describe('Visual', () => {
    it.each([false, true])('functions as a switch when toggle = $0', async toggled => {
      const { baseElement } = render(() => (
        <MaterialButton toggle={toggled} variant="tonal" size="medium" icon={<PlayArrowIcon />}>
          Label
        </MaterialButton>
      ));
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('switch');
      await expect.element(button).toBeVisible();
    });

    it('functions as a link when href is defined', async () => {
      const { baseElement } = render(() => (
        <MaterialButton href="/" variant="tonal" size="medium" icon={<PlayArrowIcon />}>
          Label
        </MaterialButton>
      ));
      const screen = page.elementLocator(baseElement);

      // Given when rendered as a visible link
      const button = screen.getByRole('link');
      await expect.element(button).toBeVisible();

      // Then href is equal to the given URL
      await expect.element(button).toHaveAttribute('href', '/');
    });

    it.each([false, undefined])('is enabled when disabled = $0', async disabled => {
      const { baseElement } = render(() => (
        <MaterialButton disabled={disabled} variant="tonal" size="medium" icon={<PlayArrowIcon />}>
          Label
        </MaterialButton>
      ));
      const screen = page.elementLocator(baseElement);

      // Given the button is visible
      const button = screen.getByRole('button');
      await expect.element(button).toBeVisible();

      // Then the button is enabled
      await expect.element(button).toBeEnabled();
    });

    it('can be disabled', async () => {
      const { baseElement } = render(() => (
        <MaterialButton disabled={true} variant="tonal" size="medium" icon={<PlayArrowIcon />}>
          Label
        </MaterialButton>
      ));
      const screen = page.elementLocator(baseElement);

      // Given the button is visible
      const button = screen.getByRole('button');
      await expect.element(button).toBeVisible();

      // Then the button is disabled
      await expect.element(button).toBeDisabled();
    });
  });

  describe('Interaction', () => {
    it('can be clicked', async () => {
      const onClick = vi.fn();

      const { baseElement } = render(() => (
        <MaterialButton variant="tonal" size="medium" icon={<PlayArrowIcon />} onClick={onClick}>
          Label
        </MaterialButton>
      ));
      const screen = page.elementLocator(baseElement);

      // Given the button is visible
      const button = screen.getByRole('button');
      await expect.element(button).toBeVisible();

      // and its onClick callback has not been called
      expect(onClick).not.toHaveBeenCalled();

      // When clicked
      await userEvent.click(button);

      // Then the onClick callback is called once
      expect(onClick).toHaveBeenCalledOnce();
    });
  });
});
