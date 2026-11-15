import type { ParentComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { axe } from '../../../vitest.axe';

import type { TypographyProps } from './Typography';

import { H1, H2, H3, H4, H5, H6, Span } from './Typography';

type HeadingComponent = ParentComponent<TypographyProps>;

// One entry per heading level, pairing the level with the component that renders it
const HEADINGS: [level: 1 | 2 | 3 | 4 | 5 | 6, component: HeadingComponent][] = [
  [1, H1],
  [2, H2],
  [3, H3],
  [4, H4],
  [5, H5],
  [6, H6]
];

describe('Typography', () => {
  describe('Accessibility', () => {
    it.each(HEADINGS)('renders a level $0 heading', async (level, Heading) => {
      const { baseElement } = render(() => (
        <Heading role="headline" size="large">
          Heading {level}
        </Heading>
      ));
      const screen = page.elementLocator(baseElement);

      // Given the heading renders at its own level with its text as the accessible name
      const heading = screen.getByRole('heading', { level, name: `Heading ${level}` });
      await expect.element(heading).toBeVisible();

      // and the typescale role and size map to styling classes only
      await expect.element(heading).toHaveClass('md-typescale-headline-large');
      await expect.element(heading).not.toHaveAttribute('role');
    });

    it('wires a labelled span to the element it labels', async () => {
      const { baseElement } = render(() => (
        <>
          <Span role="label" size="medium" id="volume-label">
            Volume
          </Span>
          <input type="text" aria-labelledby="volume-label" />
        </>
      ));
      const screen = page.elementLocator(baseElement);

      // Given the span passes its id through as a DOM attribute, with its
      // typescale role and size applied as classes
      const span = screen.getByText('Volume');
      await expect.element(span).toBeVisible();
      await expect.element(span).toHaveAttribute('id', 'volume-label');
      await expect.element(span).toHaveClass('md-typescale-label-medium');

      // Then the labelled input resolves its accessible name from the span
      await expect.element(screen.getByLabelText('Volume')).toBeVisible();
    });

    it('has no axe violations in the assembled heading structure', async () => {
      const { container } = render(() => (
        <main>
          <H1 role="display" size="large">
            Display
          </H1>
          <H2 role="headline" size="large">
            Headline
          </H2>
          <H3 role="title" size="large">
            Title
          </H3>
          <H4 role="body" size="large">
            Body
          </H4>
          <H5 role="label" size="large">
            Label
          </H5>
          <H6 role="label" size="medium">
            Label medium
          </H6>
          <Span role="label" size="medium" id="assembled-span">
            Span label
          </Span>
        </main>
      ));

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
