import '@material/web/select/filled-select.js';
import '@material/web/select/outlined-select.js';
import type { FlowComponent, VoidComponent } from 'solid-js';

import { FilledSelect } from '@material/web/select/internal/filled-select';
import { OutlinedSelect } from '@material/web/select/internal/outlined-select';
import { createMediaQuery } from '@solid-primitives/media';
import { Index, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { MaterialSelectOption } from './MaterialSelectOption';

export type MaterialSelectVariant = 'filled' | 'outlined';

export type MaterialSelectOptionType = {
  label: string;
  value: string;
  disabled?: boolean;
  ariaLabel?: string;
};

export interface MaterialSelectProps {
  variant: MaterialSelectVariant;
  options: MaterialSelectOptionType[];

  id?: string;
  name?: string;

  label?: string;
  value?: string;

  showError?: boolean;
  errorText?: string;
  supportingText?: string;

  required?: boolean;
  disabled?: boolean;
  noAsterisk?: boolean;
  ariaLabel?: string;

  onChange?: (event: Event, value: string, name: string | undefined) => void;
}

interface MaterialSelectWithChildrenProps extends Omit<MaterialSelectProps, 'variant' | 'options'> {
  quick?: boolean;
}

const MaterialFilledSelect: FlowComponent<MaterialSelectWithChildrenProps> = props => {
  const onChange = (name: string | undefined, event: Event) => {
    if (event.target instanceof FilledSelect) {
      props.onChange?.(event, event.target.value, name);
    }
  };

  return (
    <md-filled-select
      attr:id={props.id}
      attr:name={props.name}
      attr:label={props.label}
      attr:value={props.value}
      bool:error={props.showError}
      attr:error-text={props.errorText}
      attr:supporting-text={props.supportingText}
      bool:required={props.required}
      bool:disabled={props.disabled}
      bool:quick={props.quick}
      bool:no-asterisk={props.noAsterisk}
      attr:aria-label={props.ariaLabel}
      onChange={[onChange, props.name]}
    >
      {props.children}
    </md-filled-select>
  );
};

const MaterialOutlinedSelect: FlowComponent<MaterialSelectWithChildrenProps> = props => {
  const onChange = (name: string | undefined, event: Event) => {
    if (event.target instanceof OutlinedSelect) {
      props.onChange?.(event, event.target.value, name);
    }
  };

  return (
    <md-outlined-select
      attr:id={props.id}
      attr:name={props.name}
      attr:label={props.label}
      attr:value={props.value}
      bool:error={props.showError}
      attr:error-text={props.errorText}
      attr:supporting-text={props.supportingText}
      bool:required={props.required}
      bool:disabled={props.disabled}
      bool:quick={props.quick}
      bool:no-asterisk={props.noAsterisk}
      attr:aria-label={props.ariaLabel}
      onChange={[onChange, props.name]}
    >
      {props.children}
    </md-outlined-select>
  );
};

const selects: Record<MaterialSelectVariant, FlowComponent<MaterialSelectWithChildrenProps>> = {
  filled: MaterialFilledSelect,
  outlined: MaterialOutlinedSelect
};

export const MaterialSelect: VoidComponent<MaterialSelectProps> = props => {
  const [localProps, otherProps] = splitProps(props, ['variant', 'options']);

  const prefersReducedMotion = createMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <Dynamic component={selects[localProps.variant]} {...otherProps} quick={prefersReducedMotion()}>
      <Index each={localProps.options}>
        {option => (
          <MaterialSelectOption value={option().value} disabled={option().disabled} ariaLabel={option().ariaLabel}>
            {option().label}
          </MaterialSelectOption>
        )}
      </Index>
    </Dynamic>
  );
};
