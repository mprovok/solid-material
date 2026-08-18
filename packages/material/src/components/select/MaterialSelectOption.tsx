import '@material/web/select/select-option.js';
import type { ParentComponent } from 'solid-js';

export interface MaterialSelectOptionProps {
  value: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export const MaterialSelectOption: ParentComponent<MaterialSelectOptionProps> = props => {
  return (
    <md-select-option attr:value={props.value} bool:disabled={props.disabled} attr:aria-label={props.ariaLabel}>
      {props.children}
    </md-select-option>
  );
};
