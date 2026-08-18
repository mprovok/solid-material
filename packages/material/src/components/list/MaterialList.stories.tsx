import type { Component, JSX } from 'solid-js';

import { Index, splitProps } from 'solid-js';

import preview from '../../../.storybook/preview';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';
import { MaterialIcon } from '../icon/MaterialIcon';

import type { MaterialListProps } from './MaterialList';
import type { MaterialListItemProps } from './MaterialListItem';

import { MaterialList } from './MaterialList';
import { MaterialListItem } from './MaterialListItem';

import FavoriteIcon from '@solid-material/icons/400/outlined/favorite.svg';
import OpenInNewIcon from '@solid-material/icons/400/outlined/open_in_new.svg';
import StarIcon from '@solid-material/icons/400/outlined/star.svg';

const meta = preview.meta({
  title: 'Components/MaterialList',
  component: MaterialList,
  subcomponents: {
    MaterialListItem
  }
});

const MaterialListRenderer: Component<
  Omit<MaterialListProps, 'children'> & { items: (MaterialListItemProps & { children: JSX.Element })[] }
> = args => {
  const [localArgs, otherArgs] = splitProps(args, ['items']);
  return (
    <MaterialList {...otherArgs}>
      <Index each={localArgs.items}>{item => <MaterialListItem {...item()} />}</Index>
    </MaterialList>
  );
};

export const Example = meta.story({
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false
          }
        ]
      }
    }
  },
  args: {
    segmented: false
  },
  render: () => (
    <MaterialListRenderer
      {...Example.composed.args}
      items={[
        {
          trailingText: 'Trailing text',
          start: (
            <MaterialIcon>
              <FavoriteIcon />
            </MaterialIcon>
          ),
          end: <MaterialIconButton variant="text" icon={<StarIcon />} ariaLabel="Favorite" />,
          children: 'Label'
        },
        {
          onClick: () => console.info('Clicked list item'),
          overlineText: 'Interactive item with overline text',
          children: 'Label'
        },
        {
          overlineText: 'Link',
          href: globalThis.location.origin,
          target: '_blank',
          end: (
            <MaterialIcon>
              <OpenInNewIcon />
            </MaterialIcon>
          ),
          children: 'Label'
        },
        {
          disabled: true,
          supportingText: 'Supporting text',
          children: 'Label'
        }
      ]}
    />
  )
});

export const Segmented = meta.story({
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false
          }
        ]
      }
    }
  },
  args: {
    segmented: true
  },
  render: () => (
    <MaterialListRenderer
      {...Segmented.composed.args}
      items={[
        {
          trailingText: 'Trailing text',
          start: (
            <MaterialIcon>
              <FavoriteIcon />
            </MaterialIcon>
          ),
          end: <MaterialIconButton variant="text" icon={<StarIcon />} ariaLabel="Favorite" />,
          children: 'Label'
        },
        {
          onClick: () => console.info('Clicked list item'),
          overlineText: 'Interactive item with overline text',
          children: 'Label'
        },
        {
          overlineText: 'Link',
          href: globalThis.location.origin,
          target: '_blank',
          end: (
            <MaterialIcon>
              <OpenInNewIcon />
            </MaterialIcon>
          ),
          children: 'Label'
        },
        {
          disabled: true,
          supportingText: 'Supporting text',
          children: 'Label'
        }
      ]}
    />
  )
});

export const Small = meta.story({
  args: {
    segmented: true
  },
  render: () => (
    <MaterialListRenderer
      {...Small.composed.args}
      items={[
        {
          start: (
            <MaterialIcon>
              <StarIcon />
            </MaterialIcon>
          ),
          trailingText: 1,
          children: 'First item'
        },
        {
          start: (
            <MaterialIcon>
              <StarIcon />
            </MaterialIcon>
          ),
          trailingText: 2,
          children: 'Second item'
        },
        {
          start: (
            <MaterialIcon>
              <StarIcon />
            </MaterialIcon>
          ),
          trailingText: 3,
          children: 'Third item'
        }
      ]}
    />
  )
});
