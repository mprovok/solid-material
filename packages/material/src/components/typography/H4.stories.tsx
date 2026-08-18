import preview from '../../../.storybook/preview';

import { H4 } from './Typography';

const meta = preview.meta({
  title: 'Utilities/Typography/H4',
  component: H4,
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
