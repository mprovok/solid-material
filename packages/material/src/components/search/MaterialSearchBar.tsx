import type { JSX } from '@solidjs/web';
import type { Accessor, Setter, VoidComponent } from 'solid-js';

import { createFocusSignal } from '@solid-primitives/focus';
import { interactOutside } from '@solid-primitives/interaction';
import { Match, Show, Switch, createEffect, createSignal, onSettled, useContext } from 'solid-js';

import { Transition } from '../../utils/transitions';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';
import { MaterialIcon } from '../icon/MaterialIcon';
import { MaterialRipple } from '../ripple/MaterialRipple';
import { Span } from '../typography/Typography';

import { MaterialSearchOpenContext } from './MaterialSearch';

import styles from './MaterialSearchBar.module.css';

import ChevronBackwardIcon from '@solidmaterial/icons/400/outlined/chevron_backward.svg';
import CloseIcon from '@solidmaterial/icons/400/outlined/close.svg';
import SearchIcon from '@solidmaterial/icons/400/outlined/search.svg';

export interface MaterialSearchBarProps {
  input: Accessor<string>;
  setInput: Setter<string>;
  placeholder?: string;
  leadingButton?: JSX.Element;
  trailingButtons?: (focus: boolean) => JSX.Element;
  initialFocus?: boolean;
  showClearButton?: boolean;
  backButtonAriaLabel?: string;
  clearButtonAriaLabel?: string;
  onInput?: (event?: InputEvent) => void;
}

export const MaterialSearchBar: VoidComponent<MaterialSearchBarProps> = props => {
  const [refInput, setRefInput] = createSignal<HTMLInputElement>();

  const isShowingResults = useContext(MaterialSearchOpenContext);

  const [isExpanded, setIsExpanded] = createSignal(props.initialFocus ?? false);

  const isInputFocused = createFocusSignal(() => refInput()!);

  onSettled(() => {
    if (isExpanded()) {
      refInput()?.focus();
    }
  });

  // Move to expanded state when input gains focus and move back to the
  // collapsed state when focus is moved to an element outside the search bar

  createEffect(
    () => [isExpanded(), refInput()] as const,
    ([isExpanded, input]) => {
      // If the search bar is collapsed, then it should never has focus
      if (!isExpanded) {
        input?.blur();
      } else if (input instanceof HTMLInputElement) {
        // Trigger re-showing the search results
        props.setInput('');
        props.setInput(input.value);
      }
    }
  );

  createEffect(
    () => isInputFocused(),
    isInputFocused => {
      // Expand if user moved focus to input field
      if (isInputFocused) {
        setIsExpanded(true);
      }
    }
  );

  const onInteractOutside = () => {
    if (!isShowingResults()) {
      setIsExpanded(false);
    }
  };

  const onInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = event => {
    props.setInput(event.target.value);
    props.onInput?.(event);
  };

  const onClickBack = () => {
    props.setInput('');
    setIsExpanded(props.initialFocus ?? false);
  };

  const onClickClear = () => {
    props.setInput('');
    refInput()?.focus();
  };

  // When the user clicks on a search result, it may update the
  // input text in the search bar. In that case the input field
  // will automatically lose focus, but the search bar itself should stay
  // in the 'focused' state

  return (
    <sm-search-bar ref={interactOutside({ onInteractOutside })} data-expanded={isExpanded()} class={styles['bar']}>
      <Show when={!isExpanded()}>
        <MaterialRipple attachTo={refInput()} />
      </Show>
      <md-elevation></md-elevation>
      <Transition>
        <Switch>
          <Match when={isExpanded()}>
            <div class={styles['leading-button']}>
              <MaterialIconButton
                variant="text"
                icon={<ChevronBackwardIcon />}
                ariaLabel={props.backButtonAriaLabel}
                onClick={onClickBack}
              />
            </div>
          </Match>
          <Match when={props.leadingButton !== undefined}>
            <div class={styles['leading-button']}>{props.leadingButton}</div>
          </Match>
          <Match when={props.leadingButton === undefined}>
            <div class={styles['leading-button']}>
              <div class={styles['search-icon']}>
                <MaterialIcon>
                  <SearchIcon />
                </MaterialIcon>
              </div>
            </div>
          </Match>
        </Switch>
      </Transition>
      <Span role="body" size="large" class={styles['input']}>
        <input
          ref={setRefInput}
          role="searchbox"
          type="text"
          name="search"
          autocomplete="off"
          placeholder={props.placeholder}
          required
          value={props.input()}
          onInput={onInput}
        />
      </Span>
      <Transition>
        <Switch>
          <Match when={props.showClearButton !== false && isExpanded()}>
            <div class={styles['trailing-buttons']}>
              <Show when={props.showClearButton !== false}>
                <MaterialIconButton
                  variant="text"
                  icon={<CloseIcon />}
                  ariaLabel={props.clearButtonAriaLabel}
                  onClick={onClickClear}
                />
              </Show>
            </div>
          </Match>
          <Match when={props.trailingButtons !== undefined && isExpanded()}>
            <div class={styles['trailing-buttons']}>{props.trailingButtons?.(isExpanded())}</div>
          </Match>
          <Match when={props.trailingButtons !== undefined && !isExpanded()}>
            <div class={styles['trailing-buttons']}>{props.trailingButtons?.(isExpanded())}</div>
          </Match>
        </Switch>
      </Transition>
    </sm-search-bar>
  );
};
