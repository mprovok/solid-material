import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialButton } from '../button/MaterialButton';
import { MaterialCard, MaterialCardBody } from '../card/MaterialCard';

import type { MaterialBottomSheetVariant } from './MaterialBottomSheet';

import { MaterialBottomSheet } from './MaterialBottomSheet';

import styles from './MaterialBottomSheet.stories.module.css';

interface RenderComponentProps {
  variant: MaterialBottomSheetVariant;
  supportFullHeight?: boolean;
  dragHandle?: boolean;
  availableIndices?: number[];
}

const RenderComponent: VoidComponent<RenderComponentProps> = props => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = createSignal(false);

  const onCloseBottomSheet = () => setIsBottomSheetOpen(false);
  const onToggleBottomSheet = () => setIsBottomSheetOpen(value => !value);

  return (
    <div class={styles['bottom-sheet']}>
      <MaterialButton variant="tonal" onClick={onToggleBottomSheet}>
        Open
      </MaterialButton>
      <MaterialBottomSheet
        variant={props.variant}
        open={isBottomSheetOpen()}
        onClose={onCloseBottomSheet}
        dragHandle={props.dragHandle}
        availableIndices={props.availableIndices}
        supportFullHeight={props.supportFullHeight}
      >
        <MaterialCard variant="filled" size="large">
          <MaterialCardBody>Bottom sheet 1</MaterialCardBody>
        </MaterialCard>
        <MaterialCard variant="filled" size="large">
          <MaterialCardBody>Bottom sheet 2</MaterialCardBody>
        </MaterialCard>
        <MaterialCard variant="filled" size="large">
          <MaterialCardBody>Bottom sheet 3</MaterialCardBody>
        </MaterialCard>
        <MaterialCard variant="filled" size="large">
          <MaterialCardBody>Bottom sheet 4</MaterialCardBody>
        </MaterialCard>
        <div class={styles['close']}>
          <MaterialButton variant="filled" onClick={() => setIsBottomSheetOpen(false)}>
            Close
          </MaterialButton>
        </div>
      </MaterialBottomSheet>
    </div>
  );
};

describe('MaterialBottomSheet', () => {
  describe('Interaction', () => {
    describe.each(['standard', 'modal'] satisfies MaterialBottomSheetVariant[])('variant = $0', variant => {
      it('moves sheet to inside the viewport when opened', async () => {
        const { baseElement } = render(() => <RenderComponent variant={variant} />, { wrapper: MaterialTheme });
        const screen = page.elementLocator(baseElement);

        const sheet = screen.getByRole('complementary');

        // Given the button to open the sheet is visible
        const openButton = screen.getByRole('button', { name: 'Open' });

        // When the "Open" button is clicked
        await userEvent.click(openButton);

        // Then the sheet is visible and in the viewport
        await expect.element(sheet).toBeVisible();
        await expect.element(sheet).toBeInViewport();
      });

      it('moves sheet to outside the viewport when closed', async () => {
        const { baseElement } = render(() => <RenderComponent variant={variant} />, { wrapper: MaterialTheme });
        const screen = page.elementLocator(baseElement);

        const sheet = screen.getByRole('complementary');

        // Given the button to open the sheet can be clicked
        const openButton = screen.getByRole('button', { name: 'Open' });
        await userEvent.click(openButton);

        // and the "Close" button is visible
        const closeButton = screen.getByRole('button', { name: 'Close' });
        await expect.element(closeButton).toBeVisible();
        await expect.element(closeButton).toBeInViewport();

        // When the "Close" button is clicked
        await userEvent.click(closeButton);

        // Then the sheet is no longer visible and in the viewport
        await expect.element(sheet).not.toBeInViewport();
      });
    });

    it('moves sheet to outside the viewport when scrolling down', async () => {
      const { baseElement } = render(() => <RenderComponent variant="modal" />, { wrapper: MaterialTheme });
      const screen = page.elementLocator(baseElement);

      const sheet = screen.getByRole('complementary');

      // Given the button to open the sheet can be clicked
      const openButton = screen.getByRole('button', { name: 'Open' });
      await userEvent.click(openButton);

      // and the sheet is visible and in the viewport
      await expect.element(sheet).toBeVisible();
      await expect.element(sheet).toBeInViewport();

      // When the sheet is swiped down
      await userEvent.wheel(sheet, { delta: { y: -sheet.element().clientHeight } });

      // Then the sheet is no longer visible and in the viewport
      await expect.element(sheet).not.toBeInViewport();
    });

    it('closes when clicking on backdrop of modal sheet', async () => {
      const { baseElement } = render(() => <RenderComponent variant="modal" />, { wrapper: MaterialTheme });
      const screen = page.elementLocator(baseElement);

      const sheet = screen.getByRole('complementary');

      // Given the button to open the sheet can be clicked
      const openButton = screen.getByRole('button', { name: 'Open' });
      await userEvent.click(openButton);

      // and the sheet is visible and in the viewport
      await expect.element(sheet).toBeVisible();
      await expect.element(sheet).toBeInViewport();

      // When the backdrop is clicked
      await userEvent.keyboard('{Escape}');
      // Issue #3: Clicking on (backdrop of) dialog fails in test environment
      // await userEvent.click(dialog);

      // Then the sheet is no longer visible and in the viewport
      await expect.element(sheet).not.toBeInViewport();
    });

    it('shows more content after clicking drag handle', async () => {
      const { baseElement } = render(
        () => <RenderComponent variant="modal" dragHandle={true} availableIndices={[0, 1]} />,
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      // Given the button to open the sheet can be clicked
      const openButton = screen.getByRole('button', { name: 'Open' });
      await userEvent.click(openButton);

      // and the drag handle is visible
      const handle = screen.getByRole('separator');
      await expect.element(handle).toBeVisible();
      await expect.element(handle).toBeInViewport();

      const sheet1 = screen.getByText('Bottom sheet 1');
      const sheet2 = screen.getByText('Bottom sheet 2');
      const sheet4 = screen.getByText('Bottom sheet 4');

      // and element 0 is shown, but element 1 is outside viewport
      await expect.element(sheet1).toBeInViewport();
      await expect.element(sheet2).not.toBeInViewport();

      // (Needed to make the test less flaky)
      await expect.element(handle).toBeInViewport();

      // When double clicking the drag handle
      await userEvent.dblClick(handle);

      // Then element 1 is moved to inside the viewport, but not all elements are visible
      await expect.element(sheet2).toBeInViewport();
      await expect.element(sheet4).not.toBeInViewport();

      // (Needed to make the test less flaky)
      await expect.element(handle).toBeInViewport();

      // When double clicking the drag handle again
      await userEvent.dblClick(handle);

      // Then all elements are visible
      await expect.element(sheet4).toBeInViewport();

      const closeButton = screen.getByRole('button', { name: 'Close' });
      await expect.element(closeButton).toBeInViewport();

      // (Needed to make the test less flaky)
      await expect.element(handle).toBeInViewport();

      // When double clicking the drag handle again
      await userEvent.dblClick(handle);

      await expect.element(sheet2).not.toBeInViewport();
    });

    it('shows more or less content when using arrow keys', async () => {
      const { baseElement } = render(
        () => <RenderComponent variant="modal" dragHandle={true} availableIndices={[0, 1]} />,
        { wrapper: MaterialTheme }
      );
      const screen = page.elementLocator(baseElement);

      const openButton = screen.getByRole('button', { name: 'Open' });
      const closeButton = screen.getByRole('button', { name: 'Close' });

      // Given the button to open the sheet can be clicked
      await userEvent.click(openButton);

      // and the drag handle is visible
      const handle = screen.getByRole('separator');
      await expect.element(handle).toBeVisible();
      await expect.element(handle).toBeInViewport();

      const sheet1 = screen.getByText('Bottom sheet 1');
      const sheet2 = screen.getByText('Bottom sheet 2');

      // and element 0 is shown, but element 1 is outside viewport
      await expect.element(sheet1).toBeInViewport();
      await expect.element(sheet2).not.toBeInViewport();

      // and the handle has focus
      await expect.element(handle).toHaveFocus();

      // When pressing arrow up key, then shows more content
      await userEvent.keyboard('{ArrowUp}');
      await expect.element(sheet2).toBeInViewport();

      // When pressing arrow up key, then shows more content
      await userEvent.keyboard('{ArrowUp}');
      await expect.element(closeButton).toBeInViewport();

      // When pressing arrow down key, then shows less content
      await userEvent.keyboard('{ArrowDown}');
      await expect.element(closeButton).not.toBeInViewport();

      // When pressing arrow down key, then shows less content
      await userEvent.keyboard('{ArrowDown}');
      await expect.element(sheet2).not.toBeInViewport();

      // When pressing Enter key, then shows more content again
      await userEvent.keyboard('{Enter}');
      await expect.element(sheet2).toBeInViewport();
    });

    it('can cover the full height of the viewport by swiping up', async () => {
      const { baseElement } = render(
        () => <RenderComponent variant="modal" dragHandle={true} supportFullHeight={true} />,
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      // Given the button to open the sheet can be clicked
      const openButton = screen.getByRole('button', { name: 'Open' });
      await userEvent.click(openButton);

      // and the sheet is visible and in the viewport
      const sheet = screen.getByRole('complementary');
      await expect.element(sheet).toBeVisible();
      await expect.element(sheet).toBeInViewport();

      // When the sheet is swiped up
      await userEvent.wheel(sheet, { delta: { y: sheet.element().clientHeight } });

      // Then the sheet is visible and fully covers the viewport
      await expect.element(sheet).toBeInViewport({ ratio: 1 });
    });

    it('can cover the full height of the viewport when using the drag handle', async () => {
      const { baseElement } = render(
        () => <RenderComponent variant="modal" dragHandle={true} supportFullHeight={true} />,
        {
          wrapper: MaterialTheme
        }
      );
      const screen = page.elementLocator(baseElement);

      // Given the button to open the sheet can be clicked
      const openButton = screen.getByRole('button', { name: 'Open' });
      await userEvent.click(openButton);

      // and the sheet is visible and in the viewport
      const sheet = screen.getByRole('complementary');
      await expect.element(sheet).toBeVisible();
      await expect.element(sheet).toBeInViewport();

      // and the drag handle is visible
      const handle = screen.getByRole('separator');
      await expect.element(handle).toBeVisible();
      await expect.element(handle).toBeInViewport();

      await userEvent.dblClick(handle);

      // Then the sheet is visible and fully covers the viewport
      await expect.element(sheet).toBeInViewport({ ratio: 1 });
    });
  });
});
