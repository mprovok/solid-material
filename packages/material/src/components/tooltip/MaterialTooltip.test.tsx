import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialButton } from '../button/MaterialButton';

import { MaterialPlainTooltip } from './MaterialPlainTooltip';
import { MaterialRichTooltip } from './MaterialRichTooltip';
import { MaterialTooltip } from './MaterialTooltip';

describe('MaterialTooltip', () => {
  describe('Interaction', () => {
    it('shows a plain tooltip on hover', async () => {
      const { baseElement } = render(
        () => (
          <MaterialTooltip variant="plain" tooltip={<MaterialPlainTooltip>Plain tooltip</MaterialPlainTooltip>}>
            <MaterialButton variant="tonal">Button</MaterialButton>
          </MaterialTooltip>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('button', { name: 'Button' });
      const tooltip = screen.getByRole('tooltip', { name: 'Plain tooltip' });

      // Given a button
      await expect.element(button).toBeVisible();

      await expect.element(tooltip).not.toBeInTheDocument();

      // When hovering over the button
      await userEvent.hover(button);

      // Then the tooltip is visible
      await expect.element(tooltip).toBeVisible();

      // When no longer hovering over the button
      await userEvent.unhover(button);

      // Then the tooltip is no longer visible
      await expect.element(tooltip).not.toBeInTheDocument();
    });

    it('shows a rich tooltip on hover', async () => {
      const { baseElement } = render(
        () => (
          <MaterialTooltip variant="rich" tooltip={<MaterialRichTooltip>Rich tooltip</MaterialRichTooltip>}>
            <MaterialButton variant="tonal">Button</MaterialButton>
          </MaterialTooltip>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('button', { name: 'Button' });
      const tooltip = screen.getByRole('tooltip', { name: 'Rich tooltip' });

      // Given a button
      await expect.element(button).toBeVisible();

      await expect.element(tooltip).not.toBeInTheDocument();

      // When hovering over the button
      await userEvent.hover(button);

      // Then the tooltip is visible
      await expect.element(tooltip).toBeVisible();

      // When no longer hovering over the button
      await userEvent.unhover(button);

      // Then the tooltip is no longer visible
      await expect.element(tooltip).not.toBeInTheDocument();
    });

    it('shows a persistent rich tooltip on click', async () => {
      const { baseElement } = render(
        () => (
          <MaterialTooltip
            variant="rich"
            persistent="click"
            tooltip={<MaterialRichTooltip>Rich tooltip</MaterialRichTooltip>}
          >
            <MaterialButton variant="tonal">Button</MaterialButton>
          </MaterialTooltip>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('button', { name: 'Button' });
      const tooltip = screen.getByRole('tooltip', { name: 'Rich tooltip' });

      // Given a button
      await expect.element(button).toBeVisible();

      await expect.element(tooltip).not.toBeInTheDocument();

      // When hovering over the button
      await userEvent.hover(button);

      // Then tooltip is still not visible
      await expect.element(tooltip).not.toBeInTheDocument();

      // When the button is clicked
      await userEvent.click(button);

      // Then the tooltip becomes visible
      await expect.element(tooltip).toBeVisible();

      // When no longer hovering over the button
      await userEvent.unhover(button);

      // Then the tooltip remains visible
      await expect.element(tooltip).toBeVisible();

      // When clicking somewhere on the screen
      await userEvent.click(document.body);

      // The tooltip is hidden
      await expect.element(tooltip).not.toBeInTheDocument();
    });

    it('shows a persistent rich tooltip on mount', async () => {
      const { baseElement } = render(
        () => (
          <MaterialTooltip
            variant="rich"
            persistent="mount"
            tooltip={<MaterialRichTooltip>Rich tooltip</MaterialRichTooltip>}
          >
            <MaterialButton variant="tonal">Button</MaterialButton>
          </MaterialTooltip>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('button', { name: 'Button' });
      const tooltip = screen.getByRole('tooltip', { name: 'Rich tooltip' });

      // Given a button and the tooltip is visible
      await expect.element(button).toBeVisible();
      await expect.element(tooltip).toBeVisible();

      // When hovering over the button and subsequently stop hovering
      await userEvent.hover(button);
      await expect.element(tooltip).toBeVisible();
      await userEvent.unhover(button);

      // Then the tooltip remains visible
      await expect.element(tooltip).toBeVisible();

      // When clicking somewhere on the screen
      await userEvent.click(document.body);

      // The tooltip is hidden
      await expect.element(tooltip).not.toBeInTheDocument();
    });

    it('shows a tooltip on focus', async () => {
      const { baseElement } = render(
        () => (
          <MaterialTooltip variant="plain" tooltip={<MaterialPlainTooltip>Plain tooltip</MaterialPlainTooltip>}>
            <MaterialButton variant="tonal">Button</MaterialButton>
          </MaterialTooltip>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('button', { name: 'Button' });
      const tooltip = screen.getByRole('tooltip', { name: 'Plain tooltip' });

      // Given a button
      await expect.element(button).toBeVisible();

      await expect.element(tooltip).not.toBeInTheDocument();

      // When moving focus to the button
      await userEvent.tab();

      // Then the tooltip is visible
      await expect.element(tooltip).toBeVisible();

      // When moving focus to another element
      await userEvent.tab();

      // Then the tooltip is no longer visible
      await expect.element(tooltip).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('shows no non-persistent tooltip on click', async () => {
      const { baseElement } = render(
        () => (
          <MaterialTooltip variant="plain" tooltip={<MaterialPlainTooltip>Plain tooltip</MaterialPlainTooltip>}>
            <MaterialButton variant="tonal">Button</MaterialButton>
          </MaterialTooltip>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('button', { name: 'Button' });
      const tooltip = screen.getByRole('tooltip', { name: 'Plain tooltip' });

      // Given a button
      await expect.element(button).toBeVisible();

      await expect.element(tooltip).not.toBeInTheDocument();

      // When hovering over the button
      await userEvent.hover(button);
      await userEvent.click(button);
      await userEvent.unhover(button);

      // Then the tooltip is no longer visible
      await expect.element(tooltip).not.toBeInTheDocument();
    });
  });
});
