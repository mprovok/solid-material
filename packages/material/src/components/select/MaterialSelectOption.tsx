import '@material/web/select/select-option.js';
import type { ParentComponent } from 'solid-js';

export interface MaterialSelectOptionProps {
  value: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export const MaterialSelectOption: ParentComponent<MaterialSelectOptionProps> = props => {
  return (
    <md-select-option value={props.value} disabled={props.disabled} aria-label={props.ariaLabel}>
      {props.children}
    </md-select-option>
  );
};
