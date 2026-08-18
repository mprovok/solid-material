import type { VoidComponent } from 'solid-js';

import { MaterialCard, MaterialCardBody } from '@solid-material/material/components/card';
import { H2, H3, Span } from '@solid-material/material/components/typography';
import { Breakpoints } from '@solid-material/material/utils';
import { For, Show } from 'solid-js';

import { ExternalLink } from '../../../../components/external-link/ExternalLink';
import { UnorderedList } from '../../../../components/unordered-list/UnorderedList';

import styles from './SectionComponents.module.css';

export const SectionComponents: VoidComponent = () => {
  const isMobile = () => Breakpoints.isCompactWidth() || Breakpoints.isMediumWidth();

  return (
    <section>
      <div>
        <H2 role="display" size="small">
          Components
        </H2>
        <Span role="body" size="large">
          <UnorderedList>
            <li>
              <H3 role="title" size="large">
                Over 30+ <ExternalLink href="https://m3.material.io/components">components</ExternalLink> from M3
                Expressive
              </H3>
              <p>A few are not yet expressive (menus) or missing (date and time pickers).</p>
            </li>
            <li>
              <H3 role="title" size="large">
                Uses new CSS features like scroll-driven animations and anchor positioning
              </H3>
              <p>
                Components like the carousel and tooltip use CSS scroll-driven animations and anchor positioning to
                avoid JavaScript and limit the number of external dependencies to a minimum.
              </p>
              <p>
                In browsers which support it, some components like the snackbar and FAB menu make use of{' '}
                <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interpolate-size">
                  interpolate-size
                </ExternalLink>{' '}
                for slightly improved animations.
              </p>
            </li>
          </UnorderedList>
        </Span>
      </div>
      <Show when={!isMobile()}>
        <div class={styles['decorative-blocks']} aria-hidden="true">
          <For each={Array.from({ length: 9 })}>
            {_ => (
              <MaterialCard variant="filled" size="extra-large">
                <MaterialCardBody> </MaterialCardBody>
              </MaterialCard>
            )}
          </For>
        </div>
      </Show>
    </section>
  );
};
