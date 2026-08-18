import '@material/web/chips/assist-chip.js';
import '@material/web/chips/filter-chip.js';
import '@material/web/chips/input-chip.js';
import '@material/web/chips/suggestion-chip.js';
import type { FlowComponent, JSX } from 'solid-js';

import { Match, Show, Switch, createEffect, createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { MaterialIcon } from '../icon/MaterialIcon';

export type MaterialChipVariant = 'assist' | 'filter' | 'input' | 'suggestion';

export interface MaterialChipProps {
  variant: MaterialChipVariant;

  ariaLabel?: string;
  disabled?: boolean;
  alwaysFocusable?: boolean;
  icon?: JSX.Element;

  // Not used by filter chips
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';

  onClick?: (event: PointerEvent) => void;

  // Not used by input chips
  elevated?: boolean;

  // Used by filter chips only
  selectedIcon?: JSX.Element;

  // Used by input chips only
  avatar?: boolean;
  removeOnly?: boolean;

  // Used by filter and input chips
  selected?: boolean;
  onRemove?: (event: Event) => void;
}

interface LinkChipProps {
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

interface BaseChipProps {
  icon?: JSX.Element;
  ariaLabel?: string;
  disabled?: boolean;
  alwaysFocusable?: boolean;
  onUpdateFocus?: (event: Event) => void;
  onClick?: (event: PointerEvent) => void;
}

interface MaterialAssistChipProps extends BaseChipProps, LinkChipProps {
  elevated?: boolean;
}

interface MaterialSuggestionChipProps extends BaseChipProps, LinkChipProps {
  elevated?: boolean;
}

interface MaterialFilterChipProps extends BaseChipProps {
  selected?: boolean;
  selectedIcon?: JSX.Element;
  elevated?: boolean;
  onRemove?: (event: Event) => void;
}

interface MaterialInputChipProps extends BaseChipProps, LinkChipProps {
  selected?: boolean;
  avatar?: boolean;
  removeOnly?: boolean;
  onRemove?: (event: Event) => void;
}

/**
 * A chip which represents an action
 */
const MaterialAssistChip: FlowComponent<MaterialAssistChipProps> = props => {
  const hasIcon = () => props.icon !== undefined;

  return (
    <md-assist-chip
      attr:aria-label={props.ariaLabel}
      bool:disabled={props.disabled}
      bool:always-focusable={props.alwaysFocusable}
      bool:has-icon={hasIcon()}
      bool:elevated={props.elevated}
      attr:href={props.href}
      attr:target={props.target}
      on:update-focus={(event: Event) => props.onUpdateFocus?.(event)}
      onClick={(event: PointerEvent) => props.onClick?.(event)}
    >
      {props.children}
      <Show when={hasIcon()}>
        <MaterialIcon slot="icon">{props.icon}</MaterialIcon>
      </Show>
    </md-assist-chip>
  );
};

/**
 * A chip which is used to filter content
 *
 * Can be used as an alternative to toggle buttons and checkboxes.
 */
const MaterialFilterChip: FlowComponent<MaterialFilterChipProps> = props => {
  const [isSelected, setIsSelected] = createSignal(Boolean(props.selected));

  createEffect(() => {
    setIsSelected(Boolean(props.selected));
  });

  const hasIcon = () => props.icon !== undefined && !isSelected();
  const hasSelectedIcon = () => props.selectedIcon !== undefined && isSelected();

  const onClick = (event: PointerEvent) => {
    setIsSelected(value => !value);
    props.onClick?.(event);
  };

  return (
    <md-filter-chip
      attr:aria-label={props.ariaLabel}
      bool:disabled={props.disabled}
      bool:always-focusable={props.alwaysFocusable}
      bool:has-icon={hasIcon()}
      bool:selected={isSelected()}
      bool:has-selected-icon={hasSelectedIcon()}
      bool:elevated={props.elevated}
      bool:removable={props.onRemove !== undefined}
      on:remove={(event: Event) => props.onRemove?.(event)}
      onClick={onClick}
    >
      {props.children}
      <Switch>
        <Match when={hasIcon()}>
          <MaterialIcon slot="icon">{props.icon}</MaterialIcon>
        </Match>
        <Match when={hasSelectedIcon()}>
          <MaterialIcon slot="selected-icon">{props.selectedIcon}</MaterialIcon>
        </Match>
      </Switch>
    </md-filter-chip>
  );
};

/**
 * A chip which represents input from the user like options in a search bar
 */
const MaterialInputChip: FlowComponent<MaterialInputChipProps> = props => {
  const hasIcon = () => props.icon !== undefined;

  return (
    <md-input-chip
      attr:aria-label={props.ariaLabel}
      bool:disabled={props.disabled}
      bool:always-focusable={props.alwaysFocusable}
      bool:has-icon={hasIcon()}
      bool:selected={props.selected}
      bool:avatar={props.avatar}
      bool:remove-only={props.removeOnly}
      attr:href={props.href}
      attr:target={props.target}
      on:remove={(event: Event) => props.onRemove?.(event)}
      onClick={(event: PointerEvent) => props.removeOnly !== true && props.onClick?.(event)}
    >
      {props.children}
      <Show when={hasIcon()}>
        <MaterialIcon slot="icon">{props.icon}</MaterialIcon>
      </Show>
    </md-input-chip>
  );
};

/**
 * A chip used for dynamically generated suggestions
 */
const MaterialSuggestionChip: FlowComponent<MaterialSuggestionChipProps> = props => {
  const hasIcon = () => props.icon !== undefined;

  return (
    <md-suggestion-chip
      attr:aria-label={props.ariaLabel}
      bool:disabled={props.disabled}
      bool:always-focusable={props.alwaysFocusable}
      bool:has-icon={hasIcon()}
      bool:elevated={props.elevated}
      attr:href={props.href}
      attr:target={props.target}
      onClick={(event: PointerEvent) => props.onClick?.(event)}
    >
      {props.children}
      <Show when={hasIcon()}>
        <MaterialIcon slot="icon">{props.icon}</MaterialIcon>
      </Show>
    </md-suggestion-chip>
  );
};

const chips: Record<MaterialChipVariant, FlowComponent<MaterialChipProps>> = {
  assist: MaterialAssistChip,
  filter: MaterialFilterChip,
  input: MaterialInputChip,
  suggestion: MaterialSuggestionChip
};

export const MaterialChip: FlowComponent<MaterialChipProps> = props => {
  return <Dynamic component={chips[props.variant]} {...props} />;
};
