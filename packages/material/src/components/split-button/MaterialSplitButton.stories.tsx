import { For } from 'solid-js';
import { fn } from 'storybook/test';

import type { MaterialButtonSize } from '../button/MaterialButton';

import preview from '../../../.storybook/preview';

import type { MaterialSplitButtonVariant } from './MaterialSplitButton';

import { MaterialSplitButton } from './MaterialSplitButton';

import EditIcon from '@solid-material/icons/400/outlined/edit.svg';

const meta = preview.meta({
  title: 'Buttons/MaterialSplitButton',
  component: MaterialSplitButton,
  args: {
    children: 'Label',
    open: false,
    onClick: fn(),
    onToggle: fn()
  }
});

const SIZES: MaterialButtonSize[] = ['extra-small', 'small', 'medium', 'large', 'extra-large'];

const VARIANTS: MaterialSplitButtonVariant[] = ['elevated', 'filled', 'tonal', 'outlined'];

export const Variant = meta.story({
  tags: ['!test'],
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '1rem', 'flex-direction': 'column' }}>
        <For each={VARIANTS}>
          {variant => (
            <MaterialSplitButton variant={variant} open={false} onClick={fn()} onToggle={fn()}>
              Label
            </MaterialSplitButton>
          )}
        </For>
      </div>
    );
  }
});

export const Size = meta.story({
  tags: ['!test'],
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '1rem', 'flex-direction': 'column' }}>
        <For each={SIZES}>
          {size => (
            <MaterialSplitButton variant="tonal" open={false} onClick={fn()} onToggle={fn()} size={size}>
              Label
            </MaterialSplitButton>
          )}
        </For>
      </div>
    );
  }
});

export const Closed = meta.story({
  args: {
    variant: 'tonal',
    size: 'medium'
  }
});

export const Open = meta.story({
  args: {
    variant: 'tonal',
    size: 'medium',
    open: true,
    disabled: false
  }
});

export const Icon = meta.story({
  args: {
    variant: 'tonal',
    size: 'medium',
    icon: <EditIcon />
  }
});

export const Disabled = meta.story({
  args: {
    variant: 'tonal',
    size: 'medium',
    disabled: true
  }
});
