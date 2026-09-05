import type { Component } from 'solid-js';

import { Match, Switch, createSignal } from 'solid-js';
import { createJSXDecorator } from 'storybook-solidjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

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
  render: () => <MaterialSearchRenderer {...Docked.composed.args} />,
  play: async ({ canvas, step }) => {
    const dialog = canvas.getByRole('dialog');
    const bar = dialog.querySelector('sm-search-bar');
    const results = dialog.querySelector('sm-search-results');
    const input = canvas.getByRole('searchbox');

    await expect(bar).not.toHaveAttribute('data-expanded');
    await expect(input).not.toHaveFocus();

    await step('Click on bar to expand', async () => {
      await userEvent.click(input);

      await expect(bar).toHaveAttribute('data-expanded');
      await waitFor(async () => expect(input).toHaveFocus());
    });

    await step('Click click button to clear input', async () => {
      // Type some text then activate 'clear' button
      await userEvent.type(input, 'tex', { delay: 250 });
      await userEvent.tab();
      await userEvent.keyboard('{Enter}', { delay: 250 });

      await waitFor(async () => expect(input).toHaveFocus());
      await expect(input).toHaveValue('');
    });

    await step('Click back button to clear input and collapse', async () => {
      // Type some text then activate 'back' button
      await userEvent.type(input, 'tex', { delay: 250 });
      await userEvent.tab({ shift: true });
      await userEvent.keyboard('{Enter}', { delay: 250 });

      await waitFor(async () => expect(input).not.toHaveFocus());
      await expect(input).toHaveValue('');

      await expect(bar).not.toHaveAttribute('data-expanded');
    });

    await step('Click outside to bar to collapse', async () => {
      await userEvent.click(input);

      await expect(bar).toHaveAttribute('data-expanded');
      await waitFor(async () => expect(input).toHaveFocus());

      await userEvent.click(dialog, { delay: 500 });

      await expect(bar).not.toHaveAttribute('data-expanded');
      await waitFor(async () => expect(input).not.toHaveFocus());
    });

    await step('Type correct text to show search results', async () => {
      await userEvent.click(input);

      await expect(bar).toHaveAttribute('data-expanded');
      await waitFor(async () => expect(input).toHaveFocus());

      await expect(results).not.toBeVisible();
      await userEvent.type(input, 'text', { delay: 250 });
      await expect(results).toBeVisible();

      // Hide search results when pressing backspace
      await userEvent.keyboard('{Backspace}', { delay: 250 });
      await expect(results).not.toBeVisible();

      await userEvent.type(input, 't', { delay: 250 });
      await expect(results).toBeVisible();
    });

    await step('Click on search results backdrop to hide and collapse', async () => {
      await userEvent.click(dialog);

      await expect(results).not.toBeVisible();

      await waitFor(async () => expect(bar).not.toHaveAttribute('data-expanded'));
      await waitFor(async () => expect(input).not.toHaveFocus());
    });

    await step('Click on bar to expand and show search results', async () => {
      await userEvent.click(input, { delay: 500 });

      await expect(bar).toHaveAttribute('data-expanded');
      await waitFor(async () => expect(input).toHaveFocus());

      await expect(results).toBeVisible();
    });

    await step('Click on search result item to hide result, but stay expanded', async () => {
      const items = canvas.getAllByRole('listitem');
      const listItem = within(items[1]!).getByRole('button');

      await userEvent.click(listItem);

      await expect(results).not.toBeVisible();

      await expect(bar).toHaveAttribute('data-expanded');

      // await waitFor(async () => expect(input).not.toHaveFocus());
      await expect(input).toHaveValue('Item');
    });

    await step('Click outside bar again to collapse', async () => {
      await expect(bar).toHaveAttribute('data-expanded');

      await userEvent.click(dialog, { delay: 500 });

      await expect(bar).not.toHaveAttribute('data-expanded');
      await waitFor(async () => expect(input).not.toHaveFocus());
    });
  }
});
