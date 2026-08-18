import type { VoidComponent } from 'solid-js';

import { MaterialCard, MaterialCardBody } from '@solid-material/material/components/card';
import { H2, H3, Span } from '@solid-material/material/components/typography';
import { Breakpoints } from '@solid-material/material/utils';
import { Show } from 'solid-js';

import { ExternalLink } from '../../../../components/external-link/ExternalLink';
import { UnorderedList } from '../../../../components/unordered-list/UnorderedList';

import styles from './SectionLayouts.module.css';

export const SectionLayouts: VoidComponent = () => {
  const isMobile = () => Breakpoints.isCompactWidth() || Breakpoints.isMediumWidth();

  return (
    <section>
      <Show when={!isMobile()}>
        <div class={styles['decorative-panes']} aria-hidden="true">
          <MaterialCard variant="filled" size="extra-large">
            <MaterialCardBody> </MaterialCardBody>
          </MaterialCard>
          <MaterialCard variant="filled" size="extra-large">
            <MaterialCardBody> </MaterialCardBody>
          </MaterialCard>
        </div>
      </Show>
      <div>
        <H2 role="display" size="small">
          Layouts
        </H2>
        <Span role="body" size="large">
          <UnorderedList>
            <li>
              <H3 role="title" size="large">
                Scaffolding
              </H3>
              <UnorderedList>
                <li>
                  <code>MaterialNavigationLayout</code> component to display a navigation rail or bar depending on the
                  window size and the number of items.
                </li>
                <li>
                  <code>MaterialBodyLayout</code> and <code>MaterialPane</code> to display layouts with one or two{' '}
                  <ExternalLink href="https://m3.material.io/foundations/layout/scaffold/panes">panes</ExternalLink>,
                  which can be fixed or flexible.
                </li>
              </UnorderedList>
            </li>
            <li>
              <H3 role="title" size="large">
                Canonical layouts
              </H3>
              <UnorderedList>
                <li>
                  <ExternalLink href="https://m3.material.io/foundations/layout/canonical-examples/list-detail">
                    List-detail
                  </ExternalLink>{' '}
                  layout implemented by the <code>MaterialListDetailLayout</code>
                </li>
              </UnorderedList>
            </li>
          </UnorderedList>
        </Span>
      </div>
    </section>
  );
};
