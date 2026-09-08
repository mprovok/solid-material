import type { VoidComponent } from 'solid-js';

import { createSignal, createUniqueId } from 'solid-js';
import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';

import type { MaterialCheckboxProps } from './MaterialCheckbox';

import { MaterialCheckbox } from './MaterialCheckbox';

const meta = preview.meta({
  title: 'Controls/MaterialCheckbox',
  component: MaterialCheckbox,
  args: {
    ariaLabel: 'ARIA label of switch',
    onChange: fn()
  }
});

const MaterialCheckboxStory: VoidComponent<MaterialCheckboxProps> = args => {
  const [isChecked, setIsChecked] = createSignal(false);
  const id = createUniqueId();

  const onChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  return (
    <label style={{ display: 'flex', 'align-items': 'center' }}>
      <MaterialCheckbox {...args} id={id} onChange={onChange} />
      {`Checkbox is ${isChecked() ? 'checked' : 'not checked'}`}
    </label>
  );
};

export const Example = meta.story({
  args: {
    checked: false
  }
});

export const Indeterminate = meta.story({
  args: {
    checked: undefined
  }
});

export const Disabled = meta.story({
  args: {
    checked: true,
    disabled: true
  }
});

export const WithLabel = meta.story({
  args: {
    ariaLabel: undefined,
    checked: false
  },
  render: MaterialCheckboxStory
});
