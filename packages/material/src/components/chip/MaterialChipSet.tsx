import '@material/web/chips/chip-set.js';
import type { ParentComponent } from 'solid-js';

export interface MaterialChipSetProps {
  ariaLabel?: string;
}

/**
 * A component which shows one or more chips in a set
 */
export const MaterialChipSet: ParentComponent<MaterialChipSetProps> = props => {
  return <md-chip-set attr:aria-label={props.ariaLabel}>{props.children}</md-chip-set>;
};
