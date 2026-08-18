import { For } from 'solid-js';
import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { H1, H2, H3 } from '../typography/Typography';

import type { MaterialCardSize, MaterialCardVariant } from './MaterialCard';

import { MaterialCard, MaterialCardBody } from './MaterialCard';

const meta = preview.meta({
  title: 'Components/MaterialCard',
  component: MaterialCard
});

const SIZES: MaterialCardSize[] = ['small', 'medium', 'large', 'extra-large'];

const VARIANTS: MaterialCardVariant[] = ['elevated', 'filled', 'outlined'];

export const Clickable = meta.story({
  args: {
    variant: 'elevated',
    children: <MaterialCardBody>Text</MaterialCardBody>,
    onClick: fn()
  }
});

export const VariantElevated = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'elevated',
    children: <MaterialCardBody>Text</MaterialCardBody>
  }
});

export const VariantFilled = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filled',
    children: <MaterialCardBody>Text</MaterialCardBody>
  }
});

export const VariantOutlined = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'outlined',
    children: <MaterialCardBody>Text</MaterialCardBody>
  }
});

export const Variant = meta.story({
  tags: ['!test'],
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', 'flex-direction': 'row' }}>
      <For each={VARIANTS}>
        {variant => (
          <MaterialCard variant={variant}>
            <MaterialCardBody>
              <H3 role="headline" size="small">
                Label
              </H3>
              <span>Lorem ipsum dolor sit amet.</span>
            </MaterialCardBody>
          </MaterialCard>
        )}
      </For>
    </div>
  )
});

export const SizeSmall = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filled',
    size: 'small',
    children: <MaterialCardBody>Text</MaterialCardBody>
  }
});

export const SizeMedium = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filled',
    size: 'medium',
    children: <MaterialCardBody>Text</MaterialCardBody>
  }
});

export const SizeLarge = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filled',
    size: 'large',
    children: <MaterialCardBody>Text</MaterialCardBody>
  }
});

export const SizeExtraLarge = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filled',
    size: 'extra-large',
    children: <MaterialCardBody>Text</MaterialCardBody>
  }
});

export const SizeDefault = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filled',
    children: <MaterialCardBody>Text</MaterialCardBody>
  }
});

export const Size = meta.story({
  tags: ['!test'],
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', 'flex-direction': 'column' }}>
      <For each={SIZES}>
        {size => (
          <MaterialCard variant="outlined" size={size}>
            <MaterialCardBody>
              <H3 role="headline" size="small">
                Label
              </H3>
              <span>Lorem ipsum dolor sit amet.</span>
            </MaterialCardBody>
          </MaterialCard>
        )}
      </For>
    </div>
  )
});

export const DisabledElevated = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'elevated',
    disabled: true,
    children: <MaterialCardBody>Text</MaterialCardBody>
  }
});

export const DisabledFilled = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filled',
    disabled: true,
    children: <MaterialCardBody>Text</MaterialCardBody>
  }
});

export const DisabledOutlined = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'outlined',
    disabled: true,
    children: <MaterialCardBody>Text</MaterialCardBody>
  }
});

export const Disabled = meta.story({
  tags: ['!test'],
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', 'flex-direction': 'row' }}>
      <MaterialCard variant="elevated" disabled>
        <MaterialCardBody>
          <H3 role="headline" size="small">
            Elevated
          </H3>
          <span>Lorem ipsum dolor sit amet.</span>
        </MaterialCardBody>
      </MaterialCard>
      <MaterialCard variant="filled" disabled>
        <MaterialCardBody>
          <H2 role="headline" size="small">
            Filled
          </H2>
          <span>Lorem ipsum dolor sit amet.</span>
        </MaterialCardBody>
      </MaterialCard>
      <MaterialCard variant="outlined" disabled>
        <MaterialCardBody>
          <H1 role="headline" size="small">
            Outlined
          </H1>
          <span>Lorem ipsum dolor sit amet.</span>
        </MaterialCardBody>
      </MaterialCard>
    </div>
  )
});
