import type { FlowComponent } from 'solid-js';

import { MaterialCard } from '@solid-material/material/components/card';
import { MaterialIcon } from '@solid-material/material/components/icon';
import { Span } from '@solid-material/material/components/typography';

import styles from './Info.module.css';

import InfoIcon from '@solid-material/icons/400/outlined/info.svg';

export const Info: FlowComponent = props => {
  return (
    <div class={styles['info']}>
      <MaterialCard variant="filled" size="small">
        <div class={styles['body']}>
          <MaterialIcon size="small">
            <InfoIcon />
          </MaterialIcon>
          <Span role="label" size="large">
            {props.children}
          </Span>
        </div>
      </MaterialCard>
    </div>
  );
};
