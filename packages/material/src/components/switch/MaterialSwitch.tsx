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
      attr:aria-label={props.ariaLabel}
      attr:id={props.id}
      attr:name={props.name}
      bool:selected={props.selected}
      bool:icons={props.icons}
      bool:show-only-selected-icon={props.icons === true && props.showOnlySelectedIcon}
      bool:disabled={props.disabled}
      bool:required={props.required}
      onChange={[onChange, props.name]}
    ></md-switch>
  );
};
