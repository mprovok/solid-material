import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';

import { MaterialPasswordField } from './MaterialPasswordField';

const meta = preview.meta({
  title: 'Controls/MaterialPasswordField',
  component: MaterialPasswordField,
  args: { onChange: fn(), onInput: fn() }
});

export const Example = meta.story({
  args: {
    variant: 'filled',
    label: 'Password'
  }
});
