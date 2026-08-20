import type { Component } from 'solid-js';

import { expect, userEvent, waitFor } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { MaterialButton } from '../button/MaterialButton';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';

import { MaterialPlainTooltip } from './MaterialPlainTooltip';
import { MaterialRichTooltip } from './MaterialRichTooltip';
import { MaterialTooltip } from './MaterialTooltip';

import FormatColorFillIcon from '@solidmaterial/icons/400/outlined/format_color_fill.svg';

const meta = preview.meta({
  title: 'Components/MaterialTooltip',
  component: MaterialTooltip
});

const RichTooltip: Component = () => (
  <MaterialRichTooltip
    title="Rich tooltip"
    actions={
      <>
        <MaterialButton variant="text">Action 1</MaterialButton>
        <MaterialButton variant="text">Action 2</MaterialButton>
      </>
    }
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua.
  </MaterialRichTooltip>
);

export const Plain = meta.story({
  args: {
    variant: 'plain',
    children: <MaterialIconButton variant="tonal" icon={<FormatColorFillIcon />} />,
    tooltip: <MaterialPlainTooltip>Plain tooltip</MaterialPlainTooltip>
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button');

    await expect(canvas.queryByRole('tooltip')).toBeNull();

    await userEvent.hover(button);

    await waitFor(async () => expect(canvas.getByRole('tooltip')).toBeVisible());

    await userEvent.unhover(button);

    await waitFor(async () => expect(canvas.queryByRole('tooltip')).toBeNull(), { timeout: 2_500 });
  }
});

export const Rich = meta.story({
  args: {
    variant: 'rich',
    children: <MaterialIconButton variant="tonal" icon={<FormatColorFillIcon />} />,
    tooltip: <RichTooltip />
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button');

    await expect(canvas.queryByRole('tooltip')).toBeNull();

    await userEvent.hover(button);

    await waitFor(async () => expect(canvas.getByRole('tooltip')).toBeVisible());

    await userEvent.unhover(button);

    await waitFor(async () => expect(canvas.queryByRole('tooltip')).toBeNull(), { timeout: 2_500 });
  }
});

export const PersistentOnClick = meta.story({
  args: {
    variant: 'rich',
    persistent: 'click',
    children: <MaterialIconButton variant="tonal" icon={<FormatColorFillIcon />} />,
    tooltip: <RichTooltip />
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button');

    await expect(canvas.queryByRole('tooltip')).toBeNull();

    await userEvent.click(button);

    await waitFor(async () => expect(canvas.getByRole('tooltip')).toBeVisible());

    await userEvent.tab();

    await waitFor(async () => expect(canvas.getByRole('button', { name: 'Action 1' })).toHaveFocus());

    await userEvent.tab({ shift: true });
    await userEvent.tab({ shift: true });

    await waitFor(async () => expect(canvas.queryByRole('tooltip')).toBeNull());
  }
});

export const PersistentOnMount = meta.story({
  args: {
    variant: 'rich',
    persistent: 'mount',
    children: <MaterialIconButton variant="tonal" icon={<FormatColorFillIcon />} />,
    tooltip: <RichTooltip />
  }
});
