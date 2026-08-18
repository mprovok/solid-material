import type { FlowComponent } from 'solid-js';

import styles from './UnorderedList.module.css';

export const UnorderedList: FlowComponent = props => {
  return <ul class={styles['list']}>{props.children}</ul>;
};
