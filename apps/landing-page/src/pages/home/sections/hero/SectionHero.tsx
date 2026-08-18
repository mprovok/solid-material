import type { VoidComponent } from 'solid-js';

import { MaterialButton } from '@solid-material/material/components/button';
import { MaterialCard } from '@solid-material/material/components/card';
import { H1, H2, Span } from '@solid-material/material/components/typography';
import { Breakpoints } from '@solid-material/material/utils';
import { Show } from 'solid-js';

/* Used as a social button to link to GitHub project (see https://brand.github.com/foundations/logo) */
import { ExternalLink } from '../../../../components/external-link/ExternalLink';

import { ComponentsGrid } from './components/ComponentsGrid';

import styles from './SectionHero.module.css';

export const SectionHero: VoidComponent = () => {
  const isMobile = () => Breakpoints.isCompactWidth() || Breakpoints.isCompactHeight();

  return (
    <div class={styles['hero']}>
      <MaterialCard variant="filled" size="extra-large">
        <div class={styles['hero-body']}>
          <div class={styles['left-column']}>
            <div class={styles['content']}>
              <H1 role="display" size={isMobile() ? 'medium' : 'large'}>
                Solid Material
              </H1>
              <H2 role="headline" size="small">
                Material 3 Expressive for SolidJS
              </H2>
              <Span role="body" size="large">
                Solid Material is a component library implementing the Material 3 Expressive spec using{' '}
                <ExternalLink href="https://www.solidjs.com/">SolidJS</ExternalLink>, a JavaScript framework for
                building user interfaces like React, but with fine-grained reactivity for better performance.
              </Span>
            </div>
            <MaterialButton variant="filled" size="large" href="/get-started">
              Get started
            </MaterialButton>
          </div>
          <Show when={!isMobile()}>
            <div class={styles['right-column']}>
              <ComponentsGrid />
            </div>
          </Show>
        </div>
      </MaterialCard>
    </div>
  );
};
