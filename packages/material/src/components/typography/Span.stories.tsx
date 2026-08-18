import { For } from 'solid-js';
import { createJSXDecorator } from 'storybook-solidjs-vite';

import preview from '../../../.storybook/preview';

import type { TypographyRole, TypographySize } from './Typography';

import { Span } from './Typography';

const meta = preview.meta({
  title: 'Utilities/Typography/Span',
  component: Span,
  decorators: [
    createJSXDecorator(Story => (
      <div style={{ display: 'flex', gap: '1rem', 'flex-direction': 'column' }}>
        <Story />
      </div>
    ))
  ],
  args: {
    children: 'Text'
  }
});

const SIZES: TypographySize[] = ['large', 'medium', 'small'];

const ROLES: TypographyRole[] = ['display', 'headline', 'title', 'body', 'label'];

const TypographyRenderer = () => (
  <For each={ROLES}>
    {role => (
      <For each={SIZES}>
        {size => (
          <Span role={role} size={size}>
            {role[0]?.toUpperCase()}
            {role.slice(1)} {size}
          </Span>
        )}
      </For>
    )}
  </For>
);

export const Example = meta.story({
  args: {
    role: 'title',
    size: 'large'
  }
});

export const RolesAndSizes = meta.story({
  parameters: {
    controls: {
      disable: true
    }
  },
  render: TypographyRenderer
});
