import type { Component } from 'solid-js';

import { For, Show, createSignal } from 'solid-js';
import { expect, fn, userEvent } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { H3 } from '../typography/Typography';

import type {
  MaterialButtonProps,
  MaterialButtonShape,
  MaterialButtonSize,
  MaterialButtonVariant
} from './MaterialButton';

import { MaterialButton } from './MaterialButton';

import ArrowForwardIcon from '@solidmaterial/icons/400/outlined/arrow_forward.svg';
import BatteryAndroidBoltIcon from '@solidmaterial/icons/400/outlined/battery_android_bolt.svg';
import EditFillIcon from '@solidmaterial/icons/400/outlined/edit-fill.svg';
import PauseFillIcon from '@solidmaterial/icons/400/outlined/pause-fill.svg';
import PlayArrowIcon from '@solidmaterial/icons/400/outlined/play_arrow.svg';

const meta = preview.meta({
  title: 'Buttons/MaterialButton',
  component: MaterialButton,
  args: { onClick: fn(), shape: undefined }
});

export const VariantFilled = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filled',
    children: 'Filled'
  }
});

export const VariantElevated = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'elevated',
    children: 'Elevated'
  }
});

export const VariantTonal = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'tonal',
    children: 'Tonal'
  }
});

export const VariantOutlined = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'outlined',
    children: 'Outlined'
  }
});

export const VariantText = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'text',
    children: 'Text'
  }
});

export const SizeExtraSmall = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'tonal',
    size: 'extra-small',
    children: 'Label'
  }
});

export const SizeSmall = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'tonal',
    size: 'small',
    children: 'Label'
  }
});

export const SizeMedium = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'tonal',
    size: 'medium',
    children: 'Label'
  }
});

export const SizeLarge = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'tonal',
    size: 'large',
    children: 'Label'
  }
});

export const SizeExtraLarge = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'tonal',
    size: 'extra-large',
    children: 'Label'
  }
});

const SIZES: MaterialButtonSize[] = ['extra-small', 'small', 'medium', 'large', 'extra-large'];

const VARIANTS: MaterialButtonVariant[] = ['elevated', 'filled', 'tonal', 'outlined'];

const SHAPES: MaterialButtonShape[] = ['round', 'square'];

const MaterialButtonVariantRenderer: Component<Omit<MaterialButtonProps, 'variant' | 'toggle'>> = args => (
  <div
    style={{
      display: 'grid',
      gap: '1rem',
      'grid-template-columns': 'repeat(4, 1fr)',
      'place-items': 'center'
    }}
  >
    <H3 role="body" size="large"></H3>
    <H3 role="body" size="large"></H3>
    <H3 role="body" size="large">
      Unselected
    </H3>
    <H3 role="body" size="large">
      Selected
    </H3>

    <For each={VARIANTS}>
      {variant => (
        <>
          <H3 role="body" size="large">
            {variant[0]?.toUpperCase()}
            {variant.slice(1)}
          </H3>
          <MaterialButton {...args} icon={<EditFillIcon />} variant={variant}>
            Button
          </MaterialButton>
          <MaterialButton {...args} icon={<EditFillIcon />} variant={variant} toggle={false}>
            Button
          </MaterialButton>
          <MaterialButton {...args} icon={<EditFillIcon />} variant={variant} toggle={true}>
            Button
          </MaterialButton>
        </>
      )}
    </For>

    <H3 role="body" size="large">
      Text
    </H3>
    <MaterialButton variant="text" icon={<EditFillIcon />}>
      Button
    </MaterialButton>
  </div>
);

const MaterialButtonSizeRenderer: Component<Omit<MaterialButtonProps, 'size' | 'variant'>> = args => (
  <div style={{ display: 'flex', gap: '1rem', 'flex-wrap': 'wrap', 'align-items': 'center' }}>
    <For each={SIZES}>
      {size => (
        <MaterialButton variant="tonal" {...args} size={size}>
          Button
        </MaterialButton>
      )}
    </For>
  </div>
);

const MaterialButtonShapeRenderer: Component<Omit<MaterialButtonProps, 'shape' | 'variant'>> = args => (
  <div
    style={{
      display: 'grid',
      gap: '1rem',
      'grid-template-columns': 'repeat(4, 1fr)',
      'place-items': 'center'
    }}
  >
    <H3 role="body" size="large"></H3>
    <H3 role="body" size="large"></H3>
    <H3 role="body" size="large">
      Unselected
    </H3>
    <H3 role="body" size="large">
      Selected
    </H3>

    <For each={SHAPES}>
      {shape => (
        <>
          <H3 role="body" size="large">
            {shape[0]?.toUpperCase()}
            {shape.slice(1)}
          </H3>
          <MaterialButton variant="tonal" {...args} shape={shape}>
            Button
          </MaterialButton>
          <MaterialButton variant="tonal" {...args} shape={shape} toggle={false}>
            Button
          </MaterialButton>
          <MaterialButton variant="tonal" {...args} shape={shape} toggle={true}>
            Button
          </MaterialButton>
        </>
      )}
    </For>
  </div>
);

export const Variant = meta.story({
  tags: ['!test'],
  globals: {
    backgrounds: {
      value: 'surface'
    }
  },
  render: () => <MaterialButtonVariantRenderer {...Variant.composed.args} />
});

export const Size = meta.story({
  tags: ['!test'],
  render: () => <MaterialButtonSizeRenderer {...Size.composed.args} />
});

export const Shape = meta.story({
  test: ['!test'],
  render: () => <MaterialButtonShapeRenderer {...Shape.composed.args} />
});

export const Toggle = meta.story({
  tags: ['!test'],
  render: () => {
    const [toggle, setToggle] = createSignal(false);

    return (
      <MaterialButton
        variant="tonal"
        size="medium"
        toggle={toggle()}
        icon={
          <Show when={toggle()} fallback={<PlayArrowIcon />}>
            <PauseFillIcon />
          </Show>
        }
        onClick={() => setToggle(t => !t)}
      >
        <Show when={toggle()} fallback="Play">
          Pause
        </Show>
      </MaterialButton>
    );
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button');

    await expect(button).toHaveTextContent('Play');

    await userEvent.click(button, { delay: 500 });

    await expect(button).toHaveTextContent('Pause');

    await userEvent.click(button, { delay: 500 });

    await expect(button).toHaveTextContent('Play');
  }
});

export const Icon = meta.story({
  args: {
    variant: 'tonal',
    icon: <BatteryAndroidBoltIcon />,
    children: 'Button'
  }
});

export const IconPosition = meta.story({
  args: {
    variant: 'tonal',
    icon: <ArrowForwardIcon />,
    iconPosition: 'end',
    children: 'Button'
  }
});

export const Link = meta.story({
  args: {
    variant: 'text',
    href: 'http://localhost:6006',
    target: '_blank',
    children: 'Link'
  }
});

export const DisabledFilled = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filled',
    disabled: true,
    children: 'Button'
  }
});

export const Disabled = meta.story({
  tags: ['!test'],
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', 'flex-wrap': 'wrap' }}>
      <For each={[...VARIANTS, 'text'] satisfies MaterialButtonVariant[]}>
        {variant => (
          <MaterialButton disabled variant={variant}>
            {variant[0]?.toUpperCase()}
            {variant.slice(1)}
          </MaterialButton>
        )}
      </For>
    </div>
  )
});
