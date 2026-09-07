import type { Component } from 'solid-js';

import { Match, Switch, createSignal } from 'solid-js';
import { createJSXDecorator } from 'storybook-solidjs-vite';
import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';
import { MaterialIcon } from '../icon/MaterialIcon';
import { MaterialList } from '../list/MaterialList';
import { MaterialListItem } from '../list/MaterialListItem';

import type { MaterialSearchProps } from './MaterialSearch';

import { MaterialSearch } from './MaterialSearch';
import { MaterialSearchBar } from './MaterialSearchBar';
import { MaterialSearchResults } from './MaterialSearchResults';

import FavoriteIcon from '@solidmaterial/icons/400/outlined/favorite.svg';
import OpenInNewIcon from '@solidmaterial/icons/400/outlined/open_in_new.svg';
import StarIcon from '@solidmaterial/icons/400/outlined/star.svg';

const meta = preview.meta({
  title: 'Components/MaterialSearch',
  component: MaterialSearch,
  decorators: [
    createJSXDecorator(Story => (
      <div style={{ 'padding-block': '1.5rem' }}>
        <Story />
      </div>
    ))
  ],
  globals: {
    backgrounds: {
      value: 'surface'
    },
    viewport: { value: 'pixel', isRotated: false }
  },
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    layout: 'docked'
  }
});

const MaterialSearchRenderer: Component<Omit<MaterialSearchProps, 'open'>> = args => {
  const [searchInput, setSearchInput] = createSignal('');

  const isSearchOpen = () => searchInput() === 'text';

  const onClickSearchResultItem = () => {
    setSearchInput('Item');
  };

  return (
    <MaterialSearch open={isSearchOpen()} {...args}>
      <MaterialSearchBar
        placeholder="Placeholder"
        input={searchInput}
        setInput={setSearchInput}
        initialFocus={false}
        showClearButton={true}
        trailingButtons={focus => (
          <Switch>
            <Match when={focus}>
              <MaterialIconButton variant="text" icon={<FavoriteIcon />} onClick={fn()} />
            </Match>
            <Match when={!focus}>
              <MaterialIconButton variant="text" icon={<StarIcon />} onClick={fn()} />
              <MaterialIconButton variant="text" icon={<OpenInNewIcon />} onClick={fn()} />
            </Match>
          </Switch>
        )}
      />
      <MaterialSearchResults>
        <MaterialList segmented={true}>
          <MaterialListItem
            start={
              <MaterialIcon>
                <StarIcon />
              </MaterialIcon>
            }
            onClick={onClickSearchResultItem}
          >
            Item 1
          </MaterialListItem>
          <MaterialListItem
            start={
              <MaterialIcon>
                <StarIcon />
              </MaterialIcon>
            }
            onClick={onClickSearchResultItem}
          >
            Item 2
          </MaterialListItem>
          <MaterialListItem
            start={
              <MaterialIcon>
                <StarIcon />
              </MaterialIcon>
            }
            onClick={onClickSearchResultItem}
          >
            Item 3
          </MaterialListItem>
          <MaterialListItem
            start={
              <MaterialIcon>
                <StarIcon />
              </MaterialIcon>
            }
            onClick={onClickSearchResultItem}
          >
            Item 4
          </MaterialListItem>
        </MaterialList>
      </MaterialSearchResults>
    </MaterialSearch>
  );
};

export const Fullscreen = meta.story({
  args: {
    layout: 'fullscreen'
  },
  render: () => <MaterialSearchRenderer {...Fullscreen.composed.args} />
});

export const Docked = meta.story({
  args: {
    layout: 'docked'
  },
  render: () => <MaterialSearchRenderer {...Docked.composed.args} />
});
