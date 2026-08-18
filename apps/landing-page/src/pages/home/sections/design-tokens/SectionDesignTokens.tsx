import type { VoidComponent } from 'solid-js';

import { H2, H3, Span } from '@solid-material/material/components/typography';

import { UnorderedList } from '../../../../components/unordered-list/UnorderedList';

export const SectionDesignTokens: VoidComponent = () => {
  return (
    <section>
      <div></div>
      <div>
        <H2 role="display" size="small">
          Design Tokens
        </H2>
        <Span role="body" size="large">
          <UnorderedList>
            <li>
              <H3 role="title" size="large">
                Easings & Springs
              </H3>
            </li>
            <li>
              <H3 role="title" size="large">
                View transitions
              </H3>
            </li>
          </UnorderedList>
        </Span>
      </div>
    </section>
  );
};
