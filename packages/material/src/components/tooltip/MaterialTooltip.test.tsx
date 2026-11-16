import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { axe } from '../../../vitest.axe';
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

      // (Needed in CI)
      button.element().focus();

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

  describe('Accessibility', () => {
    it('wires aria-controls and has no axe violations when a plain tooltip opens on focus', async () => {
      const { baseElement, container } = render(
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

      // Given the button is visible
      await expect.element(button).toBeVisible();

      // When focus moves to the button and the open debounce has elapsed
      await userEvent.tab();

      // (Needed in CI)
      button.element().focus();

      // Then the tooltip is visible and carries the tooltip role with its text
      await vi.waitFor(async () => {
        await expect.element(tooltip).toBeVisible();
      });
      await expect.element(tooltip).toHaveAttribute('role', 'tooltip');
      await expect.element(tooltip).toHaveTextContent('Plain tooltip');

      // and the anchor references the tooltip through aria-controls
      // (the id is set on the sm-tooltip popover host, not on the inner
      // role="tooltip" element resolved by the role query)
      const anchor = button.element().closest('[aria-controls]');
      const tooltipId = anchor?.getAttribute('aria-controls');
      expect(tooltipId).toBeTruthy();
      expect(tooltipId).toBe(screen.getByElement('sm-tooltip').element().id);

      // Then the rendered tree with the open tooltip has no axe violations
      await expect(await axe(container, { rules: { 'color-contrast': { enabled: false } } })).toHaveNoViolations();
    });

    it('wires aria-controls and has no axe violations for a rich tooltip open on mount', async () => {
      const { baseElement, container } = render(
        () => (
          <MaterialTooltip
            variant="rich"
            persistent="mount"
            tooltip={
              <MaterialRichTooltip title="Title" actions={<MaterialButton variant="tonal">Action</MaterialButton>}>
                Rich tooltip
              </MaterialRichTooltip>
            }
          >
            <MaterialButton variant="tonal">Button</MaterialButton>
          </MaterialTooltip>
        ),
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      const button = screen.getByRole('button', { name: 'Button' });
      const tooltip = screen.getByRole('tooltip');

      // Given the tooltip is open immediately on mount
      await expect.element(tooltip).toBeVisible();

      // with its title, body, and actions rendered
      const title = screen.getByRole('heading', { name: 'Title' });
      const action = screen.getByRole('button', { name: 'Action' });
      await expect.element(title).toBeVisible();
      await expect.element(action).toBeVisible();
      await expect.element(tooltip).toHaveTextContent('Rich tooltip');

      // and the anchor references the tooltip through aria-controls
      // (the id is set on the sm-tooltip popover host, not on the inner
      // role="tooltip" element resolved by the role query)
      const anchor = button.element().closest('[aria-controls]');
      const tooltipId = anchor?.getAttribute('aria-controls');
      expect(tooltipId).toBeTruthy();
      expect(tooltipId).toBe(screen.getByElement('sm-tooltip').element().id);

      // Then the rendered tree with the open tooltip has no axe violations
      await expect(await axe(container, { rules: { 'color-contrast': { enabled: false } } })).toHaveNoViolations();
    });
  });
});
