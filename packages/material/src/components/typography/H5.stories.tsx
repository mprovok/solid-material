import preview from '../../../.storybook/preview';

import { H5 } from './Typography';

const meta = preview.meta({
  title: 'Utilities/Typography/H5',
  component: H5,
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
