import type { FlowComponent } from 'solid-js';

import styles from './MaterialCarouselItemHolder.module.css';

export const MaterialCarouselItemHolder: FlowComponent = props => {
  return <div class={styles['container']}>{props.children}</div>;
};
