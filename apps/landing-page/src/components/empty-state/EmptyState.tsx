import type { JSX, VoidComponent } from 'solid-js';

import { MaterialIcon } from '@solidmaterial/material/components/icon';
import { H1, Span } from '@solidmaterial/material/components/typography';
import { Show } from 'solid-js';

import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  label: string;
  supportingText?: string;
  icon?: JSX.Element;
}

export const EmptyState: VoidComponent<EmptyStateProps> = props => {
  return (
    <main class={styles['container']}>
      <Show when={props.icon}>
        <MaterialIcon size="large">{props.icon}</MaterialIcon>
      </Show>
      <H1 role="headline" size="medium">
        {props.label}
      </H1>
      <Show when={props.supportingText}>
        <Span role="body" size="medium">
          {props.supportingText}
        </Span>
      </Show>
    </main>
  );
};
