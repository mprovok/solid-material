import type { FlowComponent } from 'solid-js';

import { Span } from '../typography/Typography';

import styles from './MaterialPlainTooltip.module.css';

export const MaterialPlainTooltip: FlowComponent = props => {
  return (
    <sm-plain-tooltip role="tooltip" class={styles['tooltip']}>
      <Span role="body" size="medium">
        {props.children}
      </Span>
    </sm-plain-tooltip>
  );
};
