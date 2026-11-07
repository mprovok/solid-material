import type { PageScreenshotOptions } from 'playwright';
import type { VoidComponent } from 'solid-js';
import type { Locator } from 'vitest/browser';

import { render } from '@solidjs/testing-library';
import { For } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialCarouselProps, MaterialCarouselVariant } from './MaterialCarousel';

import { MaterialCarousel } from './MaterialCarousel';
import { MaterialCarouselItem } from './MaterialCarouselItem';

// Written by GLM 5.3 Flash

// How long to wait after rendering or focusing until the item width and
// clip-path transitions have settled
const SETTLE_TRANSITIONS_MS = 800;

// Playwright's screenshot default (`animations: 'disabled'`) cancels the
// scroll-driven `animation-timeline: view(x)` animations that size the
// carousel's items — allow them so items render at their progressive widths.
// vitest forwards `screenshotOptions` to Playwright's `locator.screenshot()`
// but types it as an empty object, so keep a playwright-typed options object;
// and its promisified `expect.element` assertion only exposes the matcher's
// `(name?, options?)` overload — `undefined` as the name keeps the
// auto-generated, test-name-based screenshot name
const matchScreenshot = async (element: Locator) => {
  const screenshotOptions: PageScreenshotOptions = { animations: 'allow' };
  return expect.element(element).toMatchScreenshot(undefined, { screenshotOptions });
};

// Waits for the mandatory scroll snap to settle after a programmatic scroll:
// `scrollLeft` must stop changing between successive polls
const waitForScrollSnapSettle = async (carousel: Element) => {
  let previousScrollLeft = -1;
  await vi.waitFor(
    () => {
      const { scrollLeft } = carousel;
      // The scroll has settled once `scrollLeft` stops changing between polls
      const hasSettled = scrollLeft === previousScrollLeft;
      previousScrollLeft = scrollLeft;
      expect(hasSettled).toBe(true);
    },
    { timeout: 2000 }
  );
};

// Deterministic, network-free stand-in for the remote image used in the stories
const CarouselItemGraphic = () => (
  <svg viewBox="0 0 100 100">
    <rect width="100" height="100" fill="#b7c4ff" />
    <circle cx="32" cy="34" r="18" fill="#ffd8e4" />
    <rect x="52" y="52" width="34" height="34" rx="8" fill="#7d5260" />
  </svg>
);

interface CarouselFixtureProps {
  carousel: MaterialCarouselProps;
  itemCount?: number;
  disabledItemIndices?: number[];
  width?: string;
}

const CarouselFixture: VoidComponent<CarouselFixtureProps> = props => {
  const itemCount = () => props.itemCount ?? 6;
  const width = () => props.width ?? '600px';
  const isDisabled = (index: number) => props.disabledItemIndices?.includes(index) ?? false;

  return (
    <main style={{ width: width(), padding: '1rem' }}>
      <MaterialCarousel {...props.carousel} ariaLabel="Carousel">
        <For each={Array.from({ length: itemCount() })}>
          {(_item, index) => (
            <MaterialCarouselItem ariaLabel={`Item ${index() + 1}`} disabled={isDisabled(index())} onClick={vi.fn()}>
              <CarouselItemGraphic />
            </MaterialCarouselItem>
          )}
        </For>
      </MaterialCarousel>
    </main>
  );
};

// Prepares a freshly rendered carousel for its screenshot: waits for the
// fonts and the item transitions to settle and parks the pointer so hover
// state from a previous test cannot leak into the screenshot
const settleRender = async (baseElement: HTMLElement, renderedAt: number) => {
  await document.fonts.ready;

  const screen = page.elementLocator(baseElement);

  // Move the pointer to the top-left corner so that hover state from a
  // previous test does not leak into this test's screenshots
  await userEvent.hover(document.body, { position: { x: 0, y: 0 } });

  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(renderedAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );

  return screen;
};

const renderCarousel = async (props: CarouselFixtureProps) => {
  const renderedAt = performance.now();

  const { baseElement } = render(() => <CarouselFixture {...props} />, { wrapper: MaterialTheme });

  return settleRender(baseElement, renderedAt);
};

describe('MaterialCarousel', () => {
  describe('Visual', () => {
    // Variants
    it.each([
      'multi-browse',
      'uncontained',
      'hero',
      'centered-hero',
      'full-screen'
    ] satisfies MaterialCarouselVariant[])('renders a carousel with variant $0', async variant => {
      const screen = await renderCarousel({ carousel: { variant } });

      if (variant === 'full-screen') {
        // The full-screen variant renders the carousel in a modal dialog;
        // screenshot the dialog like the modal side sheet does
        const dialog = screen.getByElement('dialog');
        await expect.element(dialog).toBeVisible();

        const carousel = screen.getByRole('list', { name: 'Carousel' });
        await expect.element(carousel).toBeVisible();

        await matchScreenshot(dialog);
      } else {
        // Given the carousel is visible
        const carousel = screen.getByRole('list', { name: 'Carousel' });
        await expect.element(carousel).toBeVisible();

        await matchScreenshot(screen.getByElement('main'));
      }
    });

    // Centered-hero scrolled to the second item — the second item renders
    // large and centered while its neighbors stay small
    it('renders a centered-hero carousel scrolled to the second item', async () => {
      const screen = await renderCarousel({ carousel: { variant: 'centered-hero' } });

      // Given the carousel is visible
      const carousel = screen.getByRole('list', { name: 'Carousel' });
      await expect.element(carousel).toBeVisible();

      // When the second item is scrolled into view and the mandatory snap
      // settles — the item holder div carries the variant's
      // scroll-margin-inline-start
      const carouselElement = carousel.element();
      carouselElement.children[1]!.scrollIntoView({ behavior: 'instant', inline: 'start', block: 'nearest' });
      await waitForScrollSnapSettle(carouselElement);

      // Then the carousel has scrolled
      expect(carouselElement.scrollLeft).toBeGreaterThan(0);

      await matchScreenshot(screen.getByElement('main'));
    });

    // Centered-hero scrolled to the end — the last item renders large while
    // the leading items stay small
    it('renders a centered-hero carousel scrolled to the end', async () => {
      const screen = await renderCarousel({ carousel: { variant: 'centered-hero' } });

      // Given the carousel is visible
      const carousel = screen.getByRole('list', { name: 'Carousel' });
      await expect.element(carousel).toBeVisible();

      // When the carousel is scrolled to the end and the mandatory snap settles
      const carouselElement = carousel.element();
      carouselElement.scrollTo({ left: carouselElement.scrollWidth, behavior: 'instant' });
      await waitForScrollSnapSettle(carouselElement);

      // Then the carousel has scrolled
      expect(carouselElement.scrollLeft).toBeGreaterThan(0);

      await matchScreenshot(screen.getByElement('main'));
    });

    // Header — captured at a compact width where exactly one large, one
    // medium and one small item are visible
    it('renders a carousel with a header', async () => {
      const screen = await renderCarousel({
        carousel: { variant: 'multi-browse', header: 'Header' },
        itemCount: 3,
        width: '375px'
      });

      // Given the carousel and its header are visible
      const carousel = screen.getByRole('list', { name: 'Carousel' });
      await expect.element(carousel).toBeVisible();

      await expect.element(screen.getByText('Header')).toBeVisible();

      await matchScreenshot(screen.getByElement('main'));
    });

    // Header with a show-all icon button
    it('renders a carousel with a header and a show-all icon button', async () => {
      const screen = await renderCarousel({
        carousel: { variant: 'multi-browse', header: 'Header', showAllHeaderTitle: 'Show all', onShowAll: vi.fn() },
        itemCount: 3,
        width: '375px'
      });

      // Given the carousel, its header and the show-all icon button are visible
      const carousel = screen.getByRole('list', { name: 'Carousel' });
      await expect.element(carousel).toBeVisible();

      await expect.element(screen.getByRole('button', { name: 'Show all' })).toBeVisible();

      await matchScreenshot(screen.getByElement('main'));
    });

    // Show-all text button below the carousel
    it('renders a carousel with a show all button', async () => {
      const screen = await renderCarousel({
        carousel: { variant: 'multi-browse', showAllButtonLabel: 'Show all', onShowAll: vi.fn() },
        itemCount: 3,
        width: '375px'
      });

      // Given the carousel and the show-all button are visible
      const carousel = screen.getByRole('list', { name: 'Carousel' });
      await expect.element(carousel).toBeVisible();

      await expect.element(screen.getByRole('button', { name: 'Show all' })).toBeVisible();

      await matchScreenshot(screen.getByElement('main'));
    });

    // Custom height
    it('renders a carousel with a custom height', async () => {
      const screen = await renderCarousel({ carousel: { variant: 'multi-browse', height: '250px' } });

      // Given the carousel is visible
      const carousel = screen.getByRole('list', { name: 'Carousel' });
      await expect.element(carousel).toBeVisible();

      await matchScreenshot(screen.getByElement('main'));
    });

    // Custom item max width
    it('renders a carousel with a custom item max width', async () => {
      const screen = await renderCarousel({ carousel: { variant: 'multi-browse', itemMaxWidth: '110px' } });

      // Given the carousel is visible
      const carousel = screen.getByRole('list', { name: 'Carousel' });
      await expect.element(carousel).toBeVisible();

      await matchScreenshot(screen.getByElement('main'));
    });

    // Compact width — exactly one large, one medium and one small item are
    // visible, mirroring the stories' iphoneSE3 viewport
    it('renders a multi-browse carousel with large, medium and small items at a compact width', async () => {
      const screen = await renderCarousel({ carousel: { variant: 'multi-browse' }, width: '375px' });

      // Given the carousel is visible
      const carousel = screen.getByRole('list', { name: 'Carousel' });
      await expect.element(carousel).toBeVisible();

      await matchScreenshot(screen.getByElement('main'));
    });

    // Disabled item
    it('renders a carousel with a disabled item', async () => {
      const screen = await renderCarousel({
        carousel: { variant: 'multi-browse' },
        itemCount: 3,
        disabledItemIndices: [0],
        width: '375px'
      });

      // Given the carousel is visible and the first item is disabled
      const carousel = screen.getByRole('list', { name: 'Carousel' });
      await expect.element(carousel).toBeVisible();

      const disabledItem = screen.getByRole('listitem', { name: 'Item 1' });
      await expect.element(disabledItem).toHaveAttribute('data-disabled');

      await matchScreenshot(screen.getByElement('main'));
    });

    // Focused first item — the focus ring and elevation are shown when the
    // first item receives keyboard focus
    it('renders a carousel with a focused first item', async () => {
      const screen = await renderCarousel({ carousel: { variant: 'multi-browse' }, itemCount: 3, width: '375px' });

      // Given the carousel and its first item are visible
      const carousel = screen.getByRole('list', { name: 'Carousel' });
      await expect.element(carousel).toBeVisible();

      const firstItem = screen.getByRole('listitem', { name: 'Item 1' });
      await expect.element(firstItem).toBeVisible();

      // When the first item receives keyboard focus
      const focusedAt = performance.now();
      await userEvent.tab();

      // Then the first item has focus and the focus ring is shown
      await expect.element(firstItem).toHaveFocus();

      await vi.waitFor(
        () => {
          expect(performance.now()).toBeGreaterThanOrEqual(focusedAt + SETTLE_TRANSITIONS_MS);
        },
        { timeout: 2000 }
      );

      await matchScreenshot(screen.getByElement('main'));
    });
  });
});
