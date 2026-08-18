import { createJSXDecorator } from 'storybook-solidjs-vite';
import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';
import { MaterialIcon } from '../icon/MaterialIcon';

import { MaterialList } from './MaterialList';
import { MaterialListItem } from './MaterialListItem';

import FavoriteIcon from '@solid-material/icons/400/outlined/favorite.svg';
import OpenInNewIcon from '@solid-material/icons/400/outlined/open_in_new.svg';
import StarIcon from '@solid-material/icons/400/outlined/star.svg';

const meta = preview.meta({
  title: 'Components/MaterialListItem',
  component: MaterialListItem,
  args: {
    onClick: fn()
  }
});

export const OverlineText = meta.story({
  decorators: [
    createJSXDecorator(Story => (
      <MaterialList>
        <Story />
      </MaterialList>
    ))
  ],
  args: {
    overlineText: 'Overline text',
    children: 'Text'
  }
});

export const SupportingText = meta.story({
  decorators: [
    createJSXDecorator(Story => (
      <MaterialList>
        <Story />
      </MaterialList>
    ))
  ],
  args: {
    supportingText: 'Supporting text',
    children: 'Text'
  }
});

export const TrailingText = meta.story({
  decorators: [
    createJSXDecorator(Story => (
      <MaterialList>
        <Story />
      </MaterialList>
    ))
  ],
  args: {
    trailingText: 'Trailing text',
    children: 'Text'
  }
});

export const Icon = meta.story({
  decorators: [
    createJSXDecorator(Story => (
      <MaterialList>
        <Story />
      </MaterialList>
    ))
  ],
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'nested-interactive',
            enabled: false
          }
        ]
      }
    }
  },
  args: {
    trailingText: 'Trailing text',
    start: (
      <MaterialIcon>
        <FavoriteIcon />
      </MaterialIcon>
    ),
    end: <MaterialIconButton variant="text" icon={<StarIcon />} ariaLabel="Favorite" />,
    children: 'Text'
  }
});

export const Disabled = meta.story({
  decorators: [
    createJSXDecorator(Story => (
      <MaterialList>
        <Story />
      </MaterialList>
    ))
  ],
  args: {
    disabled: true,
    overlineText: 'Overline text',
    supportingText: 'Supporting text',
    trailingText: 'Trailing text',
    start: (
      <MaterialIcon>
        <FavoriteIcon />
      </MaterialIcon>
    ),
    end: <MaterialIconButton variant="text" icon={<StarIcon />} />,
    children: 'Text'
  }
});

export const Link = meta.story({
  decorators: [
    createJSXDecorator(Story => (
      <MaterialList>
        <Story />
      </MaterialList>
    ))
  ],
  args: {
    overlineText: 'Link',
    href: globalThis.location.origin,
    target: '_blank',
    end: (
      <MaterialIcon>
        <OpenInNewIcon />
      </MaterialIcon>
    ),
    children: 'Text'
  }
});

export const AlignTop = meta.story({
  decorators: [
    createJSXDecorator(Story => (
      <MaterialList>
        <Story />
      </MaterialList>
    ))
  ],
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'nested-interactive',
            enabled: false
          }
        ]
      }
    }
  },
  args: {
    selected: true,
    overlineText: 'Overline text',
    supportingText: 'Supporting text',
    start: (
      <MaterialIcon>
        <FavoriteIcon />
      </MaterialIcon>
    ),
    end: <MaterialIconButton variant="text" icon={<StarIcon />} ariaLabel="Favorite" />,
    children: 'Text',
    align: 'top'
  }
});

export const Selected = meta.story({
  decorators: [
    createJSXDecorator(Story => (
      <MaterialList selectable="single" ariaLabel="List with 1 selected option">
        <Story />
      </MaterialList>
    ))
  ],
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'nested-interactive',
            enabled: false
          }
        ]
      }
    }
  },
  args: {
    selected: true,
    overlineText: 'Overline text',
    supportingText: 'Supporting text',
    trailingText: 'Trailing text',
    start: (
      <MaterialIcon>
        <FavoriteIcon />
      </MaterialIcon>
    ),
    end: <MaterialIconButton variant="text" icon={<StarIcon />} ariaLabel="Favorite" />,
    children: 'Text'
  }
});

export const SelectedDisabled = meta.story({
  decorators: [
    createJSXDecorator(Story => (
      <MaterialList selectable="single" ariaLabel="List with 1 selected option, which is disabled">
        <Story />
      </MaterialList>
    ))
  ],
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'nested-interactive',
            enabled: false
          }
        ]
      }
    }
  },
  args: {
    disabled: true,
    selected: true,
    overlineText: 'Overline text',
    supportingText: 'Supporting text',
    trailingText: 'Trailing text',
    start: (
      <MaterialIcon>
        <FavoriteIcon />
      </MaterialIcon>
    ),
    end: <MaterialIconButton variant="text" icon={<StarIcon />} ariaLabel="Favorite" />,
    children: 'Text'
  }
});
