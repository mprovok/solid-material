import type { ParentComponent } from 'solid-js';

import styles from './MaterialPane.module.css';

export interface MaterialPaneProps {
  class?: string;
}

export const MaterialPane: ParentComponent<MaterialPaneProps> = props => {
  return <sm-pane class={[styles['pane'], props.class]}>{props.children}</sm-pane>;
};
