import preview from '../../../.storybook/preview';

import { MaterialIcon } from './MaterialIcon';

import MenuIcon from '@solidmaterial/icons/400/outlined/menu.svg';

const meta = preview.meta({
  title: 'Components/MaterialIcon',
  component: MaterialIcon,
  argTypes: {
    // Hide some private props (which exist only so that the icon can
    // be used in some web components)
    slot: {
      table: {
        disable: true
      }
    }
  } as Partial<typeof MaterialIcon>,
  args: {
    children: <MenuIcon />
  }
});

export const SizeSmall = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    size: 'small'
  }
});

export const SizeMedium = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    size: 'medium'
  }
});

export const SizeLarge = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    size: 'large'
  }
});

export const Default = meta.story({
  args: {}
});

export const Size = meta.story({
  tags: ['!test'],
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', 'flex-wrap': 'wrap', 'align-items': 'center' }}>
      <MaterialIcon size="small">
        <MenuIcon />
      </MaterialIcon>
      <MaterialIcon size="medium">
        <MenuIcon />
      </MaterialIcon>
      <MaterialIcon size="large">
        <MenuIcon />
      </MaterialIcon>
    </div>
  )
});
