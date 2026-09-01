import type { JSX } from '@solidjs/web';
import type { MaterialButtonProps } from '@solidmaterial/material/components/button';
import type { FlowProps, VoidComponent } from 'solid-js';

import { MaterialButton } from '@solidmaterial/material/components/button';
import { MaterialIcon } from '@solidmaterial/material/components/icon';
import { H1, Span } from '@solidmaterial/material/components/typography';
import { Show } from 'solid-js';

import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  label: string;
  supportingText?: string;
  icon?: JSX.Element;
  action?: FlowProps<MaterialButtonProps>;
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
      <Show when={props.action}>{action => <MaterialButton {...action()} />}</Show>
    </main>
  );
};
