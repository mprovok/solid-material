import type { Context, ParentComponent } from 'solid-js';

import { createContext } from 'solid-js';

import { createOnKeyDown } from '../../utils/a11y';

import styles from './MaterialList.module.css';

export const MaterialListSelectableContext: Context<boolean> = createContext(false);

export type MaterialListSelectable = 'single' | 'multi';

export interface MaterialListProps {
  segmented?: boolean;
  selectable?: MaterialListSelectable;
  ariaLabel?: string;
}

export const MaterialList: ParentComponent<MaterialListProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let refList!: HTMLElement;

  const isMultiselectable = () => (props.selectable === 'multi' ? true : undefined);

  const isEnabledItem = (target: EventTarget): target is HTMLButtonElement => {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    const isInteractive = 'interactive' in target.dataset;
    const isDisabled = 'disabled' in target.dataset;

    return isInteractive && !isDisabled;
  };

  const listItemRole = () => (props.selectable ? 'option' : 'listitem');
  const setFocus = (element?: HTMLElement) => element?.querySelector<HTMLElement>('button, a')?.focus();

  const onKeyDown = createOnKeyDown(
    listItemRole,
    () => ['ArrowDown'],
    () => ['ArrowUp'],
    isEnabledItem,
    () => refList,
    () => {
      /* empty */
    },
    (element?: HTMLOrSVGElement) => {
      if (element instanceof HTMLElement) {
        setFocus(element);
      }
    }
  );

  return (
    <sm-list
      ref={refList}
      class={styles['list']}
      role={props.selectable ? 'listbox' : 'list'}
      attr:aria-label={props.ariaLabel}
      attr:aria-multiselectable={isMultiselectable()}
      bool:data-segmented={props.segmented}
      onKeyDown={onKeyDown}
    >
      <MaterialListSelectableContext.Provider value={props.selectable !== undefined}>
        {props.children}
      </MaterialListSelectableContext.Provider>
    </sm-list>
  );
};
