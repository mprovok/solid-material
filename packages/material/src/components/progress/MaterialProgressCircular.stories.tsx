import preview from '../../../.storybook/preview';

import { MaterialProgress } from './MaterialProgress';

const meta = preview.meta({
  title: 'Components/MaterialProgress/Circular',
  component: MaterialProgress,
  args: {
    ariaLabel: 'ARIA label of circular progress'
  }
});

export const Value = meta.story({
  args: {
    variant: 'circular',
    value: 0.5,
    maximum: 1
  }
});

export const Indeterminate = meta.story({
  args: {
    variant: 'circular',
    indeterminate: true
  }
});

export const FourColor = meta.story({
  args: {
    variant: 'circular',
    indeterminate: true,
    fourColor: true
  }
});

export const SizeSmall = meta.story({
  args: {
    variant: 'circular',
    size: 'small',
    indeterminate: true
  }
});

export const SizeMedium = meta.story({
  args: {
    variant: 'circular',
    size: 'medium',
    indeterminate: true
  }
});

export const SizeLarge = meta.story({
  args: {
    variant: 'circular',
    size: 'large',
    indeterminate: true
  }
});

export const SizeExtraLarge = meta.story({
  args: {
    variant: 'circular',
    size: 'extra-large',
    indeterminate: true
  }
});
