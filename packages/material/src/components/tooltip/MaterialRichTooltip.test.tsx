import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialButton } from '../button/MaterialButton';

import { MaterialRichTooltip } from './MaterialRichTooltip';

describe('MaterialRichTooltip', () => {
  describe('Visual', () => {
    it('shows a rich tooltip', async () => {
      const { baseElement } = render(() => <MaterialRichTooltip>Rich tooltip</MaterialRichTooltip>, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);

      const tooltip = screen.getByRole('tooltip');

      await expect.element(tooltip).toBeVisible();
    });

    it('shows a rich tooltip with title and actions', async () => {
      const { baseElement } = render(
        () => (
          <MaterialRichTooltip title="Title" actions={<MaterialButton variant="tonal">Button</MaterialButton>}>
            Rich tooltip
          </MaterialRichTooltip>
        ),
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      const title = screen.getByRole('heading', { name: 'Title' });
      const button = screen.getByRole('button', { name: 'Button' });

      await expect.element(title).toBeVisible();
      await expect.element(button).toBeVisible();
    });
  });
});
