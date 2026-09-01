import '@material/web/field/filled-field.js';
import '@material/web/field/outlined-field.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/textfield/outlined-text-field.js';
import type { JSX } from '@solidjs/web';
import type { ParentComponent } from 'solid-js';

import { TextField } from '@material/web/textfield/internal/text-field';
import { Dynamic } from '@solidjs/web';
import { Show } from 'solid-js';

import { MaterialIcon } from '../icon/MaterialIcon';

export type MaterialTextFieldVariant = 'filled' | 'outlined';

export type MaterialTextFieldType = 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | 'textarea';

export type MaterialTextFieldIconPosition = 'start' | 'end';

export interface MaterialTextFieldProps {
  variant: MaterialTextFieldVariant;
  type?: MaterialTextFieldType;

  icon?: JSX.Element;
  iconPosition?: MaterialTextFieldIconPosition;

  // Used if type = 'textarea'
  rows?: number;
  columns?: number;

  label?: string;
  placeholder?: string;
  value?: string;
  ariaLabel?: string;

  noAsterisk?: boolean;
  textDirection?: 'ltr' | 'rtl';

  // Used if type = 'email'
  multipleEmail?: boolean;

  // Used if type = 'number'
  noSpinner?: boolean;

  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  pattern?: string;

  id?: string;
  name?: string;
  autocomplete?: string;

  step?: number;
  minimum?: number;
  maximum?: number;

  minLength?: number;
  maxLength?: number;

  showError?: boolean;
  errorText?: string;
  prefixText?: string;
  suffixText?: string;
  supportingText?: string;

  onChange?: (name: string | undefined, value: string, event: Event) => void;
  onInput?: (name: string | undefined, event: InputEvent) => void;
}

const textFields: Record<MaterialTextFieldVariant, string> = {
  filled: 'md-filled-text-field',
  outlined: 'md-outlined-text-field'
};

export const MaterialTextField: ParentComponent<MaterialTextFieldProps> = props => {
  const onChange = (name: string | undefined, event: Event) => {
    if (event.target instanceof TextField) {
      props.onChange?.(name, event.target.value, event);
    }
  };

  const onInput = (name: string | undefined, event: InputEvent) => {
    props.onInput?.(name, event);
  };

  return (
    <Dynamic
      component={textFields[props.variant]}
      type={props.type}
      label={props.label}
      placeholder={props.placeholder}
      value={props.value}
      aria-label={props.ariaLabel}
      rows={props.rows}
      cols={props.columns}
      no-asterisk={props.noAsterisk}
      text-direction={props.textDirection}
      required={props.required}
      disabled={props.disabled}
      readonly={props.readOnly}
      multiple={props.multipleEmail}
      no-spinner={props.noSpinner}
      min={props.minimum}
      max={props.maximum}
      step={props.step}
      minlength={props.minLength}
      maxlength={props.maxLength}
      pattern={props.pattern}
      id={props.id}
      name={props.name}
      autocomplete={props.autocomplete ?? 'off'}
      error={props.showError}
      error-text={props.errorText}
      prefix-text={props.prefixText}
      suffix-text={props.suffixText}
      supporting-text={props.supportingText}
      has-leading-icon={props.icon !== undefined && props.iconPosition !== 'end'}
      has-trailing-icon={props.icon !== undefined && props.iconPosition === 'end'}
      onChange={[onChange, props.name]}
      onInput={[onInput, props.name]}
    >
      {props.children}
      <Show when={props.icon}>
        <MaterialIcon slot={props.iconPosition === 'end' ? 'trailing-icon' : 'leading-icon'}>{props.icon}</MaterialIcon>
      </Show>
    </Dynamic>
  );
};
