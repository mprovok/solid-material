import preview from '../../../.storybook/preview';

import { MaterialSelect } from './MaterialSelect';

const meta = preview.meta({
  title: 'Controls/MaterialSelect',
  component: MaterialSelect,
  args: {
    variant: 'filled',
    ariaLabel: 'ARIA label for select'
  }
});

export const Example = meta.story({
  args: {
    variant: 'filled',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana', disabled: true },
      { label: 'Kiwi', value: 'kiwi' },
      { label: 'Pineapple', value: 'pineapple' }
    ],
    label: 'Fruit',
    value: 'kiwi',
    supportingText: 'Eat 2 pieces a day',
    ariaLabel: 'ARIA label for select'
  }
});

export const VariantFilled = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filled',
    options: [{ label: 'Item', value: 'item' }],
    value: 'item'
  }
});

export const VariantOutlined = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'outlined',
    options: [{ label: 'Item', value: 'item' }],
    value: 'item'
  }
});

export const Variant = meta.story({
  tags: ['!test'],
  render: () => (
    <div style={{ display: 'flex', 'flex-direction': 'row', gap: '1rem' }}>
      <MaterialSelect
        variant="filled"
        options={[{ label: 'Item', value: 'item' }]}
        value="item"
        ariaLabel="Filled select"
      />
      <MaterialSelect
        variant="outlined"
        options={[{ label: 'Item', value: 'item' }]}
        value="item"
        ariaLabel="Outlined select"
      />
    </div>
  )
});

export const Label = meta.story({
  args: {
    variant: 'filled',
    options: [],
    label: 'Label',
    ariaLabel: undefined
  }
});

export const SupportingText = meta.story({
  args: {
    variant: 'filled',
    options: [],
    supportingText: 'Supporting text'
  }
});

export const ErrorText = meta.story({
  args: {
    variant: 'filled',
    options: [{ label: 'Item', value: 'item' }],
    label: 'Label',
    showError: true,
    errorText: 'Error text'
  }
});

export const Disabled = meta.story({
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false
          }
        ]
      }
    }
  },
  args: {
    variant: 'filled',
    options: [{ label: 'Item', value: 'item' }],
    label: 'Label',
    disabled: true
  }
});

export const Required = meta.story({
  args: {
    variant: 'filled',
    options: [{ label: 'Item', value: 'item' }],
    label: 'Label',
    required: true
  }
});

export const NoAsterisk = meta.story({
  args: {
    variant: 'filled',
    options: [{ label: 'Item', value: 'item' }],
    label: 'Label',
    required: true,
    noAsterisk: true
  }
});
