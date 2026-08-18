import '@material/web/field/filled-field.js';
import '@material/web/field/outlined-field.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/textfield/outlined-text-field.js';
import type { JSX, ParentComponent } from 'solid-js';

import { TextField } from '@material/web/textfield/internal/text-field';
import { Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

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

const MaterialFilledTextField: ParentComponent<MaterialTextFieldProps> = props => {
  const onChange = (name: string | undefined, event: Event) => {
    if (event.target instanceof TextField) {
      props.onChange?.(name, event.target.value, event);
    }
  };

  const onInput = (name: string | undefined, event: InputEvent) => {
    props.onInput?.(name, event);
  };

  return (
    <md-filled-text-field
      attr:type={props.type}
      attr:label={props.label}
      attr:placeholder={props.placeholder}
      attr:value={props.value}
      attr:aria-label={props.ariaLabel}
      attr:rows={props.rows}
      attr:cols={props.columns}
      bool:no-asterisk={props.noAsterisk}
      attr:text-direction={props.textDirection}
      bool:required={props.required}
      bool:disabled={props.disabled}
      bool:readonly={props.readOnly}
      bool:multiple={props.multipleEmail}
      bool:no-spinner={props.noSpinner}
      attr:min={props.minimum}
      attr:max={props.maximum}
      attr:step={props.step}
      attr:minlength={props.minLength}
      attr:maxlength={props.maxLength}
      attr:pattern={props.pattern}
      attr:id={props.id}
      attr:name={props.name}
      attr:autocomplete={props.autocomplete ?? 'off'}
      bool:error={props.showError}
      attr:error-text={props.errorText}
      attr:prefix-text={props.prefixText}
      attr:suffix-text={props.suffixText}
      attr:supporting-text={props.supportingText}
      bool:has-leading-icon={props.icon !== undefined && props.iconPosition !== 'end'}
      bool:has-trailing-icon={props.icon !== undefined && props.iconPosition === 'end'}
      onChange={[onChange, props.name]}
      onInput={[onInput, props.name]}
    >
      {props.children}
      <Show when={props.icon}>
        <MaterialIcon slot={props.iconPosition === 'end' ? 'trailing-icon' : 'leading-icon'}>{props.icon}</MaterialIcon>
      </Show>
    </md-filled-text-field>
  );
};

const MaterialOutlinedTextField: ParentComponent<MaterialTextFieldProps> = props => {
  const onChange = (name: string | undefined, event: Event) => {
    if (event.target instanceof TextField) {
      props.onChange?.(name, event.target.value, event);
    }
  };

  const onInput = (name: string | undefined, event: InputEvent) => {
    props.onInput?.(name, event);
  };

  return (
    <md-outlined-text-field
      attr:type={props.type}
      attr:label={props.label}
      attr:placeholder={props.placeholder}
      attr:value={props.value}
      attr:aria-label={props.ariaLabel}
      attr:rows={props.rows}
      attr:cols={props.columns}
      bool:no-asterisk={props.noAsterisk}
      attr:text-direction={props.textDirection}
      bool:required={props.required}
      bool:disabled={props.disabled}
      bool:readonly={props.readOnly}
      bool:multiple={props.multipleEmail}
      bool:no-spinner={props.noSpinner}
      attr:min={props.minimum}
      attr:max={props.maximum}
      attr:step={props.step}
      attr:minlength={props.minLength}
      attr:maxlength={props.maxLength}
      attr:pattern={props.pattern}
      attr:id={props.id}
      attr:name={props.name}
      attr:autocomplete={props.autocomplete ?? 'off'}
      bool:error={props.showError}
      attr:error-text={props.errorText}
      attr:prefix-text={props.prefixText}
      attr:suffix-text={props.suffixText}
      attr:supporting-text={props.supportingText}
      bool:has-leading-icon={props.icon !== undefined && props.iconPosition !== 'end'}
      bool:has-trailing-icon={props.icon !== undefined && props.iconPosition === 'end'}
      onChange={[onChange, props.name]}
      onInput={[onInput, props.name]}
    >
      {props.children}
      <Show when={props.icon}>
        <MaterialIcon slot={props.iconPosition === 'end' ? 'trailing-icon' : 'leading-icon'}>{props.icon}</MaterialIcon>
      </Show>
    </md-outlined-text-field>
  );
};

const textFields: Record<MaterialTextFieldVariant, ParentComponent<MaterialTextFieldProps>> = {
  filled: MaterialFilledTextField,
  outlined: MaterialOutlinedTextField
};

export const MaterialTextField: ParentComponent<MaterialTextFieldProps> = props => {
  return <Dynamic component={textFields[props.variant]} {...props} />;
};
