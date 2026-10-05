import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialBadgeProps } from './MaterialBadge';

import { MaterialBadge } from './MaterialBadge';

import SquareFillIcon from '@solidmaterial/icons/400/outlined/square-fill.svg';

const renderComponent = async (props: MaterialBadgeProps) => {
  const { baseElement } = render(
    () => (
      <MaterialBadge {...props}>
        <SquareFillIcon fill="grey" />
      </MaterialBadge>
    ),
    { wrapper: MaterialTheme }
  );
  await document.fonts.ready;
  return page.elementLocator(baseElement);
};

describe('MaterialBadge', () => {
  describe('Visual', () => {
    it('renders a large number', async () => {
      const screen = await renderComponent({ value: 1000 });
      const badge = screen.getByElement('sm-badge');

      await expect.element(badge).toBeVisible();

      await expect.element(badge).toHaveTextContent('999+');
      await expect.element(badge).toMatchScreenshot();
    });

    it('renders a long text', async () => {
      const screen = await renderComponent({ value: 'abcdef' });
      const badge = screen.getByElement('sm-badge');

      await expect.element(badge).toBeVisible();

      await expect.element(badge).toHaveTextContent('abc…');
      await expect.element(badge).toMatchScreenshot();
    });

    it('renders a small dot', async () => {
      const screen = await renderComponent({ value: '' });
      const badge = screen.getByElement('sm-badge');

      await expect.element(badge).toBeVisible();

      await expect.element(badge).toHaveTextContent('');
      await expect.element(badge).toMatchScreenshot();
    });

    it('renders no badge when value is undefined', async () => {
      const screen = await renderComponent({});
      const badge = screen.getByElement('sm-badge');

      await expect.element(badge).not.toBeInTheDocument();
    });
  });
});
