import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import { MaterialCarousel } from './MaterialCarousel';
import { MaterialCarouselItem } from './MaterialCarouselItem';

// Written by GLM 5.3 Flash

// Deterministic, network-free stand-in for the remote image used in the stories
const CarouselItemGraphic = () => (
  <svg viewBox="0 0 100 100">
    <rect width="100" height="100" fill="#b7c4ff" />
    <circle cx="32" cy="34" r="18" fill="#ffd8e4" />
    <rect x="52" y="52" width="34" height="34" rx="8" fill="#7d5260" />
  </svg>
);

interface RenderItemOptions {
  disabled?: boolean;
}

const renderComponent = async ({ disabled }: RenderItemOptions = {}) => {
  const onClick = vi.fn();

  const { baseElement } = render(
    () => (
      // The item's styles size it relative to its carousel container: wrap the
      // item in a minimal carousel so it renders with its intended size
      <MaterialCarousel variant="multi-browse" ariaLabel="Carousel">
        <MaterialCarouselItem ariaLabel="Item" disabled={disabled} onClick={onClick}>
          <CarouselItemGraphic />
        </MaterialCarouselItem>
      </MaterialCarousel>
    ),
    { wrapper: MaterialTheme }
  );

  await document.fonts.ready;

  return { screen: page.elementLocator(baseElement), onClick };
};

describe('MaterialCarouselItem', () => {
  describe('Interaction', () => {
    it('calls onClick when clicked', async () => {
      const { screen, onClick } = await renderComponent();

      // Given the item is visible and its click handler has not fired yet
      const item = screen.getByRole('listitem', { name: 'Item' });
      await expect.element(item).toBeVisible();
      expect(onClick).not.toHaveBeenCalled();

      // When the item is clicked
      await userEvent.click(item);

      // Then onClick is called once
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('prevents the context menu', async () => {
      const { screen } = await renderComponent();

      // Given the item is visible
      const item = screen.getByRole('listitem', { name: 'Item' });
      await expect.element(item).toBeVisible();

      // When a context menu event is dispatched on the item
      const canceled = !item.element().dispatchEvent(new Event('contextmenu', { cancelable: true, bubbles: true }));

      // Then the event's default action is prevented
      expect(canceled).toBe(true);
    });

    it('prevents drag of item content', async () => {
      const { screen } = await renderComponent();

      // Given the item and its graphic are visible
      const item = screen.getByRole('listitem', { name: 'Item' });
      await expect.element(item).toBeVisible();

      const graphic = item.getByElement('svg');
      await expect.element(graphic).toBeVisible();

      // When a dragstart event is dispatched on the graphic
      const canceled = !graphic.element().dispatchEvent(new Event('dragstart', { cancelable: true, bubbles: true }));

      // Then the event's default action (dragging the item content) is prevented
      expect(canceled).toBe(true);
    });
  });

  describe('A11y', () => {
    it('exposes listitem role, aria-label and tabindex', async () => {
      const { screen } = await renderComponent();

      // Given the enabled item is visible
      const item = screen.getByRole('listitem', { name: 'Item' });
      await expect.element(item).toBeVisible();

      // Then it is part of the tab order and is not marked as disabled
      await expect.element(item).toHaveAttribute('tabindex', '0');
      await expect.element(item).not.toHaveAttribute('data-disabled');
    });

    it('exposes a disabled item with tabindex -1', async () => {
      const { screen } = await renderComponent({ disabled: true });

      // Given the disabled item is visible
      const item = screen.getByRole('listitem', { name: 'Item' });
      await expect.element(item).toBeVisible();

      // Then it is removed from the tab order and marked as disabled
      await expect.element(item).toHaveAttribute('tabindex', '-1');
      await expect.element(item).toHaveAttribute('data-disabled');
    });
  });
});
