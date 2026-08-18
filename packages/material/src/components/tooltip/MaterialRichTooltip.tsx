import type { FlowComponent, JSX } from 'solid-js';

import { Show } from 'solid-js';

import { H4, Span } from '../typography/Typography';

import styles from './MaterialRichTooltip.module.css';

export interface MaterialRichTooltipProps {
  title?: string;
  actions?: JSX.Element;
}

export const MaterialRichTooltip: FlowComponent<MaterialRichTooltipProps> = props => (
  <sm-rich-tooltip role="tooltip" class={styles['tooltip']}>
    <md-elevation></md-elevation>
    <div class={styles['body']}>
      <Show when={props.title !== undefined}>
        <H4 role="label" size="large">
          {props.title}
        </H4>
      </Show>
      <Span role="body" size="medium">
        {props.children}
      </Span>
    </div>
    <Show when={props.actions !== undefined}>
      <div class={styles['buttons']}>{props.actions}</div>
    </Show>
  </sm-rich-tooltip>
);
