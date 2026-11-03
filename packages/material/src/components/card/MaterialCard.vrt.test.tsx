import type { FlowComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { H3 } from '../typography/Typography';

import type { MaterialCardProps, MaterialCardSize, MaterialCardVariant } from './MaterialCard';

import { MaterialCard, MaterialCardBody } from './MaterialCard';

// Written by GLM 5.3 Flash

const emptyFn = () => {
  // Empty
};

// Padded white background so the md-elevation shadow of the elevated variant
// is not clipped in screenshots
const Wrapper: FlowComponent = props => (
  <MaterialTheme theme="tonal-spot">
    <div style={{ 'background-color': 'white', padding: '2rem' }}>{props.children}</div>
  </MaterialTheme>
);

const getCardBody = () => (
  <MaterialCardBody>
    <H3 role="headline" size="small">
      Label
    </H3>
    <span>Lorem ipsum dolor sit amet.</span>
  </MaterialCardBody>
);

const renderComponent = async (props: MaterialCardProps) => {
  const { baseElement } = render(() => <MaterialCard {...props}>{getCardBody()}</MaterialCard>, { wrapper: Wrapper });
  await document.fonts.ready;
  // Move the pointer to the middle of the page so that hover state from a
  // previous test or the browser's initial pointer position does not leak
  // into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 400, y: 300 } });
  return page.elementLocator(baseElement);
};

const VARIANTS: MaterialCardVariant[] = ['elevated', 'filled', 'outlined'];

describe('MaterialCard', () => {
  describe('Visual', () => {
    // Variants
    it.each(VARIANTS)('renders a card with variant $0', async variant => {
      const screen = await renderComponent({ variant });

      const card = screen.getByElement('sm-card');
      await expect.element(card).toBeVisible();

      await expect.element(card).toMatchScreenshot();
    });

    // Sizes — the default size is included as undefined
    it.each(['small', 'medium', 'large', 'extra-large', undefined] satisfies (MaterialCardSize | undefined)[])(
      'renders a card with size $0',
      async size => {
        const screen = await renderComponent({ variant: 'outlined', size });

        const card = screen.getByElement('sm-card');
        await expect.element(card).toBeVisible();

        await expect.element(card).toMatchScreenshot();
      }
    );

    // Disabled variants
    it.each(VARIANTS)('renders a disabled card with variant $0', async variant => {
      const screen = await renderComponent({ variant, disabled: true });

      // Given the card is visible
      const card = screen.getByElement('sm-card');
      await expect.element(card).toBeVisible();

      // and disabled
      await expect.element(card).toHaveAttribute('data-disabled');

      await expect.element(card).toMatchScreenshot();
    });

    it('renders a clickable card', async () => {
      const screen = await renderComponent({ variant: 'elevated', ariaLabel: 'Card', onClick: emptyFn });

      // Given the card is visible and accessible by its label
      const card = screen.getByLabelText('Card');
      await expect.element(card).toBeVisible();

      // and it is clickable, so it has a tabindex
      await expect.element(card).toHaveAttribute('tabindex', '0');

      await expect.element(card).toMatchScreenshot();
    });

    it('renders a clickable card which is disabled', async () => {
      const screen = await renderComponent({
        variant: 'elevated',
        ariaLabel: 'Card',
        disabled: true,
        onClick: emptyFn
      });

      // Given the card is visible and accessible by its label
      const card = screen.getByLabelText('Card');
      await expect.element(card).toBeVisible();

      // and it is disabled, so it is not clickable and has no tabindex
      await expect.element(card).not.toHaveAttribute('tabindex');

      await expect.element(card).toMatchScreenshot();
    });
  });
});
