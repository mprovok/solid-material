import preview from '../../../.storybook/preview';
import { MaterialButton } from '../button';

import { MaterialRichTooltip } from './MaterialRichTooltip';

const meta = preview.meta({
  title: 'Components/MaterialTooltip/MaterialRichTooltip',
  component: MaterialRichTooltip
});

export const Example = meta.story({
  args: {
    title: 'Title',
    children: 'Text'
  }
});

export const Actions = meta.story({
  args: {
    title: 'Title',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    actions: (
      <>
        <MaterialButton variant="text">Action 1</MaterialButton>
        <MaterialButton variant="text">Action 2</MaterialButton>
      </>
    )
  }
});
