import { render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialButton } from '../button/MaterialButton';
import { MaterialCard, MaterialCardBody } from '../card/MaterialCard';

import type { MaterialSideSheetProps, MaterialSideSheetVariant } from './MaterialSideSheet';

import { MaterialSideSheet } from './MaterialSideSheet';

// Written by GLM 5.3 Flash

// How long to wait after rendering until the opening transitions have settled.
// The standard variant reveals its content by animating grid-template-columns
// and the modal variant fades in the backdrop scrim, neither of which changes
// the screenshot target's bounding box, so the element screenshot's stability
// wait does not cover them
const SETTLE_TRANSITIONS_MS = 800;

const getSideSheetChildren = () => (
  <MaterialCard variant="filled" size="medium">
    <MaterialCardBody>Side sheet</MaterialCardBody>
  </MaterialCard>
);

// Prepares a freshly rendered side sheet for its screenshot: waits for the
// fonts and the opening transitions to settle and parks the pointer so hover
// state from a previous test cannot leak into the screenshot
const settleRender = async (baseElement: HTMLElement, renderedAt: number) => {
  await document.fonts.ready;

  const screen = page.elementLocator(baseElement);

  const dialog = screen.getByElement('dialog');
  await expect.element(dialog).toBeVisible();

  // Move the pointer to the top-left corner of the dialog so that hover state
  // from a previous test does not leak into this test's screenshots
  await userEvent.hover(dialog, { position: { x: 0, y: 0 } });

  await vi.waitFor(
    () => {
      expect(performance.now()).toBeGreaterThanOrEqual(renderedAt + SETTLE_TRANSITIONS_MS);
    },
    { timeout: 2000 }
  );

  return screen;
};

const renderComponent = async (props: Omit<MaterialSideSheetProps, 'open' | 'actions'>) => {
  const renderedAt = performance.now();

  const { baseElement } = render(
    () => (
      <MaterialSideSheet {...props} open={true}>
        {getSideSheetChildren()}
      </MaterialSideSheet>
    ),
    { wrapper: MaterialTheme }
  );

  return settleRender(baseElement, renderedAt);
};

const renderComponentWithActionButton = async (props: Omit<MaterialSideSheetProps, 'open' | 'actions'>) => {
  const renderedAt = performance.now();

  const { baseElement } = render(
    () => (
      <MaterialSideSheet {...props} open={true} actions={<MaterialButton variant="tonal">Action</MaterialButton>}>
        {getSideSheetChildren()}
      </MaterialSideSheet>
    ),
    { wrapper: MaterialTheme }
  );

  return settleRender(baseElement, renderedAt);
};

describe('MaterialSideSheet', () => {
  describe('Visual', () => {
    describe.each(['standard', 'modal'] satisfies MaterialSideSheetVariant[])('variant = $0', variant => {
      it('renders a sheet', async () => {
        const screen = await renderComponent({ variant, title: 'Title' });

        const sheet = screen.getByRole('complementary');
        await expect.element(sheet).toBeVisible();

        const content = screen.getByText('Side sheet');
        await expect.element(content).toBeVisible();

        await expect.element(sheet).toMatchScreenshot();
      });

      it('renders a sheet with actions', async () => {
        const screen = await renderComponentWithActionButton({ variant, title: 'Title' });

        const sheet = screen.getByRole('complementary');
        await expect.element(sheet).toBeVisible();

        await expect.element(sheet).toMatchScreenshot();
      });

      it('renders a sheet with a divider and actions', async () => {
        const screen = await renderComponentWithActionButton({ variant, title: 'Title', divider: true });

        const sheet = screen.getByRole('complementary');
        await expect.element(sheet).toBeVisible();

        await expect.element(sheet).toMatchScreenshot();
      });

      it('renders a sheet with a back and a close button', async () => {
        const screen = await renderComponent({ variant, title: 'Title', onClickBack: vi.fn(), onClickClose: vi.fn() });

        const sheet = screen.getByRole('complementary');
        await expect.element(sheet).toBeVisible();

        await expect.element(sheet).toMatchScreenshot();
      });
    });

    it('renders a modal sheet with a scrim', async () => {
      const screen = await renderComponent({ variant: 'modal', title: 'Title' });

      const sheet = screen.getByRole('complementary');
      await expect.element(sheet).toBeVisible();

      // Screenshot the dialog instead of the sheet: the scrim is painted by
      // the dialog's ::backdrop and only appears in its bounding box
      const dialog = screen.getByElement('dialog');
      await expect.element(dialog).toBeVisible();

      await expect.element(dialog).toMatchScreenshot();
    });
  });
});
