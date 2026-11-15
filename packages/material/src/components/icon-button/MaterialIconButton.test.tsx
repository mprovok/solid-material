import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { axe } from '../../../vitest.axe';

import { MaterialIconButton } from './MaterialIconButton';

import VideocamIcon from '@solidmaterial/icons/400/outlined/videocam.svg';

describe('MaterialIconButton', () => {
  describe('Accessibility', () => {
    it('falls back to the title for the accessible name and renders a closed tooltip', async () => {
      const { baseElement, container } = render(() => (
        <MaterialIconButton variant="tonal" icon={<VideocamIcon />} title="Toggle camera" />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the icon-only button is visible and its accessible name comes from the title
      const button = screen.getByRole('button', { name: 'Toggle camera' });
      await expect.element(button).toBeVisible();

      // and the plain tooltip is rendered closed for hover/focus
      const tooltip = screen.getByElement('sm-tooltip');
      await expect.element(tooltip).toHaveAttribute('popover', 'auto');
      await expect.element(tooltip).toHaveTextContent('Toggle camera');
      await expect.element(tooltip).not.toBeVisible();

      // and the anchor references the tooltip through aria-controls
      const anchor = button.element().closest('[aria-controls]');
      expect(anchor?.getAttribute('aria-controls')).toBe(tooltip.element().id);

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('maps ariaLabel to the accessible name without rendering a tooltip', async () => {
      const { baseElement, container } = render(() => (
        <MaterialIconButton variant="tonal" icon={<VideocamIcon />} ariaLabel="Mute camera" />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the icon-only button is visible and its accessible name comes from ariaLabel
      const button = screen.getByRole('button', { name: 'Mute camera' });
      await expect.element(button).toBeVisible();

      // and no tooltip is rendered when no title is given
      expect(container.querySelectorAll('sm-tooltip')).toHaveLength(0);

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { baseElement, container } = render(() => (
        <MaterialIconButton variant="tonal" icon={<VideocamIcon />} ariaLabel="Mute camera" disabled={true} />
      ));
      const screen = page.elementLocator(baseElement);

      // Given the disabled icon button is visible and keeps its accessible name
      const button = screen.getByRole('button', { name: 'Mute camera' });
      await expect.element(button).toBeVisible();

      // and is inert
      await expect.element(button).toBeDisabled();

      // Then the rendered tree has no axe violations
      await expect(await axe(container)).toHaveNoViolations();
    });
  });
});
