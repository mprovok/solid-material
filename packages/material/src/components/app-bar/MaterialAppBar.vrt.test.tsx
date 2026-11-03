import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';

import type { MaterialAppBarProps, MaterialAppBarVariant } from './MaterialAppBar';

import { MaterialAppBar } from './MaterialAppBar';
import { MaterialAppBarBackButton } from './MaterialAppBarBackButton';

import CalendarTodayFillIcon from '@solidmaterial/icons/400/outlined/calendar_today-fill.svg';
import MapFillIcon from '@solidmaterial/icons/400/outlined/map-fill.svg';
import SearchIcon from '@solidmaterial/icons/400/outlined/search.svg';

// Written by Gemma 4 26B A4B, modified to fix lint warnings

const renderComponent = async (props: MaterialAppBarProps) => {
  const { baseElement } = render(() => <MaterialAppBar {...props} />, { wrapper: MaterialTheme });
  await document.fonts.ready;
  return page.elementLocator(baseElement);
};

describe('MaterialAppBar', () => {
  describe('Visual', () => {
    describe.each(['small', 'medium', 'large'] satisfies MaterialAppBarVariant[])('variant = $0', variant => {
      // Title
      it(`renders variant ${variant}`, async () => {
        const screen = await renderComponent({ variant, title: 'Title' });

        const appBar = screen.getByElement('sm-app-bar');
        await expect.element(appBar).toBeVisible();

        await expect.element(screen).toMatchScreenshot();
      });

      // Subtitle
      it('renders with subtitle', async () => {
        const screen = await renderComponent({ variant, title: 'Title', subtitle: 'Subtitle' });

        const appBar = screen.getByElement('sm-app-bar');
        await expect.element(appBar).toBeVisible();

        await expect.element(screen).toMatchScreenshot();
      });

      // Center
      it('renders with text in center', async () => {
        const screen = await renderComponent({ variant, title: 'Title', subtitle: 'Subtitle', center: true });

        const appBar = screen.getByElement('sm-app-bar');
        await expect.element(appBar).toBeVisible();

        await expect.element(screen).toMatchScreenshot();
      });

      // Leading button
      it('renders with leading button', async () => {
        const { baseElement } = render(
          () => (
            <MaterialAppBar
              variant={variant}
              title="Title"
              leadingButton={<MaterialAppBarBackButton ariaLabel="Leading button" />}
            />
          ),
          { wrapper: MaterialTheme }
        );
        await document.fonts.ready;
        const screen = page.elementLocator(baseElement);

        const appBar = screen.getByElement('sm-app-bar');
        await expect.element(appBar).toBeVisible();

        await expect.element(screen).toMatchScreenshot();
      });

      // Trailing buttons
      it('renders with trailing buttons', async () => {
        const { baseElement } = render(
          () => (
            <MaterialAppBar
              variant={variant}
              title="Title"
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
        await document.fonts.ready;
        const screen = page.elementLocator(baseElement);

        const appBar = screen.getByElement('sm-app-bar');
        await expect.element(appBar).toBeVisible();

        await expect.element(screen).toMatchScreenshot();
      });

      // Leading and trailing buttons
      it('renders with leading and trailing buttons', async () => {
        const { baseElement } = render(
          () => (
            <MaterialAppBar
              variant={variant}
              title="Title"
              subtitle="Subtitle"
              leadingButton={<MaterialAppBarBackButton ariaLabel="Leading button" />}
              trailingButtons={<MaterialIconButton variant="text" ariaLabel="Trailing button" icon={<MapFillIcon />} />}
            />
          ),
          { wrapper: MaterialTheme }
        );
        await document.fonts.ready;
        const screen = page.elementLocator(baseElement);

        const appBar = screen.getByElement('sm-app-bar');
        await expect.element(appBar).toBeVisible();

        await expect.element(screen).toMatchScreenshot();
      });
    });
  });
});
