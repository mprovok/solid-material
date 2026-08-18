import preview from '../../../.storybook/preview';

import { MaterialPlainTooltip } from './MaterialPlainTooltip';

const meta = preview.meta({
  title: 'Components/MaterialTooltip/MaterialPlainTooltip',
  component: MaterialPlainTooltip
});

export const Example = meta.story({
  args: {
    children: 'Text'
  }
});
