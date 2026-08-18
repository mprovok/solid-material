import preview from '../../../.storybook/preview';

import { H3 } from './Typography';

const meta = preview.meta({
  title: 'Utilities/Typography/H3',
  component: H3,
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
