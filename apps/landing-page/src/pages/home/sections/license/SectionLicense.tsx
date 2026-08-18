import type { VoidComponent } from 'solid-js';

import { H2, Span } from '@solid-material/material/components/typography';

export const SectionLicense: VoidComponent = () => {
  return (
    <section data-wide>
      <div>
        <H2 role="display" size="small">
          License
        </H2>
        <Span role="body" size="large">
          This project is licensed under the Apache 2.0 license.
        </Span>
      </div>
    </section>
  );
};
