import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';

import { MaterialAppBar } from './MaterialAppBar';
import { MaterialAppBarBackButton } from './MaterialAppBarBackButton';

import CalendarTodayFillIcon from '@solidmaterial/icons/400/outlined/calendar_today-fill.svg';
import SearchIcon from '@solidmaterial/icons/400/outlined/search.svg';

describe('MaterialAppBar', () => {
  describe('Accessibility', () => {
    it('has no axe violations with a title, subtitle, leading and trailing buttons', async () => {
      const { baseElement, container } = render(
        () => (
          <MaterialAppBar
            variant="small"
            title="Title"
            subtitle="Subtitle"
            leadingButton={<MaterialAppBarBackButton ariaLabel="Back" />}
            trailingButtons={
              <>
                <MaterialIconButton variant="text" ariaLabel="Trailing button 1" icon={<SearchIcon />} />
                <MaterialIconButton variant="text" ariaLabel="Trailing button 2" icon={<CalendarTodayFillIcon />} />
              </>
            }
          />
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given the title is a level-1 heading and the subtitle a level-2 heading
      const title = screen.getByRole('heading', { level: 1, name: 'Title' });
      await expect.element(title).toBeVisible();
      const subtitle = screen.getByRole('heading', { level: 2, name: 'Subtitle' });
      await expect.element(subtitle).toBeVisible();

      // and the leading button is exposed by its accessible name
      const leadingButton = screen.getByRole('button', { name: 'Back' });
      await expect.element(leadingButton).toBeVisible();

      // and both trailing buttons are exposed by their accessible names
      await expect.element(screen.getByRole('button', { name: 'Trailing button 1' })).toBeVisible();
      await expect.element(screen.getByRole('button', { name: 'Trailing button 2' })).toBeVisible();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
