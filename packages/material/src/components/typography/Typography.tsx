import type { JSX } from '@solidjs/web';
import type { ParentComponent } from 'solid-js';

import { omit } from 'solid-js';

export type TypographySize = 'small' | 'medium' | 'large';

export type TypographyRole = 'display' | 'headline' | 'title' | 'body' | 'label';

export interface TypographyProps {
  size?: TypographySize;
  role: TypographyRole;
  id?: string;
}

const getFontClass = (role: TypographyRole, size: TypographySize = 'medium') => `md-typescale-${role}-${size}`;

export const H1: ParentComponent<TypographyProps> = props => (
  <h1 id={props.id} class={getFontClass(props.role, props.size)}>
    {props.children}
  </h1>
);
export const H2: ParentComponent<TypographyProps> = props => (
  <h2 id={props.id} class={getFontClass(props.role, props.size)}>
    {props.children}
  </h2>
);
export const H3: ParentComponent<TypographyProps> = props => (
  <h3 id={props.id} class={getFontClass(props.role, props.size)}>
    {props.children}
  </h3>
);
export const H4: ParentComponent<TypographyProps> = props => (
  <h4 id={props.id} class={getFontClass(props.role, props.size)}>
    {props.children}
  </h4>
);
export const H5: ParentComponent<TypographyProps> = props => (
  <h5 id={props.id} class={getFontClass(props.role, props.size)}>
    {props.children}
  </h5>
);
export const H6: ParentComponent<TypographyProps> = props => (
  <h6 id={props.id} class={getFontClass(props.role, props.size)}>
    {props.children}
  </h6>
);

export type SpanProps = TypographyProps & Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'role'>;

export const Span: ParentComponent<SpanProps> = props => {
  const otherProps = omit(props, 'role', 'size', 'class');
  return (
    <span class={[getFontClass(props.role, props.size), props.class]} {...otherProps}>
      {props.children}
    </span>
  );
};
