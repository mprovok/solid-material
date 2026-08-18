import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';

import { MaterialSlider } from './MaterialSlider';

const meta = preview.meta({
  title: 'Controls/MaterialSlider',
  component: MaterialSlider,
  argTypes: {
    ticks: {
      type: 'boolean',
      if: { arg: 'step' }
    }
  } as Partial<typeof MaterialSlider>,
  args: { onChange: fn() }
});

export const Value = meta.story({
  args: {
    value: 40
  }
});

export const Labeled = meta.story({
  args: {
    value: 50,
    labeled: true
  }
});

export const Step = meta.story({
  args: {
    value: 60,
    step: 10,
    labeled: true
  }
});

export const Ticks = meta.story({
  args: {
    value: 70,
    step: 10,
    labeled: true,
    ticks: true
  }
});

export const Scale = meta.story({
  args: {
    value: 60,
    step: 1,
    scale: [40, 60],
    labeled: true
  }
});

export const Disabled = meta.story({
  args: {
    value: 50,
    labeled: true,
    disabled: true
  }
});

export const Range = meta.story({
  args: {
    value: [20, 80],
    step: 10,
    labeled: true
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-valid-attr',
            enabled: false
          },
          {
            id: 'tabindex',
            enabled: false
          }
        ]
      }
    }
  }
});

export const Label = meta.story({
  args: {
    value: 50,
    labeled: true,
    label: 'Value',
    ariaLabel: 'ARIA label for slider',
    ariaValueText: 'ARIA value text'
  }
});

export const RangeWithLabel = meta.story({
  args: {
    value: [20, 80],
    step: 10,
    labeled: true,
    label: ['Start', 'End'],
    ariaLabel: ['ARIA label for start of slider', 'ARIA label for end of slider'],
    ariaValueText: ['ARIA value text for start', 'ARIA value text for end']
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-valid-attr',
            enabled: false
          },
          {
            id: 'tabindex',
            enabled: false
          }
        ]
      }
    }
  }
});
