import type { VoidComponent } from 'solid-js';

import { createSignal, createUniqueId } from 'solid-js';
import { expect, fn, userEvent } from 'storybook/test';

import preview from '../../../.storybook/preview';

import type { MaterialRadioProps } from './MaterialRadio';

import { MaterialRadio } from './MaterialRadio';

const meta = preview.meta({
  title: 'Controls/MaterialRadio',
  component: MaterialRadio,
  args: { onChange: fn() }
});

interface RadioButtonWithLabelProps {
  index: number;
  checkedValue: string | undefined;
  onChange: (name: string | undefined, value: string | undefined) => void;
}

const RadioButtonWithLabel: VoidComponent<RadioButtonWithLabelProps> = props => {
  const id = createUniqueId();

  const isChecked = () => props.checkedValue === `value-${props.index}`;

  return (
    <div style={{ display: 'flex', 'align-items': 'center' }}>
      <MaterialRadio
        name="radio-buttons"
        value={`value-${props.index}`}
        id={id}
        checked={isChecked()}
        onChange={props.onChange}
      />
      <label for={id}>{`Radio ${props.index} is ${isChecked() ? 'checked' : 'not checked'}`}</label>
    </div>
  );
};

const MaterialRadioStory: VoidComponent<MaterialRadioProps> = args => {
  const [checkedValue, setCheckedValue] = createSignal<string | undefined>();

  const onChange = (_name: string | undefined, value: string | undefined) => {
    setCheckedValue(value);
  };

  return (
    <div role="radiogroup" style={{ display: 'flex', 'flex-direction': 'column' }}>
      <RadioButtonWithLabel {...args} index={0} checkedValue={checkedValue()} onChange={onChange} />
      <RadioButtonWithLabel {...args} index={1} checkedValue={checkedValue()} onChange={onChange} />
      <RadioButtonWithLabel {...args} index={2} checkedValue={checkedValue()} onChange={onChange} />
    </div>
  );
};

export const Checked = meta.story({
  args: {
    checked: true
  }
});

export const Disabled = meta.story({
  args: {
    checked: false,
    disabled: true
  }
});

export const WithLabel = meta.story({
  render: MaterialRadioStory,
  play: async ({ canvas, step }) => {
    const button0 = canvas.getByLabelText('Radio 0 is not checked');
    const button1 = canvas.getByLabelText('Radio 1 is not checked');
    const button2 = canvas.getByLabelText('Radio 2 is not checked');

    await step('Render radio butons', async () => {
      await expect(button0).toHaveAccessibleName('Radio 0 is not checked');
      await expect(button1).toHaveAccessibleName('Radio 1 is not checked');
      await expect(button2).toHaveAccessibleName('Radio 2 is not checked');

      await expect(button0).not.toHaveAttribute('checked');
      await expect(button1).not.toHaveAttribute('checked');
      await expect(button2).not.toHaveAttribute('checked');
    });

    await step('Click on first radio buton', async () => {
      await userEvent.click(button0, { delay: 250 });

      await expect(button0).toHaveAccessibleName('Radio 0 is checked');
      await expect(button1).toHaveAccessibleName('Radio 1 is not checked');
      await expect(button2).toHaveAccessibleName('Radio 2 is not checked');

      await expect(button0).toHaveAttribute('checked');
      await expect(button1).not.toHaveAttribute('checked');
      await expect(button2).not.toHaveAttribute('checked');
    });

    await step('Click on second radio buton', async () => {
      await userEvent.click(button1, { delay: 250 });

      await expect(button0).toHaveAccessibleName('Radio 0 is not checked');
      await expect(button1).toHaveAccessibleName('Radio 1 is checked');
      await expect(button2).toHaveAccessibleName('Radio 2 is not checked');

      await expect(button0).not.toHaveAttribute('checked');
      await expect(button1).toHaveAttribute('checked');
      await expect(button2).not.toHaveAttribute('checked');
    });
  }
});
