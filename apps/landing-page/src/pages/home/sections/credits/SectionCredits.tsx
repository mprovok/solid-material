import type { VoidComponent } from 'solid-js';

import { H2, Span } from '@solid-material/material/components/typography';

import { ExternalLink } from '../../../../components/external-link/ExternalLink';

export const SectionCredits: VoidComponent = () => {
  return (
    <section data-wide>
      <div>
        <H2 role="display" size="small">
          Credits
        </H2>
        <Span role="body" size="large">
          This project uses the web components of{' '}
          <ExternalLink href="https://material-web.dev">
            <code>@material/web</code>
          </ExternalLink>{' '}
          for the ripple, focus ring, and elevation effects, and for some of the components (mostly those in the
          category form controls, see the README.md file on GitHub for the exact list).
        </Span>
      </div>
    </section>
  );
};
