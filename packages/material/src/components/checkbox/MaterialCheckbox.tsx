import '@material/web/checkbox/checkbox.js';
import type { VoidComponent } from 'solid-js';

export interface MaterialCheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  inert?: boolean;

  ariaLabel?: string;
  id?: string;
  name?: string;

  onChange?: (checked: boolean, name: string | undefined) => void;
}

const isCheckbox = (target: EventTarget): target is HTMLInputElement => {
  return 'checked' in target;
};

export const MaterialCheckbox: VoidComponent<MaterialCheckboxProps> = props => {
  const onChange = (name: string | undefined, event: Event) => {
    if (event.target !== null && isCheckbox(event.target)) {
      props.onChange?.(event.target.checked, name);
    }
  };

  return (
    <md-checkbox
      aria-label={props.ariaLabel}
      touch-target="wrapper"
      id={props.id}
      name={props.name}
      checked={props.checked === true}
      indeterminate={props.checked === undefined}
      disabled={props.disabled}
      required={props.required}
      inert={props.inert}
      onChange={[onChange, props.name]}
    ></md-checkbox>
  );
};
