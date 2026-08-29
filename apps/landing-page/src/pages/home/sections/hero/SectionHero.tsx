import type { VoidComponent } from 'solid-js';

import { MaterialButton } from '@solidmaterial/material/components/button';
import { MaterialCard } from '@solidmaterial/material/components/card';
import { H1, H2, Span } from '@solidmaterial/material/components/typography';

/* Used as a social button to link to GitHub project (see https://brand.github.com/foundations/logo) */
import { ExternalLink } from '../../../../components/external-link/ExternalLink';

import { ComponentsGrid } from './components/ComponentsGrid';

import styles from './SectionHero.module.css';

export const SectionHero: VoidComponent = () => {
  return (
    <div class={styles['hero']}>
      <MaterialCard variant="filled" size="extra-large">
        <div class={styles['hero-body']}>
          <div class={styles['left-column']}>
            <div class={styles['content']}>
              <H2 role="title" size="small">
                Material 3 Expressive for SolidJS
              </H2>
              <H1 role="display" size="large">
                Solid Material
              </H1>
              <Span role="body" size="large">
                Solid Material is a component library implementing the Material 3 Expressive spec using{' '}
                <ExternalLink href="https://www.solidjs.com/">SolidJS</ExternalLink>, a JavaScript framework for
                building user interfaces like React, but with fine-grained reactivity for better performance.
              </Span>
            </div>
            <MaterialButton variant="filled" size="large" href="/get-started" transition="top-level">
              Get started
            </MaterialButton>
          </div>
          <div class={styles['right-column']}>
            <ComponentsGrid />
          </div>
        </div>
      </MaterialCard>
    </div>
  );
};
