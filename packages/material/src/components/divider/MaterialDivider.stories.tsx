import { createJSXDecorator } from 'storybook-solidjs-vite';

import preview from '../../../.storybook/preview';

import { MaterialDivider } from './MaterialDivider';

const meta = preview.meta({
  title: 'Components/MaterialDivider',
  component: MaterialDivider,
  decorators: [
    createJSXDecorator(Story => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ))
  ],
  tags: ['autodocs']
});

export const Example = meta.story({
  args: {}
});
