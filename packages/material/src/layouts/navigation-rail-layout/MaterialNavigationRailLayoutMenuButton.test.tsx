import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import { MaterialNavigationRailMenuContext } from './MaterialNavigationRailLayout';
import { MaterialNavigationRailLayoutMenuButton } from './MaterialNavigationRailLayoutMenuButton';

describe('MaterialNavigationRailLayoutMenuButton', () => {
  describe('Visual', () => {
    it('renders a button when rail is modal and hidden when collapsed', async () => {
      const { baseElement } = render(
        () => (
          <MaterialNavigationRailMenuContext.Provider value={[() => true, () => false, vi.fn()]}>
            <MaterialNavigationRailLayoutMenuButton ariaLabel="Menu button" />
          </MaterialNavigationRailMenuContext.Provider>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('switch', { name: 'Menu button' });
      await expect.element(button).toBeVisible();
    });

    it('renders nothing when rail is not modal or hidden when collapsed', async () => {
      const { baseElement } = render(
        () => (
          <MaterialNavigationRailMenuContext.Provider value={[() => false, () => false, vi.fn()]}>
            <MaterialNavigationRailLayoutMenuButton ariaLabel="Menu button" />
          </MaterialNavigationRailMenuContext.Provider>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('switch', { name: 'Menu button' });
      await expect.element(button).not.toBeInTheDocument();
    });
  });
});
