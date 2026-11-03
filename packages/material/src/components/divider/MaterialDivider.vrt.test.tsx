import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import { MaterialDivider } from './MaterialDivider';

// Written by GLM 5.3 Flash

// The divider is full-width, so it is rendered between two short text blocks
// inside the wrapper element which is the screenshot target
const DividerFixture: VoidComponent<{ width?: string }> = props => (
  <main style={{ padding: '1rem', width: props.width }}>
    <div style={{ display: 'flex', 'flex-direction': 'column', gap: '0.5rem' }}>
      <span>Content above the divider</span>
      <MaterialDivider />
      <span>Content below the divider</span>
    </div>
  </main>
);

const renderComponent = async (props: { width?: string } = {}) => {
  const { baseElement } = render(() => <DividerFixture {...props} />, { wrapper: MaterialTheme });
  await document.fonts.ready;
  // Move the pointer to the middle of the page so that hover state from a
  // previous test or the browser's initial pointer position does not leak
  // into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 400, y: 300 } });
  return page.elementLocator(baseElement);
};

describe('MaterialDivider', () => {
  describe('Visual', () => {
    it('renders a divider between content', async () => {
      const screen = await renderComponent();

      // Given the divider is visible between the two text blocks
      const divider = screen.getByElement('md-divider');
      await expect.element(divider).toBeVisible();

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });

    it('renders a divider in a narrow container', async () => {
      const screen = await renderComponent({ width: '320px' });

      // Given the divider is visible between the two text blocks
      const divider = screen.getByElement('md-divider');
      await expect.element(divider).toBeVisible();

      await expect.element(screen.getByElement('main')).toMatchScreenshot();
    });
  });
});
