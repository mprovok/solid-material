import type { VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialIcon } from '../icon/MaterialIcon';
import { MaterialList } from '../list/MaterialList';
import { MaterialListItem } from '../list/MaterialListItem';

import type { MaterialSearchBarProps } from './MaterialSearchBar';

import { MaterialSearch } from './MaterialSearch';
import { MaterialSearchBar } from './MaterialSearchBar';
import { MaterialSearchResults } from './MaterialSearchResults';

import StarIcon from '@solidmaterial/icons/400/outlined/star.svg';

interface RenderComponentProps extends Pick<MaterialSearchBarProps, 'initialFocus' | 'showClearButton'> {
  initialText?: string;
}

const RenderComponent: VoidComponent<RenderComponentProps> = props => {
  const [searchInput, setSearchInput] = createSignal(props.initialText ?? '');

  const isSearchOpen = () => searchInput() === 'text';

  const onClickSearchResultItem = () => {
    setSearchInput('Item');
  };

  return (
    <MaterialSearch open={isSearchOpen()} layout="docked">
      <MaterialSearchBar
        placeholder="Placeholder"
        input={searchInput}
        setInput={setSearchInput}
        initialFocus={props.initialFocus}
        showClearButton={props.showClearButton}
        backButtonAriaLabel="Back"
        clearButtonAriaLabel="Clear input"
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
            Search result item
          </MaterialListItem>
        </MaterialList>
      </MaterialSearchResults>
    </MaterialSearch>
  );
};

describe('MaterialSearch', () => {
  describe('Interaction', () => {
    it('shows search results when typing correct text', async () => {
      const { baseElement } = render(() => <RenderComponent />, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);
      const bar = screen.getByElement('sm-search-bar');
      const results = screen.getByElement('sm-search-results');

      // Given a visible input field
      const input = screen.getByRole('searchbox');
      await expect.element(input).toBeVisible();

      // and the input field has focus after clicking
      await userEvent.click(input);
      await expect.element(input).toHaveFocus();

      // and search results are not visible
      await expect.element(results).not.toBeVisible();

      // When typing the correct text
      await userEvent.fill(input, 'text');

      // Then search results are visible
      await expect.element(results).toBeVisible();

      // and search bar remains expanded
      await expect.element(bar).toHaveAttribute('data-expanded');
    });

    it('hides search results when making correct text incorrect', async () => {
      const { baseElement } = render(() => <RenderComponent initialFocus initialText="text" />, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);
      const bar = screen.getByElement('sm-search-bar');
      const results = screen.getByElement('sm-search-results');

      // Given a visible input field containing the correct text
      const input = screen.getByRole('searchbox');
      await expect.element(input).toHaveValue('text');

      // and search results are visible
      await expect.element(results).toBeVisible();
      await expect.element(bar).toHaveAttribute('data-expanded');

      // When making correct text incorrect
      await userEvent.type(input, 'something');

      // Then search results are not visible
      await expect.element(results).not.toBeVisible();

      // and search bar remains expanded
      // Issue #3: Search bar remains expanded outside test environment
      // await expect.element(bar).toHaveAttribute('data-expanded');
      // await expect.element(input).toHaveFocus();
    });

    it('hides search results when clicking outside search bar', async () => {
      const { baseElement } = render(() => <RenderComponent initialFocus initialText="text" />, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);
      const bar = screen.getByElement('sm-search-bar');
      const results = screen.getByElement('sm-search-results');

      // Given a visible input field containing the correct text
      const input = screen.getByRole('searchbox');
      await expect.element(input).toHaveValue('text');

      // and search results are visible
      await expect.element(results).toBeVisible();
      await expect.element(bar).toHaveAttribute('data-expanded');

      // When the user clicks outside of the search bar or results
      await userEvent.click(document.body);

      // Then the search results are not visible
      await expect.element(results).not.toBeVisible();

      // and the search bar collapses and loses focus
      await expect.element(bar).not.toHaveAttribute('data-expanded');
      await expect.element(input).not.toHaveFocus();
    });

    it('shows search results when clicking on bar with correct text', async () => {
      const { baseElement } = render(() => <RenderComponent initialText="text" />, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);
      const bar = screen.getByElement('sm-search-bar');
      const results = screen.getByElement('sm-search-results');

      // Given a visible input field containing the correct text
      const input = screen.getByRole('searchbox');
      await expect.element(input).toHaveValue('text');

      // and search bar is collapsed and results are not visible
      await expect.element(bar).not.toHaveAttribute('data-expanded');
      await expect.element(results).not.toBeVisible();

      // When the user clicks on input field in the search bar
      await userEvent.click(input);

      // Then the search bar expands and gains focus
      await expect.element(bar).toHaveAttribute('data-expanded');
      await expect.element(input).toHaveFocus();

      // and results are visible
      await expect.element(results).toBeVisible();
    });

    it('hides results when clicking on search result item', async () => {
      const { baseElement } = render(() => <RenderComponent initialFocus initialText="text" />, {
        wrapper: MaterialTheme
      });
      const screen = page.elementLocator(baseElement);
      const bar = screen.getByElement('sm-search-bar');
      const results = screen.getByElement('sm-search-results');

      // Given a visible input field containing the correct text
      const input = screen.getByRole('searchbox');
      await expect.element(input).toHaveValue('text');

      // and results are visible
      await expect.element(results).toBeVisible();
      const item = results.getByRole('listitem').first();
      await expect.element(item).toBeVisible();

      // When clicking on search result item
      await userEvent.click(item);

      // Then search results are not visible
      await expect.element(results).not.toBeVisible();

      // and input field contains text of result item
      await expect.element(input).toHaveValue('Item');

      // and search bar stays expanded, but loses focus
      await expect.element(bar).toHaveAttribute('data-expanded');
      // Issue #3: Fix input field should lose focus
      // await expect.element(input).not.toHaveFocus();

      // When clicking outside search bar
      await userEvent.click(document.body);

      // Then search bar collapses and remains unfocused
      await expect.element(bar).not.toHaveAttribute('data-expanded');
      await expect.element(input).not.toHaveFocus();
    });
  });
});
