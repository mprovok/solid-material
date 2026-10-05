import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import { MaterialPlainTooltip } from './MaterialPlainTooltip';

describe('MaterialPlainTooltip', () => {
  describe('Visual', () => {
    it('shows a rich tooltip', async () => {
      const { baseElement } = render(() => <MaterialPlainTooltip>Plain tooltip</MaterialPlainTooltip>, {
        wrapper: MaterialTheme
      });
      await document.fonts.ready;
      const screen = page.elementLocator(baseElement);

      const tooltip = screen.getByRole('tooltip', { name: 'Plain tooltip' });

      await expect.element(tooltip).toBeVisible();

      await expect.element(tooltip).toMatchScreenshot();
    });
  });
});
