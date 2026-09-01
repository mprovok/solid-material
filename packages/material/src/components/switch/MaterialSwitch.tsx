import '@material/web/switch/switch.js';
import type { VoidComponent } from 'solid-js';

export interface MaterialSwitchProps {
  selected?: boolean;
  icons?: boolean;
  showOnlySelectedIcon?: boolean;

  disabled?: boolean;
  required?: boolean;

  ariaLabel?: string;
  id?: string;
  name?: string;

  onChange?: (checked: boolean, name: string | undefined) => void;
}

const hasShadowRoot = (target: EventTarget): target is Element => {
  return 'shadowRoot' in target;
};

export const MaterialSwitch: VoidComponent<MaterialSwitchProps> = props => {
  const onChange = (name: string | undefined, event: Event) => {
    if (event.target !== null && hasShadowRoot(event.target)) {
      const input = event.target.shadowRoot?.querySelector('input');
      props.onChange?.(input?.checked === true, name);
    }
  };

  return (
    <md-switch
      aria-label={props.ariaLabel}
      id={props.id}
      name={props.name}
      selected={props.selected}
      icons={props.icons}
      show-only-selected-icon={props.icons === true && props.showOnlySelectedIcon}
      disabled={props.disabled}
      required={props.required}
      onChange={[onChange, props.name]}
    ></md-switch>
  );
};
