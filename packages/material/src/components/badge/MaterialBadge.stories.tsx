import preview from '../../../.storybook/preview';
import { MaterialButton } from '../button/MaterialButton';
import { MaterialIcon } from '../icon/MaterialIcon';

import { MaterialBadge } from './MaterialBadge';

import FavoriteIcon from '@solidmaterial/icons/400/outlined/favorite.svg';

const meta = preview.meta({
  title: 'Components/MaterialBadge',
  component: MaterialBadge,
  args: {
    children: <MaterialButton variant="tonal">Label</MaterialButton>
  }
});

export const LargeNumber = meta.story({
  args: {
    value: 1000
  }
});

export const LongText = meta.story({
  args: {
    value: 'abcdef'
  }
});

export const SmallDot = meta.story({
  args: {
    value: '',
    children: (
      <MaterialIcon>
        <FavoriteIcon />
      </MaterialIcon>
    )
  }
});
