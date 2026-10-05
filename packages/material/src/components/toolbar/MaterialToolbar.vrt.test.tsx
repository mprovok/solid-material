import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';

import type { MaterialToolbarProps } from './MaterialToolbar';

import { MaterialToolbar } from './MaterialToolbar';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';
import FormatBoldFillIcon from '@solidmaterial/icons/400/outlined/format_bold-fill.svg';
import FormatColorFillIcon from '@solidmaterial/icons/400/outlined/format_color_fill.svg';
import FormatColorTextIcon from '@solidmaterial/icons/400/outlined/format_color_text.svg';
import FormatItalicFillIcon from '@solidmaterial/icons/400/outlined/format_italic-fill.svg';
import FormatUnderlinedIcon from '@solidmaterial/icons/400/outlined/format_underlined.svg';

// Written by Gemma 4 26B A4B, modified to fix lint warnings

const renderComponent = async (props: MaterialToolbarProps) => {
  const { baseElement } = render(
    () => (
      <MaterialToolbar {...props}>
        <MaterialIconButton variant="filled" icon={<FormatBoldFillIcon />} toggle={true} />
        <MaterialIconButton variant="tonal" icon={<FormatItalicFillIcon />} toggle={true} />
        <MaterialIconButton variant="text" icon={<FormatUnderlinedIcon />} toggle={false} />
        <MaterialIconButton variant="tonal" icon={<FormatColorTextIcon />} toggle={false} />
        <MaterialIconButton variant="filled" icon={<FormatColorFillIcon />} toggle={false} />
      </MaterialToolbar>
    ),
    { wrapper: MaterialTheme }
  );
  await document.fonts.ready;
  return page.elementLocator(baseElement);
};

describe('MaterialToolbar', () => {
  describe('Visual', () => {
    it('renders a floating horizontal toolbar', async () => {
      const screen = await renderComponent({
        direction: 'horizontal',
        mode: 'floating'
      });

      const toolbar = screen.getByRole('toolbar');
      await expect.element(toolbar).toBeVisible();

      await expect.element(screen).toMatchScreenshot();
    });

    it('renders a floating vertical toolbar', async () => {
      const screen = await renderComponent({
        direction: 'vertical',
        mode: 'floating'
      });

      const toolbar = screen.getByRole('toolbar');
      await expect.element(toolbar).toBeVisible();

      await expect.element(screen).toMatchScreenshot();
    });

    it('renders a docked toolbar', async () => {
      const screen = await renderComponent({
        direction: 'horizontal',
        mode: 'docked'
      });

      const toolbar = screen.getByRole('toolbar');
      await expect.element(toolbar).toBeVisible();

      await expect.element(screen).toMatchScreenshot();
    });

    it('renders with vibrant colors', async () => {
      const screen = await renderComponent({
        direction: 'horizontal',
        mode: 'floating',
        color: 'vibrant'
      });

      const toolbar = screen.getByRole('toolbar');
      await expect.element(toolbar).toBeVisible();

      await expect.element(toolbar).toMatchScreenshot();
    });

    it('renders with a FAB', async () => {
      const screen = await renderComponent({
        direction: 'horizontal',
        mode: 'floating',
        fab: {
          color: 'tertiary',
          icon: <EditIcon />,
          ariaLabel: 'FAB in toolbar'
        }
      });

      const toolbar = screen.getByRole('toolbar');
      await expect.element(toolbar).toBeVisible();

      const fab = screen.getByRole('button', { name: 'FAB in toolbar' });
      await expect.element(fab).toBeVisible();

      await expect.element(screen).toMatchScreenshot();
    });
  });
});
