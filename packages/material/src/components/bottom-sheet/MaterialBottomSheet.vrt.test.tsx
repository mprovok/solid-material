import { render } from '@solidjs/testing-library';
import { createSignal, onMount } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialCard, MaterialCardBody } from '../card/MaterialCard';

import type { MaterialBottomSheetProps, MaterialBottomSheetVariant } from './MaterialBottomSheet';

import { MaterialBottomSheet } from './MaterialBottomSheet';

import styles from './MaterialBottomSheet.stories.module.css';

const renderComponent = async (props: Omit<MaterialBottomSheetProps, 'open'>) => {
  const [isOpen, setOpen] = createSignal(false);

  onMount(() => {
    setTimeout(() => {
      setOpen(true);
    }, 1_000);
  });

  const onClose = () => setOpen(false);

  const { baseElement } = render(
    () => (
      <div class={styles['bottom-sheet']}>
        <MaterialBottomSheet {...props} open={isOpen()} onClose={onClose}>
          <MaterialCard variant="filled" size="large">
            <MaterialCardBody>Bottom sheet 1</MaterialCardBody>
          </MaterialCard>
          <MaterialCard variant="filled" size="large">
            <MaterialCardBody>Bottom sheet 2</MaterialCardBody>
          </MaterialCard>
        </MaterialBottomSheet>
      </div>
    ),
    { wrapper: MaterialTheme }
  );
  await document.fonts.ready;
  return page.elementLocator(baseElement);
};

describe('MaterialBottomSheet', () => {
  describe('Visual', () => {
    describe.each(['standard', 'modal'] satisfies MaterialBottomSheetVariant[])('variant = $0', variant => {
      it(`renders ${variant} sheet`, async () => {
        const screen = await renderComponent({ variant });
        const sheet = screen.getByRole('complementary');

        await expect.element(sheet).toBeVisible();

        await expect.element(sheet).toMatchScreenshot();
      });

      it(`renders ${variant} sheet with drag handle`, async () => {
        const screen = await renderComponent({ variant, dragHandle: true });
        const sheet = screen.getByRole('complementary');

        await expect.element(sheet).toBeVisible();
        await expect.element(sheet).toMatchScreenshot();
      });

      it(`renders ${variant} sheet partially`, async () => {
        const screen = await renderComponent({ variant, availableIndices: [0, 1] });
        const sheet = screen.getByRole('complementary');

        await expect.element(sheet).toBeVisible();

        const sheet1 = screen.getByText('Bottom sheet 1');
        const sheet2 = screen.getByText('Bottom sheet 2');

        // and element 1 is shown, but element 2 is outside viewport
        await expect.element(sheet1).toBeInViewport();
        await expect.element(sheet2).not.toBeInViewport();

        await expect.element(screen).toMatchScreenshot();
      });

      it(`renders ${variant} sheet and show the full height`, async () => {
        const screen = await renderComponent({ variant, dragHandle: true, supportFullHeight: true });
        const sheet = screen.getByRole('complementary');

        await expect.element(sheet).toBeVisible();

        // Given element 1 is visible
        const sheet1 = screen.getByText('Bottom sheet 1');
        await expect.element(sheet1).toBeVisible();

        // and the sheet is not fully visible
        await expect.element(sheet).not.toBeInViewport({ ratio: 1 });

        // When activating the drag handle
        const handle = screen.getByRole('separator');
        await userEvent.click(handle);
        await userEvent.keyboard('{Enter}');

        // Then the sheet is fully visible
        await expect.element(sheet).toBeInViewport({ ratio: 1 });

        await expect.element(screen).toMatchScreenshot();
      });
    });
  });
});
