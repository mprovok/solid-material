import type { FlowComponent, VoidComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { Match, Switch, createSignal } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';
import { MaterialIconButton } from '../icon-button';

import type { MaterialSearchBarProps } from './MaterialSearchBar';

import { MaterialSearchShouldExpandContext, MaterialSearchOpenContext } from './MaterialSearch';
import { MaterialSearchBar } from './MaterialSearchBar';

import StarIcon from '@solidmaterial/icons/400/outlined/star.svg';

interface RenderComponentProps extends Pick<MaterialSearchBarProps, 'initialFocus' | 'showClearButton'> {
  showLeadingButton?: boolean;
  showTrailingButtons?: boolean;
}

const RenderComponent: VoidComponent<RenderComponentProps> = props => {
  return (
    <MaterialSearchBar
      placeholder="Placeholder"
      input=""
      shouldOpen={() => false}
      initialFocus={props.initialFocus}
      showClearButton={props.showClearButton}
      backButtonAriaLabel="Back"
      clearButtonAriaLabel="Clear input"
      leadingButton={
        props.showLeadingButton === true ? (
          <MaterialIconButton variant="text" icon={<StarIcon />} ariaLabel="Unfocused leading button" />
        ) : undefined
      }
      trailingButtons={
        props.showTrailingButtons === true
          ? focus => (
              <Switch>
                <Match when={focus}>
                  <MaterialIconButton variant="text" icon={<StarIcon />} ariaLabel="Focused trailing button" />
                </Match>
                <Match when={!focus}>
                  <MaterialIconButton variant="text" icon={<StarIcon />} ariaLabel="Unfocused trailing button" />
                </Match>
              </Switch>
            )
          : undefined
      }
    />
  );
};

const Wrapper: FlowComponent = props => {
  const [isOpen, setOpen] = createSignal(false);
  return (
    <MaterialTheme>
      <MaterialSearchShouldExpandContext value={() => false}>
        <MaterialSearchOpenContext value={[isOpen, setOpen]}>{props.children}</MaterialSearchOpenContext>
      </MaterialSearchShouldExpandContext>
    </MaterialTheme>
  );
};

describe('MaterialSearchBar', () => {
  describe('Visual', () => {
    describe('Collapsed (unfocused)', () => {
      it('shows a non-clickable leading icon when no leading button is defined', async () => {
        const { baseElement } = render(() => <RenderComponent showTrailingButtons />, {
          wrapper: Wrapper
        });
        const screen = page.elementLocator(baseElement);
        const bar = screen.getByElement('sm-search-bar');

        // Given a search bar which is collapsed (not focused)
        await expect.element(bar).not.toHaveAttribute('data-expanded');

        // Then the leading icon is visible
        const leadingButtonIcon = screen.getByRole('img', { includeHidden: true }).first();
        await expect.element(leadingButtonIcon).toBeVisible();

        // and the back button is hidden
        const backButton = screen.getByRole('button', { name: 'Back' });
        await expect.element(backButton).not.toBeInTheDocument();
      });

      it('shows leading button when a leading button is defined', async () => {
        const { baseElement } = render(() => <RenderComponent showLeadingButton />, {
          wrapper: Wrapper
        });
        const screen = page.elementLocator(baseElement);
        const bar = screen.getByElement('sm-search-bar');

        // Given a search bar which is collapsed (not focused)
        await expect.element(bar).not.toHaveAttribute('data-expanded');

        // Then the leading button is visible
        const leadingButton = screen.getByRole('button', { name: 'Unfocused leading button' });
        await expect.element(leadingButton).toBeVisible();

        // and the back button is hidden
        const backButton = screen.getByRole('button', { name: 'Back' });
        await expect.element(backButton).not.toBeInTheDocument();
      });

      it('shows trailing buttons', async () => {
        const { baseElement } = render(() => <RenderComponent showTrailingButtons />, {
          wrapper: Wrapper
        });
        const screen = page.elementLocator(baseElement);
        const bar = screen.getByElement('sm-search-bar');

        // Given a search bar which is collapsed (not focused)
        await expect.element(bar).not.toHaveAttribute('data-expanded');

        // Then the trailing icon button is visible
        const trailingButton = screen.getByRole('button', { name: 'Unfocused trailing button' });
        await expect.element(trailingButton).toBeVisible();

        // and the clear button is hidden
        const clearButton = screen.getByRole('button', { name: 'Clear input' });
        await expect.element(clearButton).not.toBeInTheDocument();
      });

      it('shows no clear button if no trailing buttons exist', async () => {
        const { baseElement } = render(() => <RenderComponent />, { wrapper: Wrapper });
        const screen = page.elementLocator(baseElement);
        const bar = screen.getByElement('sm-search-bar');

        // Given a search bar which is collapsed (not focused)
        await expect.element(bar).not.toHaveAttribute('data-expanded');

        // Then the clear button is hidden
        const clearButton = screen.getByRole('button', { name: 'Clear input' });
        await expect.element(clearButton).not.toBeInTheDocument();
      });

      it('shows zero buttons if showClearButton is false', async () => {
        const { baseElement } = render(() => <RenderComponent showClearButton={false} />, { wrapper: Wrapper });
        const screen = page.elementLocator(baseElement);
        const bar = screen.getByElement('sm-search-bar');

        // Given a search bar which is collapsed (not focused)
        await expect.element(bar).not.toHaveAttribute('data-expanded');

        // Then the clear button is hidden
        const buttons = screen.getByRole('button');
        expect(buttons).toHaveLength(0);
      });
    });

    describe('Expanded (focused)', () => {
      it('shows back button', async () => {
        const { baseElement } = render(() => <RenderComponent showTrailingButtons initialFocus />, {
          wrapper: Wrapper
        });
        const screen = page.elementLocator(baseElement);
        const bar = screen.getByElement('sm-search-bar');

        // Given a search bar which is expanded (focused)
        await expect.element(bar).toHaveAttribute('data-expanded');

        // Then the back button is visible
        const backButton = screen.getByRole('button', { name: 'Back' });
        await expect.element(backButton).toBeVisible();
      });

      it('shows clear button', async () => {
        const { baseElement } = render(() => <RenderComponent showTrailingButtons initialFocus />, {
          wrapper: Wrapper
        });
        const screen = page.elementLocator(baseElement);
        const bar = screen.getByElement('sm-search-bar');

        // Given a search bar which is expanded (focused)
        await expect.element(bar).toHaveAttribute('data-expanded');

        // Then the clear button is visible
        const clearButton = screen.getByRole('button', { name: 'Clear input' });
        await expect.element(clearButton).toBeVisible();

        // and the trailing icon button is hidden
        const trailingButtonUnfocused = screen.getByRole('button', { name: 'Unfocused trailing button' });
        await expect.element(trailingButtonUnfocused).not.toBeInTheDocument();

        const trailingButtonFocused = screen.getByRole('button', { name: 'Focused trailing button' });
        await expect.element(trailingButtonFocused).not.toBeInTheDocument();
      });

      it('shows trailing buttons if showClearButton is false', async () => {
        const { baseElement } = render(
          () => <RenderComponent showTrailingButtons initialFocus showClearButton={false} />,
          { wrapper: Wrapper }
        );
        const screen = page.elementLocator(baseElement);
        const bar = screen.getByElement('sm-search-bar');

        // Given a search bar which is expanded (focused)
        await expect.element(bar).toHaveAttribute('data-expanded');

        // Then the clear button is hidden
        const clearButton = screen.getByRole('button', { name: 'Clear input' });
        await expect.element(clearButton).not.toBeInTheDocument();

        // and the unfocused trailing icon button is hidden
        const trailingButtonUnfocused = screen.getByRole('button', { name: 'Unfocused trailing button' });
        await expect.element(trailingButtonUnfocused).not.toBeInTheDocument();

        // and the focused trailing icon button is visible
        const trailingButtonFocused = screen.getByRole('button', { name: 'Focused trailing button' });
        await expect.element(trailingButtonFocused).toBeVisible();
      });
    });
  });

  describe('Interaction', () => {
    it('expands and gains focus when clicked', async () => {
      const { baseElement } = render(() => <RenderComponent showTrailingButtons />, { wrapper: Wrapper });
      const screen = page.elementLocator(baseElement);
      const bar = screen.getByElement('sm-search-bar');

      // Given a visible input field
      const input = screen.getByRole('searchbox');
      await expect.element(input).toBeVisible();

      // When clicking on input field
      await userEvent.click(input);

      // Then expand and gain focus
      await expect.element(bar).toHaveAttribute('data-expanded');
      await expect.element(input).toHaveFocus();
    });

    it('clears input when clicking clear button', async () => {
      const { baseElement } = render(() => <RenderComponent showTrailingButtons />, { wrapper: Wrapper });
      const screen = page.elementLocator(baseElement);
      const bar = screen.getByElement('sm-search-bar');

      // Given a visible input field
      const input = screen.getByRole('searchbox');
      await expect.element(input).toBeVisible();

      // and expanded after clicking
      await userEvent.click(input);
      await expect.element(bar).toHaveAttribute('data-expanded');

      // and entered some text in input field
      await userEvent.type(input, 'some text');
      await expect.element(input).toHaveValue('some text');

      // When clicking on clear button
      const clearButton = screen.getByRole('button', { name: 'Clear input' });
      await userEvent.click(clearButton);

      // Then text in input field is cleared and has focus
      await expect.element(input).toHaveValue('');
      await expect.element(input).toHaveFocus();

      // and search bar remains expanded
      await expect.element(bar).toHaveAttribute('data-expanded');
    });

    it('collapses and clears input when clicking back button', async () => {
      const { baseElement } = render(() => <RenderComponent showTrailingButtons />, { wrapper: Wrapper });
      const screen = page.elementLocator(baseElement);
      const bar = screen.getByElement('sm-search-bar');

      // Given a visible input field
      const input = screen.getByRole('searchbox');
      await expect.element(input).toBeVisible();

      // and expanded after clicking
      await userEvent.click(input);
      await expect.element(bar).toHaveAttribute('data-expanded');

      // and entered some text in input field
      await userEvent.type(input, 'some text');
      await expect.element(input).toHaveValue('some text');

      // When clicking on back button
      const backButton = screen.getByRole('button', { name: 'Back' });
      await userEvent.click(backButton);

      // Then search bar collapses
      await expect.element(bar).not.toHaveAttribute('data-expanded');

      // and text in input field is cleared and loses focus
      await expect.element(input).toHaveValue('');
      await expect.element(input).not.toHaveFocus();
    });

    it('collapses when moving focus to outside search bar', async () => {
      const { baseElement } = render(() => <RenderComponent showTrailingButtons />, { wrapper: Wrapper });
      const screen = page.elementLocator(baseElement);
      const bar = screen.getByElement('sm-search-bar');

      // Given a visible input field
      const input = screen.getByRole('searchbox');
      await expect.element(input).toBeVisible();

      // and expanded after clicking
      await userEvent.click(input);
      await expect.element(bar).toHaveAttribute('data-expanded');

      // and entered some text in input field
      await userEvent.type(input, 'some text');
      await expect.element(input).toHaveValue('some text');

      // When moving focus to outside search bar
      await userEvent.click(document.body);

      // Then search bar collapses
      await expect.element(bar).not.toHaveAttribute('data-expanded');

      // and text in input field remains, but loses focus
      await expect.element(input).toHaveValue('some text');
      await expect.element(input).not.toHaveFocus();
    });
  });
});
