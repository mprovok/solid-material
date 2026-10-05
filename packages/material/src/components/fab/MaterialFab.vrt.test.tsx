import type { ParentProps } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialFabColor, MaterialFabProps, MaterialFabSize } from './MaterialFab';

import { MaterialFab } from './MaterialFab';

import EditFillIcon from '@solidmaterial/icons/400/outlined/edit-fill.svg';

// Written by Gemma 4 26B A4B, modified to fix lint warnings

const renderComponent = async (props: ParentProps<MaterialFabProps>) => {
  const { baseElement } = render(() => <MaterialFab {...props} icon={<EditFillIcon />} />, { wrapper: MaterialTheme });
  await document.fonts.ready;
  return page.elementLocator(baseElement);
};

describe('MaterialFab', () => {
  describe('Visual', () => {
    it('renders with a default color and size', async () => {
      const screen = await renderComponent({});

      const fab = screen.getByRole('button');
      await expect.element(fab).toBeVisible();

      await expect.element(fab).toMatchScreenshot();
    });

    it.each([
      'primary',
      'secondary',
      'tertiary',
      'primary-container',
      'secondary-container',
      'tertiary-container'
    ] satisfies MaterialFabColor[])('renders with color $0', async color => {
      const screen = await renderComponent({ color });

      const fab = screen.getByRole('button');
      await expect.element(fab).toBeVisible();

      await expect.element(fab).toMatchScreenshot();
    });

    it.each(['small', 'medium', 'large'] satisfies MaterialFabSize[])('renders with size $0', async size => {
      const screen = await renderComponent({ color: 'primary', size });

      const fab = screen.getByRole('button');
      await expect.element(fab).toBeVisible();

      await expect.element(fab).toMatchScreenshot();
    });

    it('renders with label (extended)', async () => {
      const screen = await renderComponent({ color: 'primary', size: 'large', children: 'Label' });

      const fab = screen.getByRole('button');
      await expect.element(fab).toBeVisible();
      await expect.element(fab).toHaveTextContent('Label');

      await expect.element(fab).toMatchScreenshot();
    });

    it('renders with tooltip title', async () => {
      const screen = await renderComponent({ color: 'primary', title: 'Tooltip' });

      const fab = screen.getByRole('button');
      await expect.element(fab).toBeVisible();

      await userEvent.hover(fab);

      const tooltip = screen.getByRole('tooltip');
      await expect.element(tooltip).toBeVisible();

      await expect.element(screen).toMatchScreenshot();
    });
  });
});
