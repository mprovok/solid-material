import type { FlowComponent } from 'solid-js';

import { Show, children, createMemo } from 'solid-js';

import styles from './TwoFlexiblePanesLayout.module.css';

export interface TwoFlexiblePanesLayoutProps {
  rounded?: boolean;
  margin: [number, number];
  class?: string | undefined;
}

export const TwoFlexiblePanesLayout: FlowComponent<TwoFlexiblePanesLayoutProps> = props => {
  const panes = children(() => props.children);
  const visiblePanesCount = createMemo(() => panes.toArray().filter(item => item !== undefined).length);

  return (
    <sm-body-layout
      attr:data-rounded={props.rounded}
      classList={{
        [styles['layout']!]: true,
        [props.class ?? '']: props.class !== undefined
      }}
      style={{
        'padding-inline-start': `${props.margin[0]}px`,
        'padding-inline-end': `${props.margin[1]}px`
      }}
    >
      <div class={styles['pane']}>{panes.toArray()[0]}</div>
      <Show when={visiblePanesCount() > 1}>
        <div class={styles['pane']}>{panes.toArray()[1]}</div>
      </Show>
    </sm-body-layout>
  );
};
