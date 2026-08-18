import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';

import { MaterialFab } from './MaterialFab';

import EditFillIcon from '@solid-material/icons/400/outlined/edit-fill.svg';
import FavoriteIcon from '@solid-material/icons/400/outlined/favorite.svg';
import NavigationIcon from '@solid-material/icons/400/outlined/navigation.svg';

const meta = preview.meta({
  title: 'Buttons/MaterialFab',
  component: MaterialFab,
  argTypes: {
    // Hide some private props (which exist only for MaterialFabMenu)
    ariaExpanded: {
      table: {
        disable: true
      }
    },
    shape: {
      table: {
        disable: true
      }
    }
  } as Partial<typeof MaterialFab>,
  args: { onClick: fn() }
});

export const ColorPrimary = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    color: 'primary',
    children: 'Primary'
  }
});

export const ColorSecondary = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    color: 'secondary',
    children: 'Secondary'
  }
});

export const ColorTertiary = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    color: 'tertiary',
    children: 'Tertiary'
  }
});

export const ColorPrimaryContainer = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    color: 'primary-container',
    children: 'Primary container'
  }
});

export const ColorSecondaryContainer = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    color: 'secondary-container',
    children: 'Secondary container'
  }
});

export const ColorTertiaryContainer = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    color: 'tertiary-container',
    children: 'Tertiary container'
  }
});

export const Color = meta.story({
  tags: ['!test'],
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', 'flex-wrap': 'wrap' }}>
      <MaterialFab color="primary-container" icon={<EditFillIcon />} />
      <MaterialFab color="secondary-container" icon={<EditFillIcon />} />
      <MaterialFab color="tertiary-container" icon={<EditFillIcon />} />

      <MaterialFab color="primary" icon={<EditFillIcon />} />
      <MaterialFab color="secondary" icon={<EditFillIcon />} />
      <MaterialFab color="tertiary" icon={<EditFillIcon />} />
    </div>
  )
});

export const SizeSmall = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    size: 'small',
    icon: <EditFillIcon />
  }
});

export const SizeMedium = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    size: 'medium',
    icon: <NavigationIcon />
  }
});

export const SizeLarge = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    size: 'large',
    icon: <FavoriteIcon />
  }
});

export const Size = meta.story({
  tags: ['!test'],
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', 'flex-wrap': 'wrap', 'align-items': 'center' }}>
      <MaterialFab icon={<EditFillIcon />} size="small" />
      <MaterialFab icon={<NavigationIcon />} size="medium" />
      <MaterialFab icon={<FavoriteIcon />} size="large" />
    </div>
  )
});

export const Label = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    icon: <EditFillIcon />,
    size: 'large',
    children: 'Edit'
  }
});

export const Extended_FAB = meta.story({
  tags: ['!test'],
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '1rem', 'flex-wrap': 'wrap', 'align-items': 'center' }}>
        <MaterialFab icon={<EditFillIcon />} size="small">
          Small
        </MaterialFab>
        <MaterialFab icon={<NavigationIcon />} size="medium">
          Medium
        </MaterialFab>
        <MaterialFab icon={<FavoriteIcon />} size="large">
          Large
        </MaterialFab>
      </div>
    );
  }
});

export const Tooltip = meta.story({
  args: {
    icon: <NavigationIcon />,
    color: 'primary',
    title: 'Tooltip'
  }
});
