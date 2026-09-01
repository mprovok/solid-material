import type { FlowComponent } from 'solid-js';

import { MaterialIcon } from '@solidmaterial/material/components/icon';

import OpenInNewIcon from '@solidmaterial/icons/400/outlined/open_in_new.svg';

export interface ExternalLinkProps {
  href: string;
}

export const ExternalLink: FlowComponent<ExternalLinkProps> = props => (
  <a href={props.href} target="_blank" style={{ display: 'inline-flex', gap: 'var(--md-user-spacing-xs)' }}>
    {props.children}
    <MaterialIcon size="small">
      <OpenInNewIcon />
    </MaterialIcon>
  </a>
);
