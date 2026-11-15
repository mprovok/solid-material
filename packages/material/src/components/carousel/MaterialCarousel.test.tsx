import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { For } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialButton } from '../button/MaterialButton';

import type { MaterialCarouselProps } from './MaterialCarousel';

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

// Enough items to overflow the 600px-wide fixture, so the carousel can scroll
const ITEM_COUNT = 10;

interface CarouselFixtureProps {
  carousel: Omit<MaterialCarouselProps, 'ariaLabel'>;
  itemClickSpies: ((event: PointerEvent) => void)[];
}

// The layout of the stories' Keyboard story: a focusable button above and
// below the carousel so the arrow up/down handoff can be asserted
const CarouselFixture: VoidComponent<CarouselFixtureProps> = props => (
  <main style={{ width: '600px', padding: '1rem' }}>
    <MaterialButton variant="tonal">Focusable (above)</MaterialButton>
    <MaterialCarousel {...props.carousel} ariaLabel="Carousel">
      <For each={props.itemClickSpies}>
        {(onClick, index) => (
          <MaterialCarouselItem ariaLabel={`Item ${index() + 1}`} onClick={onClick}>
            <CarouselItemGraphic />
          </MaterialCarouselItem>
        )}
      </For>
    </MaterialCarousel>
    <MaterialButton variant="tonal">Focusable (below)</MaterialButton>
  </main>
);

const renderCarousel = async (carousel?: Omit<MaterialCarouselProps, 'ariaLabel'>) => {
  const itemClickSpies = Array.from({ length: ITEM_COUNT }, () => vi.fn());

  const { baseElement } = render(
    () => <CarouselFixture carousel={carousel ?? { variant: 'multi-browse' }} itemClickSpies={itemClickSpies} />,
    { wrapper: MaterialTheme }
  );

  await document.fonts.ready;

  return { screen: page.elementLocator(baseElement), itemClickSpies };
};

describe('MaterialCarousel', () => {
  describe('Keyboard navigation', () => {
    it('moves focus above the carousel on ArrowUp', async () => {
      const { screen } = await renderCarousel();

      // Given the first item of the carousel has focus
      const items = screen.getByRole('listitem');
      items.nth(0).element().focus();
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing arrow up
      await userEvent.keyboard('{ArrowUp}');

      // Then the focusable button above the carousel has focus
      await expect.element(screen.getByRole('button', { name: 'Focusable (above)' })).toHaveFocus();
    });

    it('moves focus below the carousel on ArrowDown', async () => {
      const { screen } = await renderCarousel();

      // Given the last item of the carousel has focus
      const items = screen.getByRole('listitem');
      items.last().element().focus();
      await expect.element(items.last()).toHaveFocus();

      // When pressing arrow down
      await userEvent.keyboard('{ArrowDown}');

      // Then the focusable button below the carousel has focus
      await expect.element(screen.getByRole('button', { name: 'Focusable (below)' })).toHaveFocus();
    });

    it('moves focus between items with arrow keys and activates with Enter', async () => {
      const { screen, itemClickSpies } = await renderCarousel();

      // Given the first item of the carousel has focus
      const items = screen.getByRole('listitem');
      items.nth(0).element().focus();
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing End, then the last item has focus
      await userEvent.keyboard('{End}');
      await expect.element(items.last()).toHaveFocus();

      // When pressing Home, then the first item has focus
      await userEvent.keyboard('{Home}');
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing arrow right, then the second item has focus
      await userEvent.keyboard('{ArrowRight}');
      await expect.element(items.nth(1)).toHaveFocus();

      // When pressing arrow left, then the first item has focus again
      await userEvent.keyboard('{ArrowLeft}');
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing Enter on the focused item
      expect(itemClickSpies[0]).not.toHaveBeenCalled();
      await userEvent.keyboard('{Enter}');

      // Then the item's onClick spy is called once
      expect(itemClickSpies[0]).toHaveBeenCalledOnce();
    });

    it('moves focus through the carousel with Tab and Shift+Tab', async () => {
      const { screen } = await renderCarousel();

      // Given a fresh page where focus starts on the body
      const items = screen.getByRole('listitem');
      const buttonAbove = screen.getByRole('button', { name: 'Focusable (above)' });
      const buttonBelow = screen.getByRole('button', { name: 'Focusable (below)' });

      // When pressing tab, then the button above the carousel has focus
      await userEvent.tab();
      await expect.element(buttonAbove).toHaveFocus();

      // When pressing tab again, then the first item of the carousel has focus
      await userEvent.tab();
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing tab once more, then the second item has focus
      await userEvent.tab();
      await expect.element(items.nth(1)).toHaveFocus();

      // When pressing arrow down, then the button below the carousel has focus
      await userEvent.keyboard('{ArrowDown}');
      await expect.element(buttonBelow).toHaveFocus();

      // When shift-tabbing back into the carousel, then the last item has focus
      await userEvent.tab({ shift: true });
      await expect.element(items.last()).toHaveFocus();

      // When pressing home, then the first item has focus
      await userEvent.keyboard('{Home}');
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing arrow up, then the button above the carousel has focus again
      await userEvent.keyboard('{ArrowUp}');
      await expect.element(buttonAbove).toHaveFocus();
    });

    it('fires onClick when the item is clicked', async () => {
      const onClick = vi.fn();
      const { baseElement } = render(
        () => (
          <MaterialCarousel variant="multi-browse" ariaLabel="Carousel">
            <MaterialCarouselItem ariaLabel="Balloons near ground" onClick={onClick}>
              <CarouselItemGraphic />
            </MaterialCarouselItem>
          </MaterialCarousel>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);
      await document.fonts.ready;

      // Given a carousel with a single clickable item
      const item = screen.getByRole('listitem');
      await expect.element(item).toBeVisible();
      expect(onClick).not.toHaveBeenCalled();

      // When the item is clicked
      await userEvent.click(item);

      // Then the item's onClick spy is called once
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('keeps focus on the carousel when no item is enabled', async () => {
      const { baseElement } = render(
        () => (
          <main style={{ width: '600px', padding: '1rem' }}>
            <MaterialButton variant="tonal">Focusable (above)</MaterialButton>
            <MaterialCarousel variant="multi-browse" ariaLabel="Carousel">
              <For each={Array.from({ length: ITEM_COUNT })}>
                {(_item, index) => (
                  <MaterialCarouselItem ariaLabel={`Item ${index() + 1}`} disabled={true} onClick={vi.fn()}>
                    <CarouselItemGraphic />
                  </MaterialCarouselItem>
                )}
              </For>
            </MaterialCarousel>
            <MaterialButton variant="tonal">Focusable (below)</MaterialButton>
          </main>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);
      await document.fonts.ready;

      // Given a carousel where every item is disabled and the carousel itself
      // has focus
      const carousel = screen.getByElement('sm-carousel');
      carousel.element().focus();
      await expect.element(carousel).toHaveFocus();

      // When pressing arrow up or arrow down
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{ArrowDown}');

      // Then focus does not move to the focusable elements around the carousel
      await expect.element(carousel).toHaveFocus();
      await expect.element(screen.getByRole('button', { name: 'Focusable (above)' })).not.toHaveFocus();
      await expect.element(screen.getByRole('button', { name: 'Focusable (below)' })).not.toHaveFocus();
    });
  });

  describe('Drag', () => {
    it('scrolls the carousel when dragging with the mouse', async () => {
      const { screen } = await renderCarousel();

      // Given the carousel is visible and not scrolled
      const carousel = screen.getByElement('sm-carousel');
      await expect.element(carousel).toBeVisible();
      expect(carousel.element().scrollLeft).toBe(0);

      // When the pointer enters the carousel and is dragged to the left
      carousel
        .element()
        .dispatchEvent(new PointerEvent('pointerenter', { pointerId: 1, pointerType: 'mouse', bubbles: true }));
      carousel.element().dispatchEvent(
        new PointerEvent('pointerdown', {
          pointerId: 1,
          pointerType: 'mouse',
          clientX: 500,
          clientY: 200,
          bubbles: true,
          cancelable: true
        })
      );
      carousel.element().dispatchEvent(
        new PointerEvent('pointermove', {
          pointerId: 1,
          pointerType: 'mouse',
          clientX: 400,
          clientY: 200,
          bubbles: true,
          cancelable: true
        })
      );
      carousel.element().dispatchEvent(
        new PointerEvent('pointermove', {
          pointerId: 1,
          pointerType: 'mouse',
          clientX: 300,
          clientY: 200,
          bubbles: true,
          cancelable: true
        })
      );

      // Then the carousel scrolls and is marked as dragging
      await expect.poll(() => carousel.element().scrollLeft).toBeGreaterThan(0);
      await expect.element(carousel).toHaveAttribute('data-dragging');

      // When the pointer is released
      carousel.element().dispatchEvent(
        new PointerEvent('pointerup', {
          pointerId: 1,
          pointerType: 'mouse',
          clientX: 300,
          clientY: 200,
          bubbles: true
        })
      );

      // Then the dragging marker is removed
      await expect.element(carousel).not.toHaveAttribute('data-dragging');
    });

    it('ignores drag after pointer leaves', async () => {
      const { screen } = await renderCarousel();

      // Given the carousel is visible and not scrolled
      const carousel = screen.getByElement('sm-carousel');
      await expect.element(carousel).toBeVisible();
      expect(carousel.element().scrollLeft).toBe(0);

      // When the pointer entered the carousel and then left it again
      carousel
        .element()
        .dispatchEvent(new PointerEvent('pointerenter', { pointerId: 1, pointerType: 'mouse', bubbles: true }));
      carousel
        .element()
        .dispatchEvent(new PointerEvent('pointerleave', { pointerId: 1, pointerType: 'mouse', bubbles: true }));

      // and a pointer down and move of the same pointer id follows
      carousel.element().dispatchEvent(
        new PointerEvent('pointerdown', {
          pointerId: 1,
          pointerType: 'mouse',
          clientX: 500,
          clientY: 200,
          bubbles: true,
          cancelable: true
        })
      );
      carousel.element().dispatchEvent(
        new PointerEvent('pointermove', {
          pointerId: 1,
          pointerType: 'mouse',
          clientX: 300,
          clientY: 200,
          bubbles: true,
          cancelable: true
        })
      );

      // Then the carousel does not scroll and is not marked as dragging
      await expect.poll(() => carousel.element().scrollLeft).toBe(0);
      await expect.element(carousel).not.toHaveAttribute('data-dragging');

      // When a pointer down and move with an unknown pointer id follows
      carousel.element().dispatchEvent(
        new PointerEvent('pointerdown', {
          pointerId: 2,
          pointerType: 'mouse',
          clientX: 500,
          clientY: 200,
          bubbles: true,
          cancelable: true
        })
      );
      carousel.element().dispatchEvent(
        new PointerEvent('pointermove', {
          pointerId: 2,
          pointerType: 'mouse',
          clientX: 300,
          clientY: 200,
          bubbles: true,
          cancelable: true
        })
      );

      // Then the carousel still does not scroll
      await expect.poll(() => carousel.element().scrollLeft).toBe(0);
      await expect.element(carousel).not.toHaveAttribute('data-dragging');
    });
  });

  describe('Show all', () => {
    it('invokes onShowAll from the header icon button', async () => {
      const onShowAll = vi.fn();
      const { screen } = await renderCarousel({
        variant: 'multi-browse',
        header: 'Header',
        showAllButtonAriaLabel: 'Show all',
        onShowAll
      });

      // Given the header's show all icon button is visible
      const button = screen.getByRole('button', { name: 'Show all' });
      await expect.element(button).toBeVisible();
      expect(onShowAll).not.toHaveBeenCalled();

      // When the icon button is clicked
      await userEvent.click(button);

      // Then onShowAll is called once
      expect(onShowAll).toHaveBeenCalledOnce();
    });

    it('invokes onShowAll from the text button', async () => {
      const onShowAll = vi.fn();
      const { screen } = await renderCarousel({ variant: 'multi-browse', showAllButtonLabel: 'Show all', onShowAll });

      // Given the show all text button below the carousel is visible
      const button = screen.getByRole('button', { name: 'Show all' });
      await expect.element(button).toBeVisible();
      expect(onShowAll).not.toHaveBeenCalled();

      // When the text button is clicked
      await userEvent.click(button);

      // Then onShowAll is called once
      expect(onShowAll).toHaveBeenCalledOnce();
    });

    it('moves focus to the show all button with ArrowDown', async () => {
      const onShowAll = vi.fn();
      const { screen } = await renderCarousel({ variant: 'multi-browse', showAllButtonLabel: 'Show all', onShowAll });

      // Given the first item of the carousel has focus
      const items = screen.getByRole('listitem');
      items.nth(0).element().focus();
      await expect.element(items.nth(0)).toHaveFocus();

      // When pressing arrow down
      await userEvent.keyboard('{ArrowDown}');

      // Then the show all button below the carousel has focus
      await expect.element(screen.getByRole('button', { name: 'Show all' })).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    // Renders three items with the VRT's network-free SVG graphic and returns
    // the scoped screen locator plus the container div for the axe scan
    const renderAxeCarousel = async (
      options: { carousel?: Omit<MaterialCarouselProps, 'ariaLabel' | 'variant'>; disabledFirstItem?: boolean } = {}
    ) => {
      const { carousel, disabledFirstItem = false } = options;
      const { baseElement, container } = render(
        () => (
          <MaterialCarousel variant="multi-browse" ariaLabel="Carousel" {...(carousel ?? {})}>
            <For each={Array.from({ length: 3 })}>
              {(_item, index) => (
                <MaterialCarouselItem
                  ariaLabel={`Item ${index() + 1}`}
                  disabled={disabledFirstItem && index() === 0}
                  onClick={vi.fn()}
                >
                  <CarouselItemGraphic />
                </MaterialCarouselItem>
              )}
            </For>
          </MaterialCarousel>
        ),
        { wrapper: MaterialTheme }
      );
      await document.fonts.ready;

      return { screen: page.elementLocator(baseElement), container };
    };

    it('has no axe violations with its list and items', async () => {
      const { screen, container } = await renderAxeCarousel();

      // Given the carousel is a labelled list
      const carousel = screen.getByRole('list', { name: 'Carousel' });
      await expect.element(carousel).toBeVisible();

      // and every item is a labelled, keyboard-focusable listitem
      const items = screen.getByRole('listitem');
      expect(items.elements()).toHaveLength(3);
      await expect.element(items.nth(0)).toHaveAttribute('aria-label', 'Item 1');
      await expect.element(items.nth(1)).toHaveAttribute('aria-label', 'Item 2');
      await expect.element(items.nth(2)).toHaveAttribute('aria-label', 'Item 3');
      await expect.element(items.nth(0)).toHaveAttribute('tabindex', '0');
      await expect.element(items.nth(1)).toHaveAttribute('tabindex', '0');
      await expect.element(items.nth(2)).toHaveAttribute('tabindex', '0');

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations with a header and a show all button', async () => {
      const onShowAll = vi.fn();
      const { screen, container } = await renderAxeCarousel({
        carousel: { header: 'Header', showAllButtonAriaLabel: 'Show all', onShowAll }
      });

      // Given the header is a visible heading
      const heading = screen.getByRole('heading', { name: 'Header' });
      await expect.element(heading).toBeVisible();

      // and the show all icon button is visible with its accessible name
      const button = screen.getByRole('button', { name: 'Show all' });
      await expect.element(button).toBeVisible();
      expect(onShowAll).not.toHaveBeenCalled();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations with a disabled item', async () => {
      const { screen, container } = await renderAxeCarousel({ disabledFirstItem: true });

      // Given the first item is disabled and removed from the tab order
      const disabledItem = screen.getByRole('listitem', { name: 'Item 1' });
      await expect.element(disabledItem).toHaveAttribute('data-disabled');
      await expect.element(disabledItem).toHaveAttribute('tabindex', '-1');

      // and the remaining items stay enabled and focusable
      const enabledItem = screen.getByRole('listitem', { name: 'Item 2' });
      await expect.element(enabledItem).not.toHaveAttribute('data-disabled');
      await expect.element(enabledItem).toHaveAttribute('tabindex', '0');

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
