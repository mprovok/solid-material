import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialSplitButton } from './MaterialSplitButton';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

describe('MaterialSplitButtonMenu', () => {
  describe('Visual', () => {
    it('renders the split button', async () => {
      const { baseElement } = render(() => (
        <MaterialSplitButton
          open={false}
          variant="filled"
          size="medium"
          icon={<EditIcon />}
          menuButtonAriaLabel="items"
          onClick={vi.fn()}
          onToggle={vi.fn()}
        >
          Label
        </MaterialSplitButton>
      ));
      const screen = page.elementLocator(baseElement);

      const labelButton = screen.getByRole('button', { name: 'Label' });
      const iconButton = screen.getByRole('switch', { name: 'items' });

      await expect.element(labelButton).toBeVisible();
      await expect.element(iconButton).toBeVisible();

      const icon = labelButton.getByElement('md-icon');
      await expect.element(icon).toBeVisible();
    });
  });

  describe('Accessibility', () => {
    it('is expanded when open', async () => {
      const { baseElement } = render(() => (
        <MaterialSplitButton open={true} variant="filled" size="medium" onClick={vi.fn()} onToggle={vi.fn()}>
          Label
        </MaterialSplitButton>
      ));
      const screen = page.elementLocator(baseElement);

      const iconButton = screen.getByRole('switch');
      await expect.element(iconButton).toHaveAttribute('aria-expanded');
    });
  });

  describe('Interaction', () => {
    it('can be clicked', async () => {
      const onClick = vi.fn();
      const onToggle = vi.fn();

      const { baseElement } = render(() => (
        <MaterialSplitButton open={false} variant="filled" size="medium" onClick={onClick} onToggle={onToggle}>
          Label
        </MaterialSplitButton>
      ));
      const screen = page.elementLocator(baseElement);

      const labelButton = screen.getByRole('button');
      const iconButton = screen.getByRole('switch');

      await expect.element(labelButton).toBeVisible();
      await expect.element(iconButton).toBeVisible();

      await userEvent.click(labelButton);

      expect(onClick).toHaveBeenCalledOnce();

      await userEvent.click(iconButton);

      expect(onToggle).toHaveBeenCalledExactlyOnceWith(true);
    });
  });
});
