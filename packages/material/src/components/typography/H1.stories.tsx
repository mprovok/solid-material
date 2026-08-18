import preview from '../../../.storybook/preview';

import { H1 } from './Typography';

const meta = preview.meta({
  title: 'Utilities/Typography/H1',
  component: H1,
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
