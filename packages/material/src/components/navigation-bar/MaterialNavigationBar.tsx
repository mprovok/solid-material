import type { VoidComponent } from 'solid-js';

import { Index, createMemo } from 'solid-js';

import type { MaterialNavigationItemType } from '../navigation-item/MaterialNavigationItem';

import { createOnKeyDown } from '../../utils/a11y';
import { MaterialNavigationItem, isEnabledNavigationItem } from '../navigation-item/MaterialNavigationItem';

import styles from './MaterialNavigationBar.module.css';

export interface MaterialNavigationBarProps {
  show: boolean;
  items: MaterialNavigationItemType[];
  activeTabIndex?: number;
  expanded?: boolean;
  ariaLabel?: string;
}

export const MaterialNavigationBar: VoidComponent<MaterialNavigationBarProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let refList!: HTMLDivElement;

  const navigateToItem = (_index: number, item: HTMLElement) => {
    item.click();
  };

  const onKeyDown = createOnKeyDown(
    () => 'menuitem',
    () => ['ArrowRight'],
    () => ['ArrowLeft'],
    isEnabledNavigationItem,
    () => refList,
    navigateToItem
  );

  // Reuse the previous value when hiding the bar
  // so that it does not change its appearance while it is
  // moving to a hidden position
  const isExpanded = createMemo((prev: boolean | undefined) =>
    props.show || prev === undefined ? Boolean(props.expanded) : prev
  );

  return (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
    <sm-navigation-bar role="navigation" class={styles['container']} aria-hidden={!props.show} inert={!props.show}>
      <md-elevation></md-elevation>
      <div
        ref={refList}
        tabindex={-1}
        role="menubar"
        bool:data-expanded={isExpanded()}
        aria-orientation="horizontal"
        aria-label={props.ariaLabel}
        class={styles['bar']}
        onKeyDown={onKeyDown}
      >
        <Index each={props.items}>
          {item => (
            <div>
              <MaterialNavigationItem {...item()} expanded={isExpanded()} />
            </div>
          )}
        </Index>
      </div>
    </sm-navigation-bar>
  );
};
