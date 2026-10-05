import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialButton } from './MaterialButton';

import PlayArrowIcon from '@solidmaterial/icons/400/outlined/play_arrow.svg';

describe('MaterialButton', () => {
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
