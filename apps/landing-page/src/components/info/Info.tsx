import type { FlowComponent } from 'solid-js';

import { MaterialCard } from '@solidmaterial/material/components/card';
import { MaterialIcon } from '@solidmaterial/material/components/icon';
import { Span } from '@solidmaterial/material/components/typography';

import styles from './Info.module.css';

import InfoIcon from '@solidmaterial/icons/400/outlined/info.svg';

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
