import preview from '../../../.storybook/preview';

import { H2 } from './Typography';

const meta = preview.meta({
  title: 'Utilities/Typography/H2',
  component: H2,
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
