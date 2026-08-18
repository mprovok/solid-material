import preview from '../../../.storybook/preview';

import { H6 } from './Typography';

const meta = preview.meta({
  title: 'Utilities/Typography/H6',
  component: H6,
  args: {
    children: 'Text'
  }
});

export const Example = meta.story({
  args: {
    role: 'title',
    size: 'large'
  }
});
