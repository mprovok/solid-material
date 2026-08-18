import type { FlowComponent } from 'solid-js';

import { MaterialIcon } from '@solid-material/material/components/icon';
import { A } from '@solidjs/router';

import OpenInNewIcon from '@solid-material/icons/400/outlined/open_in_new.svg';

export interface ExternalLinkProps {
  href: string;
}

export const ExternalLink: FlowComponent<ExternalLinkProps> = props => (
  <A href={props.href} target="_blank" style={{ display: 'inline-flex', gap: 'var(--md-user-spacing-xs)' }}>
    {props.children}
    <MaterialIcon size="small">
      <OpenInNewIcon />
    </MaterialIcon>
  </A>
);
