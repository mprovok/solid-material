import type { ParentComponent } from 'solid-js';

import styles from './MaterialPane.module.css';

export interface MaterialPaneProps {
  class?: string;
}

export const MaterialPane: ParentComponent<MaterialPaneProps> = props => {
  return (
    <sm-pane
      class={styles['pane']}
      classList={{
        [props.class ?? '']: props.class !== undefined
      }}
    >
      {props.children}
    </sm-pane>
  );
};
