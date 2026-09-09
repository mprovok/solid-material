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
      const screen = page.elementLocator(baseElement);

      const tooltip = screen.getByRole('tooltip');

      await expect.element(tooltip).toBeVisible();
    });
  });
});
