import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';

import { MaterialTextField } from './MaterialTextField';

const meta = preview.meta({
  title: 'Controls/MaterialTextField',
  component: MaterialTextField,
  argTypes: {
    step: {
      table: {
        category: 'type-dependent'
      },
      if: { arg: 'type', eq: 'number' }
    },
    minimum: {
      table: {
        category: 'type-dependent'
      },
      if: { arg: 'type', eq: 'number' }
    },
    maximum: {
      table: {
        category: 'type-dependent'
      },
      if: { arg: 'type', eq: 'number' }
    },
    minLength: {
      table: {
        category: 'type-dependent'
      },
      if: { arg: 'type', neq: 'number' }
    },
    maxLength: {
      table: {
        category: 'type-dependent'
      },
      if: { arg: 'type', neq: 'number' }
    },
    rows: {
      table: {
        category: 'type-dependent'
      },
      if: { arg: 'type', eq: 'textarea' }
    },
    columns: {
      table: {
        category: 'type-dependent'
      },
      if: { arg: 'type', eq: 'textarea' }
    },
    multipleEmail: {
      table: {
        category: 'type-dependent'
      },
      if: { arg: 'type', eq: 'email' }
    },
    noSpinner: {
      table: {
        category: 'type-dependent'
      },
      if: { arg: 'type', eq: 'number' }
    }
  } as Partial<typeof MaterialTextField>,
  args: { onChange: fn(), onInput: fn() }
});

export const Label = meta.story({
  args: {
    variant: 'filled',
    label: 'Label'
  }
});

export const Value = meta.story({
  args: {
    variant: 'filled',
    label: 'Label',
    value: 'Value'
  }
});

export const Placeholder = meta.story({
  args: {
    variant: 'filled',
    placeholder: 'Placeholder',
    ariaLabel: 'Text field with placeholder'
  }
});

export const PrefixAndSuffixText = meta.story({
  args: {
    variant: 'filled',
    label: 'Prefix and suffix',
    pattern: 'd+',
    prefixText: '€',
    suffixText: '.00',
    errorText: 'Only digits allowed'
  }
});

export const ErrorText = meta.story({
  args: {
    variant: 'outlined',
    label: 'Error',
    showError: true,
    errorText: 'This field is invalid'
  }
});

export const SupportingText = meta.story({
  args: {
    variant: 'filled',
    label: 'Label',
    supportingText: 'Supporting text'
  }
});

export const MinimumAndMaximum = meta.story({
  args: {
    variant: 'filled',
    label: 'Number',
    type: 'number',
    minimum: 0,
    maximum: 10,
    step: 2,
    supportingText: 'A number between 0 and 10 with a step size of 2'
  }
});

export const MinimumAndMaximumLength = meta.story({
  args: {
    variant: 'filled',
    label: 'Minimum and maximum length',
    minLength: 5,
    maxLength: 10,
    supportingText: 'A length between 5 and 10'
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
    label: 'Disabled',
    disabled: true
  }
});

export const Required = meta.story({
  args: {
    variant: 'filled',
    label: 'Required',
    required: true
  }
});

export const ReadOnly = meta.story({
  args: {
    variant: 'filled',
    label: 'Read only',
    readOnly: true,
    value: 'Not editable'
  }
});

export const VariantFilled = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filled',
    ariaLabel: 'Filled text field'
  }
});

export const VariantOutlined = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'outlined',
    ariaLabel: 'Outlined text field'
  }
});

export const Variant = meta.story({
  tags: ['!test'],
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', 'flex-wrap': 'wrap' }}>
      <MaterialTextField variant="filled" label="Filled" ariaLabel="Filled text field" />
      <MaterialTextField variant="outlined" label="Outlined" ariaLabel="Outlined text field" />
    </div>
  )
});

export const TypePassword = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'outlined',
    type: 'password',
    label: 'Label'
  }
});

export const TypeUrl = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'outlined',
    type: 'url',
    label: 'Label'
  }
});

export const TypeSearch = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'outlined',
    type: 'search',
    label: 'Label'
  }
});

export const TypeTel = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'outlined',
    type: 'tel',
    label: 'Label'
  }
});

export const TypeEmail = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'outlined',
    type: 'email',
    label: 'Label'
  }
});

export const Type = meta.story({
  tags: ['!test'],
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', 'flex-direction': 'column' }}>
      <MaterialTextField variant="outlined" label="Password" type="password" />
      <MaterialTextField variant="outlined" label="URL" type="url" />
      <MaterialTextField variant="outlined" label="Search" type="search" />
      <MaterialTextField variant="outlined" label="Telephone" type="tel" />
      <MaterialTextField variant="outlined" label="Email" type="email" />
      <div>
        <MaterialTextField
          variant="outlined"
          label="Textarea"
          type="textarea"
          rows={5}
          columns={10}
          value="12345678902345678901345678901245678901235678901234"
        />
      </div>
    </div>
  )
});
