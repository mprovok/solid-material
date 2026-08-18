import type { FlowComponent } from 'solid-js';

import styles from './MaterialSearchResults.module.css';

export const MaterialSearchResults: FlowComponent = props => {
  return (
    <sm-search-results tabindex={-1} aria-live="polite" aria-atomic="true" class={styles['results']}>
      {props.children}
    </sm-search-results>
  );
};
