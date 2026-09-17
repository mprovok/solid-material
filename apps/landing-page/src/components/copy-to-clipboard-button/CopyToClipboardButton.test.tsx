import { render } from '@solidjs/testing-library';
import { MaterialTheme } from '@solidmaterial/material/styling';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { CopyToClipBoardButton } from './CopyToClipboardButton';

describe('CopyToClipboardButton', () => {
  describe('Interaction', () => {
    it('is visible when hovering over parent', async () => {
      const { baseElement } = render(
        () => (
          <main style={{ width: '100px', height: '100px' }}>
            <CopyToClipBoardButton content="<code>" />
          </main>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given the button is not visible
      const button = screen.getByRole('button');
      await expect.element(button).not.toBeInTheDocument();

      // When hovering over parent
      const main = screen.getByRole('main');
      await userEvent.hover(main);

      // Then the button is visible
      await expect.element(button).toBeVisible();
    });

    it('calls the Clipboard API and shows a snackbar', async () => {
      // oxlint-disable-next-line unicorn/no-useless-undefined
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      const { baseElement } = render(
        () => (
          <main style={{ width: '100px', height: '100px' }}>
            <CopyToClipBoardButton content="<code>" />
          </main>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given the user is hovering over the parent
      const main = screen.getByRole('main');
      await userEvent.hover(main);

      // and the button is visible
      const button = screen.getByRole('button');
      await expect.element(button).toBeVisible();

      expect(writeText).not.toHaveBeenCalled();

      // When the button is clicked
      await userEvent.click(button);

      // Then the text is written to the clipboard
      expect(writeText).toHaveBeenCalledExactlyOnceWith('<code>');
    });
  });
});
