import type { FlowComponent } from 'solid-js';

import { Span } from '@solidmaterial/material/components/typography';

import styles from './FixedWidthDigit.module.css';

export const FixedWidthDigit: FlowComponent = props => {
  return (
    <Span role="headline" size="small" class={styles['digit']}>
      {props.children}
    </Span>
  );
};
