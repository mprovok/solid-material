import '@material/web/tabs/primary-tab.js';
import '@material/web/tabs/secondary-tab.js';
import type { JSX, ParentComponent } from 'solid-js';

import { Show, children } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { MaterialIcon } from '../icon/MaterialIcon';

export type MaterialTabVariant = 'primary' | 'secondary';

export interface MaterialTabProps {
  variant: MaterialTabVariant;
  icon?: JSX.Element;
  ariaLabel?: string;
  ariaControls?: string;
  id?: string;

  // Only applies to tabs of variant `primary`
  inlineIcon?: boolean;
}

const MaterialPrimaryTab: ParentComponent<MaterialTabProps> = props => {
  const hasIcon = () => props.icon !== undefined;
  const tabChildren = children(() => props.children);

  return (
    <md-primary-tab
      bool:has-icon={hasIcon()}
      attr:icon-only={tabChildren() === undefined}
      attr:id={props.id}
      attr:aria-label={props.ariaLabel}
      attr:aria-controls={props.ariaControls}
      bool:inline-icon={props.inlineIcon}
    >
      <Show when={hasIcon()}>
        <MaterialIcon slot="icon">{props.icon}</MaterialIcon>
      </Show>
      {tabChildren()}
    </md-primary-tab>
  );
};

const MaterialSecondaryTab: ParentComponent<MaterialTabProps> = props => {
  const hasIcon = () => props.icon !== undefined;
  const tabChildren = children(() => props.children);

  return (
    <md-secondary-tab
      bool:has-icon={hasIcon()}
      attr:icon-only={tabChildren() === undefined}
      attr:id={props.id}
      attr:aria-label={props.ariaLabel}
      attr:aria-controls={props.ariaControls}
    >
      <Show when={hasIcon()}>
        <MaterialIcon slot="icon">{props.icon}</MaterialIcon>
      </Show>
      {tabChildren()}
    </md-secondary-tab>
  );
};

const tabs: Record<MaterialTabVariant, ParentComponent<MaterialTabProps>> = {
  primary: MaterialPrimaryTab,
  secondary: MaterialSecondaryTab
};

export const MaterialTab: ParentComponent<MaterialTabProps> = props => {
  return <Dynamic component={tabs[props.variant]} {...props} />;
};
