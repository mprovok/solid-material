import { For } from 'solid-js';
import { createJSXDecorator } from 'storybook-solidjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import preview from '../../../../.storybook/preview';
import { MaterialIcon } from '../../../components/icon/MaterialIcon';
import { MaterialList } from '../../../components/list/MaterialList';
import { MaterialListItem } from '../../../components/list/MaterialListItem';
import { MaterialPane } from '../../pane/MaterialPane';

import { MaterialListDetailLayout } from './MaterialListDetailLayout';

import AccountCircleFill from '@solid-material/icons/400/outlined/account_circle-fill.svg';

const meta = preview.meta({
  title: 'Layouts/MaterialListDetailLayout',
  component: MaterialListDetailLayout,
  decorators: [
    createJSXDecorator(Story => (
      <div style={{ display: 'grid', height: '100vh' }}>
        <Story />
      </div>
    ))
  ],
  args: {
    dragHandleAriaLabel: 'Drag handle',
    children: (
      <>
        <MaterialPane>
          <aside style={{ 'min-height': '100%' }}>
            <MaterialList segmented={true}>
              <For each={Array.from({ length: 7 })}>
                {(_, index) => (
                  <MaterialListItem
                    start={
                      <MaterialIcon>
                        <AccountCircleFill />
                      </MaterialIcon>
                    }
                    overlineText="Overline text"
                    supportingText="Supporting text"
                    align="top"
                    onClick={fn()}
                  >
                    Label {index()}
                  </MaterialListItem>
                )}
              </For>
            </MaterialList>
          </aside>
        </MaterialPane>
        <MaterialPane>
          <main>Details</main>
        </MaterialPane>
      </>
    )
  },
  globals: {
    backgrounds: {
      value: 'surface-container'
    }
  },
  parameters: {
    docs: {
      story: {
        iframeHeight: '500px',
        inline: false
      }
    },
    layout: 'fullscreen'
  }
});

export const Example = meta.story({
  args: {
    selected: false
  },
  play: async ({ canvas, step }) => {
    const separator = await canvas.findByRole('separator');
    const button = within(separator).getByRole('presentation');

    separator.focus();

    await waitFor(async () => expect(separator).toHaveFocus());

    await expect(button).not.toHaveAttribute('data-active');

    await userEvent.keyboard('{Enter}', { delay: 250 });
    await expect(button).toHaveAttribute('data-active');

    await step('Hide left pane', async () => {
      await userEvent.keyboard('{ArrowLeft}', { delay: 250 });

      await expect(canvas.queryByRole('complementary')).toBeNull();
      await expect(canvas.getByRole('main')).toBeVisible();
    });

    await step('Show left pane', async () => {
      await userEvent.keyboard('{ArrowRight}', { delay: 250 });

      await expect(canvas.getByRole('complementary')).toBeVisible();
      await expect(canvas.getByRole('main')).toBeVisible();
    });

    await step('Hide right pane', async () => {
      await userEvent.keyboard('{ArrowRight}', { delay: 250 });
      await userEvent.keyboard('{ArrowRight}', { delay: 250 });

      await expect(canvas.getByRole('complementary')).toBeVisible();
      await expect(canvas.queryByRole('main')).toBeNull();
    });

    await userEvent.keyboard('{Enter}', { delay: 250 });
    await expect(button).not.toHaveAttribute('data-active');

    await step('Show both panes by centering separator', async () => {
      await userEvent.dblClick(separator);

      await expect(canvas.getByRole('complementary')).toBeVisible();
      await expect(canvas.getByRole('main')).toBeVisible();
    });
  }
});

export const NotSelectedOnMobile = meta.story({
  args: {
    selected: false
  },
  tags: ['!autodocs'],
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: false }
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('separator')).toBeNull();

    await expect(canvas.getByRole('complementary')).toBeVisible();
    await expect(canvas.queryByRole('main')).toBeNull();
  }
});

export const SelectedOnMobile = meta.story({
  args: {
    selected: true
  },
  tags: ['!autodocs'],
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: false }
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('separator')).toBeNull();

    await expect(canvas.queryByRole('complementary')).toBeNull();
    await expect(canvas.getByRole('main')).toBeVisible();
  }
});
