import '@material/web/radio/radio.js';
import type { VoidComponent } from 'solid-js';

export interface MaterialRadioProps {
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  inert?: boolean;

  value?: string;

  ariaLabel?: string;
  id?: string;
  name?: string;

  onChange?: (name: string | undefined, value: string | undefined) => void;
}

const isRadio = (target: EventTarget): target is HTMLInputElement => {
  return 'checked' in target;
};

export const MaterialRadio: VoidComponent<MaterialRadioProps> = props => {
  const onChange = ([name, value]: [string | undefined, string | undefined], event: Event) => {
    if (event.target !== null && isRadio(event.target)) {
      props.onChange?.(name, value);
    }
  };

  return (
    <md-radio
      aria-label={props.ariaLabel}
      touch-target="wrapper"
      id={props.id}
      name={props.name}
      value={props.value}
      checked={props.checked === true}
      disabled={props.disabled}
      required={props.required}
      inert={props.inert}
      onChange={[onChange, [props.name, props.value]]}
    ></md-radio>
  );
};
