import type { Accessor, JSX, Setter, VoidComponent } from 'solid-js';

import { createActiveElement, createFocusSignal } from '@solid-primitives/active-element';
import { Match, Show, Switch, createEffect, createSignal, onMount, useContext } from 'solid-js';

import { Transition } from '../../utils/transitions';
import { createDebouncedMemo } from '../../utils/utils';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';
import { MaterialIcon } from '../icon/MaterialIcon';
import { MaterialRipple } from '../ripple/MaterialRipple';
import { Span } from '../typography/Typography';

import { MaterialSearchFocusContext, MaterialSearchOpenContext } from './MaterialSearch';

import styles from './MaterialSearchBar.module.css';

import ChevronBackwardIcon from '@solid-material/icons/400/outlined/chevron_backward.svg';
import CloseIcon from '@solid-material/icons/400/outlined/close.svg';
import SearchIcon from '@solid-material/icons/400/outlined/search.svg';

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
  onInput?: (event: InputEvent) => void;
}

export const MaterialSearchBar: VoidComponent<MaterialSearchBarProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDivElement;

  // oxlint-disable-next-line no-unassigned-vars
  let refInput!: HTMLInputElement;

  const [hasFocus, setHasFocus] = useContext(MaterialSearchFocusContext);
  const showResults = useContext(MaterialSearchOpenContext);

  const [isExpanded, setIsExpanded] = createSignal(props.initialFocus ?? false);

  const isInputFocused = createFocusSignal(() => refInput);

  const activeElement = createActiveElement();
  const debouncedActiveElement = createDebouncedMemo(() => activeElement(), 50);

  const isSearchBarFocused = createDebouncedMemo(
    () => debouncedActiveElement() !== null && (ref?.parentElement?.contains(debouncedActiveElement()) ?? false),
    50
  );

  onMount(() => {
    if (isExpanded()) {
      refInput.focus();
    }
  });

  // Move to expanded state when input gains focus and move back to the
  // collapsed state when focus is moved to an element outside the search bar

  createEffect(() => {
    // If the search bar is collapsed, then it should never has focus
    if (!isExpanded()) {
      refInput.blur();
    }
  });

  createEffect(() => {
    // Collapse when search bar lost focus
    if (!isSearchBarFocused() && !(showResults() && hasFocus())) {
      setIsExpanded(false);
    }
  });

  createEffect(() => {
    // Expand if user moved focus to input field
    if (isInputFocused()) {
      setIsExpanded(true);
    }
  });

  createEffect(() => {
    setHasFocus(isExpanded());
  });

  createEffect(() => {
    // When the user clicks on a search result, it may update the
    // input text in the search bar. In that case the input field
    // will automatically lose focus, but the search bar itself should stay
    // in the 'focused' state
    refInput.value = props.input();
  });

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
    refInput.focus();
  };

  return (
    <sm-search-bar ref={ref} bool:data-expanded={isExpanded()} class={styles['bar']}>
      <Show when={!isExpanded()}>
        <MaterialRipple attachTo={refInput} />
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
          ref={refInput}
          role="searchbox"
          type="text"
          name="search"
          autocomplete="off"
          placeholder={props.placeholder}
          required
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
            <div class={styles['trailing-buttons']}>{props.trailingButtons?.(hasFocus())}</div>
          </Match>
          <Match when={props.trailingButtons !== undefined && !isExpanded()}>
            <div class={styles['trailing-buttons']}>{props.trailingButtons?.(hasFocus())}</div>
          </Match>
        </Switch>
      </Transition>
    </sm-search-bar>
  );
};
