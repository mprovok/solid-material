import preview from '../../../.storybook/preview';

import { MaterialProgress } from './MaterialProgress';

const meta = preview.meta({
  title: 'Components/MaterialProgress/Linear',
  component: MaterialProgress,
  args: {
    ariaLabel: 'ARIA label of linear progress'
  }
});

export const Value = meta.story({
  args: {
    variant: 'linear',
    value: 0.5,
    maximum: 1
  }
});

export const Buffer = meta.story({
  args: {
    variant: 'linear',
    value: 0.6,
    buffer: 0.8,
    maximum: 1
  }
});

export const Indeterminate = meta.story({
  args: {
    variant: 'linear',
    indeterminate: true
  }
});

export const FourColor = meta.story({
  args: {
    variant: 'linear',
    indeterminate: true,
    fourColor: true
  }
});

export const SizeSmall = meta.story({
  args: {
    variant: 'linear',
    size: 'small',
    value: 0.5
  }
});

export const SizeMedium = meta.story({
  args: {
    variant: 'linear',
    size: 'medium',
    value: 0.5
  }
});

export const SizeLarge = meta.story({
  args: {
    variant: 'linear',
    size: 'large',
    indeterminate: true
  }
});

export const SizeExtraLarge = meta.story({
  args: {
    variant: 'linear',
    size: 'extra-large',
    indeterminate: true
  }
});
