import type { VoidComponent } from 'solid-js';

import { createSignal } from 'solid-js';
import { expect, fn, userEvent } from 'storybook/test';

import preview from '../../../.storybook/preview';

import type { MaterialSwitchProps } from './MaterialSwitch';

import { MaterialSwitch } from './MaterialSwitch';

const meta = preview.meta({
  title: 'Controls/MaterialSwitch',
  component: MaterialSwitch,
  args: {
    ariaLabel: 'ARIA label of switch',
    onChange: fn()
  }
});

const MaterialSwitchStory: VoidComponent<MaterialSwitchProps> = args => {
  const [isChecked, setIsChecked] = createSignal(Boolean(args.selected));

  const onChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  return (
    <label style={{ display: 'flex', 'align-items': 'center', gap: '1rem' }}>
      <MaterialSwitch {...args} onChange={onChange} />
      {`Switch is ${isChecked() ? 'checked' : 'not checked'}`}
    </label>
  );
};

export const Example = meta.story({
  args: {
    selected: true
  },
  render: MaterialSwitchStory
});

export const Icons = meta.story({
  args: {
    selected: false,
    icons: true
  }
});

export const OnlySelectedIcon = meta.story({
  args: {
    selected: false,
    icons: true,
    showOnlySelectedIcon: true
  }
});

export const Disabled = meta.story({
  args: {
    selected: true,
    icons: true,
    disabled: true
  }
});

export const Required = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    selected: false,
    icons: true,
    required: true
  }
});

export const WithLabel = meta.story({
  args: {
    ariaLabel: undefined,
    selected: false
  },
  render: MaterialSwitchStory,
  play: async ({ canvas }) => {
    const button = canvas.getByLabelText('Switch is not checked');

    await expect(button).toHaveAccessibleName('Switch is not checked');

    await userEvent.click(button, { delay: 250 });

    await expect(button).toHaveAccessibleName('Switch is checked');

    await userEvent.click(button, { delay: 250 });

    await expect(button).toHaveAccessibleName('Switch is not checked');
  }
});
