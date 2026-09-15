import type { JSX } from '@solidjs/web';
import type { VoidComponent } from 'solid-js';

import { focus } from '@solid-primitives/active-element';
import { interactOutside } from '@solid-primitives/interaction';
import { Match, Show, Switch, createEffect, createSignal, onSettled, untrack, useContext } from 'solid-js';

import { Transition } from '../../utils/transitions';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';
import { MaterialIcon } from '../icon/MaterialIcon';
import { MaterialRipple } from '../ripple/MaterialRipple';
import { Span } from '../typography/Typography';

import { MaterialSearchOpenContext, MaterialSearchShouldExpandContext } from './MaterialSearch';

import styles from './MaterialSearchBar.module.css';

import ChevronBackwardIcon from '@solidmaterial/icons/400/outlined/chevron_backward.svg';
import CloseIcon from '@solidmaterial/icons/400/outlined/close.svg';
import SearchIcon from '@solidmaterial/icons/400/outlined/search.svg';

export interface MaterialSearchBarProps {
  input: string;
  placeholder?: string;
  leadingButton?: JSX.Element;
  trailingButtons?: (focus: boolean) => JSX.Element;
  initialFocus?: boolean;
  showClearButton?: boolean;
  backButtonAriaLabel?: string;
  clearButtonAriaLabel?: string;
  shouldOpen: (value: string) => boolean;
}

export const MaterialSearchBar: VoidComponent<MaterialSearchBarProps> = props => {
  const [refInput, setRefInput] = createSignal<HTMLInputElement>();

  const shouldExpand = useContext(MaterialSearchShouldExpandContext);
  const [isOpen, setOpen] = useContext(MaterialSearchOpenContext);

  const [isExpanded, setIsExpanded] = createSignal(props.initialFocus ?? false);

  const [input, setInput] = createSignal(() => props.input);

  onSettled(() => {
    if (isExpanded()) {
      refInput()?.focus();
    }
  });

  // Move to expanded state when input gains focus and move back to the
  // collapsed state when focus is moved to an element outside the search bar
  //
  // When the user clicks on a search result, it may update the
  // input text in the search bar. In that case the input field
  // should lose focus, but the search bar itself should stay
  // in the 'focused' state
  //
  // The bar can be in one of four states:
  //
  // 1. The bar is collapsed and the input field has no focus
  // 2. The user has clicked or moved focus to the input field, the bar expands
  // 3. The user entered text for which search results should be opened
  // 4. The user has clicked on a search result, the input text is changed and
  //    focus is lost, but the bar remains expanded
  //
  // | State | Expanded | Focused | Search results |
  // +-------+----------+---------+----------------+
  // | 1     | No       | No      | No             |
  // | 2     | Yes      | Yes     | No             |
  // | 3     | Yes      | Yes     | Yes            |
  // | 4     | Yes      | No      | No             |
  //
  // State transition graph:
  //
  // +-------------------- 4 <-----------------+
  // |                     |                   |
  // | clicked outside     | clicked bar       | clicked search result
  // |                     |                   |
  // |   clicked outside   |  should not open  |
  // v <------------------ v <---------------- |
  // 1 ------------------> 2 ----------------> 3
  // ^  input gains focus       should open    |
  // |                                         |
  // +-----------------------------------------+
  //               clicked backdrop

  createEffect(
    () => isExpanded(),
    isExpanded => {
      const input = untrack(() => refInput());
      if (input instanceof HTMLInputElement) {
        if (!isExpanded) {
          // If the search bar is collapsed, then it should never has focus
          input.blur();
        } else {
          // Trigger re-showing the search results
          setOpen(props.shouldOpen(input.value));
        }
      }
    }
  );

  createEffect(
    () => shouldExpand(),
    barShouldExpand => {
      if (!barShouldExpand) {
        setIsExpanded(false);
      }
    }
  );

  createEffect(
    () => input(),
    value => {
      setOpen(props.shouldOpen(value));
    }
  );

  const onInteractOutside = () => {
    if (!isOpen()) {
      setIsExpanded(false);
    }
  };

  const onInputFocus = (focus: boolean) => {
    // Expand if user moved focus to input field
    if (focus) {
      setIsExpanded(true);
    }
  };

  const onInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = event => {
    setInput(event.target.value);
  };

  const onClickBack = () => {
    setInput('');
    setIsExpanded(props.initialFocus ?? false);
  };

  const onClickClear = () => {
    setInput('');
    refInput()?.focus();
  };

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
          ref={[focus(onInputFocus), setRefInput]}
          role="searchbox"
          type="text"
          name="search"
          autocomplete="off"
          placeholder={props.placeholder}
          required
          value={input()}
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
