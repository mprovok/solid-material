import type { VoidComponent } from 'solid-js';

import { Index, Show, createMemo } from 'solid-js';

import type { MaterialNavigationItemType } from '../navigation-item/MaterialNavigationItem';

import { createOnKeyDown } from '../../utils/a11y';
import { MaterialNavigationItem, isEnabledNavigationItem } from '../navigation-item/MaterialNavigationItem';
import { Span } from '../typography/Typography';

import type { MaterialNavigationRailFab } from './MaterialNavigationRailFabButton';
import type { MaterialNavigationMenuButton } from './MaterialNavigationRailMenuButton';

import { MaterialNavigationRailFabButton } from './MaterialNavigationRailFabButton';
import { MaterialNavigationRailMenuButton } from './MaterialNavigationRailMenuButton';

import styles from './MaterialNavigationRail.module.css';

export type MaterialNavigationRailSecondaryItems = {
  label: string;
  items: MaterialNavigationItemType[];
};

export interface MaterialNavigationRailProps {
  show: boolean;
  items: MaterialNavigationItemType[];
  secondary?: MaterialNavigationRailSecondaryItems;
  fab?: MaterialNavigationRailFab;
  menuButton?: MaterialNavigationMenuButton;
  modal?: boolean;
  expanded?: boolean;
  hideWhenCollapsed?: boolean;
  center?: boolean;
  ariaLabel?: string;
  onClickMenuButton?: (event: PointerEvent) => void;
}

export const MaterialNavigationRail: VoidComponent<MaterialNavigationRailProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let refList!: HTMLDivElement;

  const navigateToItem = (_index: number, item: HTMLElement) => item.click();

  const onKeyDown = createOnKeyDown(
    () => 'menuitem',
    () => ['ArrowDown'],
    () => ['ArrowUp'],
    isEnabledNavigationItem,
    () => refList,
    navigateToItem
  );

  // Reuse the previous value when hiding the rail
  // so that it does not change its appearance while it is
  // moving to a hidden position
  const isExpanded = createMemo((prev: boolean | undefined) =>
    props.show || prev === undefined ? Boolean(props.expanded) : prev
  );
  const isModal = createMemo((prev: boolean | undefined) =>
    props.show || prev === undefined ? Boolean(props.modal) : prev
  );
  const isCenter = createMemo((prev: boolean | undefined) =>
    props.show || prev === undefined ? Boolean(props.center) : prev
  );
  const isHideWhenCollapsed = createMemo((prev: boolean | undefined) =>
    props.show || prev === undefined ? Boolean(props.hideWhenCollapsed) : prev
  );

  const hasMenuButton = () => props.menuButton !== undefined;
  const isHiddenWhenCollapsed = createMemo(() => hasMenuButton() && isModal() && isHideWhenCollapsed());
  const isVisuallyExpanded = createMemo(() => isExpanded() || isHiddenWhenCollapsed());

  return (
    <sm-navigation-rail
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="navigation"
      aria-label={props.ariaLabel}
      class={styles['container']}
      bool:data-modal={isModal()}
      bool:data-center={isCenter()}
      bool:data-always-expanded={isHiddenWhenCollapsed()}
      bool:data-show={isExpanded() && isHiddenWhenCollapsed()}
    >
      <div class={styles['rail-container']}>
        <div class={styles['rail']} bool:data-expanded={isVisuallyExpanded()}>
          <md-elevation></md-elevation>
          <div class={styles['menu-fab']}>
            <Show when={hasMenuButton()}>
              <MaterialNavigationRailMenuButton
                {...props.menuButton}
                expanded={isExpanded()}
                onClick={props.onClickMenuButton}
              />
            </Show>
            <Show when={props.fab}>
              {fab => <MaterialNavigationRailFabButton {...fab()} expanded={isVisuallyExpanded()} />}
            </Show>
          </div>
          <div class={styles['center-items']}>
            <div
              ref={refList}
              tabindex={-1}
              role="menubar"
              aria-orientation="vertical"
              class={styles['items']}
              onKeyDown={onKeyDown}
            >
              <Index each={props.items}>
                {item => <MaterialNavigationItem {...item()} expanded={isVisuallyExpanded()} />}
              </Index>
              <Show when={props.secondary}>
                {nonNullishSecondary => (
                  <Show when={nonNullishSecondary().items.length > 0}>
                    <Span role="label" size="large" class={styles['secondary-header']}>
                      {nonNullishSecondary().label}
                    </Span>
                    <Index each={nonNullishSecondary().items}>
                      {item => (
                        <MaterialNavigationItem
                          {...item()}
                          expanded={true}
                          disabled={!isVisuallyExpanded() || item().disabled}
                        />
                      )}
                    </Index>
                  </Show>
                )}
              </Show>
            </div>
          </div>
        </div>
      </div>
      <Show when={isHiddenWhenCollapsed()}>
        <div class={styles['fixed-menu-button']}>
          <MaterialNavigationRailMenuButton
            {...props.menuButton}
            expanded={isExpanded()}
            onClick={props.onClickMenuButton}
          />
        </div>
      </Show>
    </sm-navigation-rail>
  );
};
