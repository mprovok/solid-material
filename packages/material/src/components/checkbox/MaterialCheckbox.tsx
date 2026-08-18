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
      attr:aria-label={props.ariaLabel}
      attr:touch-target="wrapper"
      attr:id={props.id}
      attr:name={props.name}
      bool:checked={props.checked === true}
      bool:indeterminate={props.checked === undefined}
      bool:disabled={props.disabled}
      bool:required={props.required}
      bool:inert={props.inert}
      onChange={[onChange, props.name]}
    ></md-checkbox>
  );
};
