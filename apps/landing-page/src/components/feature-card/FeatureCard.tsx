import type { MaterialIconSvg } from '@solidmaterial/material/components/icon';
import type { FlowComponent } from 'solid-js';

import { dynamic } from '@solidjs/web';
import { MaterialCard, MaterialCardBody } from '@solidmaterial/material/components/card';
import { H2, Span } from '@solidmaterial/material/components/typography';

import styles from './FeatureCard.module.css';

export interface FeatureCardProps {
  title: string;
  icon: MaterialIconSvg;
}

export const FeatureCard: FlowComponent<FeatureCardProps> = props => {
  const Icon = dynamic(() => props.icon);

  return (
    <section class={styles['card']}>
      <MaterialCard variant="filled" size="large">
        <MaterialCardBody>
          <Icon />
          <H2 role="title" size="large">
            {props.title}
          </H2>
          <Span role="body" size="large">
            {props.children}
          </Span>
        </MaterialCardBody>
      </MaterialCard>
    </section>
  );
};
