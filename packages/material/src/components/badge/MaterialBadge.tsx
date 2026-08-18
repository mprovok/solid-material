import type { FlowComponent } from 'solid-js';

import { Show } from 'solid-js';

import { Span } from '../typography/Typography';

import { getBadgeValue } from './internal/badge';

import styles from './MaterialBadge.module.css';

export interface MaterialBadgeProps {
  value?: string | number;
  ariaLabel?: string;
}

export const MaterialBadge: FlowComponent<MaterialBadgeProps> = props => {
  const value = () => getBadgeValue(props.value);

  return (
    <Show when={props.value !== undefined} fallback={props.children}>
      <div class={styles['container']}>
        {props.children}
        <sm-badge aria-label={props.ariaLabel} class={styles['badge']}>
          <Show when={value()}>
            <Span role="label" size="small">
              {value()}
            </Span>
          </Show>
        </sm-badge>
      </div>
    </Show>
  );
};
