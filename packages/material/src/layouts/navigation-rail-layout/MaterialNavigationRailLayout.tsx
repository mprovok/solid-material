import type { Accessor, Context, FlowComponent } from 'solid-js';

import { createElementSize } from '@solid-primitives/resize-observer';
import { createContext, createEffect, createMemo, createSignal } from 'solid-js';

import type { MaterialNavigationLayoutProps } from '../navigation-layout/MaterialNavigationLayout.types';

import { MaterialNavigationRail } from '../../components/navigation-rail/MaterialNavigationRail';
import { Breakpoints } from '../../utils/breakpoints';
import { shouldShowBar } from '../navigation-layout/utils';

import styles from './MaterialNavigationRailLayout.module.css';

// Provide an accessor otherwise the consumers do not receive the updated rail width
export const MaterialNavigationLayoutRailWidthContext: Context<Accessor<number> | undefined> =
  createContext<Accessor<number>>();

export const MaterialNavigationRailMenuContext: Context<
  [Accessor<boolean>, Accessor<boolean>, (event: PointerEvent) => void]
> = createContext<[Accessor<boolean>, Accessor<boolean>, (event: PointerEvent) => void]>([
  () => false,
  () => false,
  () => {
    // Empty
  }
]);

export const MaterialNavigationRailLayout: FlowComponent<MaterialNavigationLayoutProps> = props => {
  const numberOfItemsForRail = () => props.items.length + (props.secondary?.items.length ?? 0);
  const hasManyItemsForRail = () =>
    Breakpoints.isCompactHeight() && (props.fab ? numberOfItemsForRail() > 3 : numberOfItemsForRail() > 4);

  const showRail = createMemo(() => props.show !== false && !shouldShowBar(props.items.length, props.preferSpace));

  const [target, setTarget] = createSignal<HTMLElement>();
  const elementSize = createElementSize(target);

  const [navigationRailWidth, setNavigationRailWidth] = createSignal(0);

  createEffect(prev => {
    if (elementSize.width !== null && elementSize.width !== prev) {
      setNavigationRailWidth(elementSize.width);
    }

    return elementSize.width;
  }, elementSize.width ?? 0);

  const [isExpanded, setIsExpanded] = createSignal(Breakpoints.isExtraLargeWidth());

  const onClickMenuButton = () => setIsExpanded(expanded => !expanded);

  const isModal = createMemo(
    () =>
      Breakpoints.isCompactWidth() ||
      Breakpoints.isMediumWidth() ||
      (Breakpoints.isExpandedWidth() && props.preferSpace === 'horizontal') ||
      hasManyItemsForRail()
  );

  const isHideWhenCollapsed = createMemo(() => Breakpoints.isCompactWidth() || hasManyItemsForRail());

  const isHiddenWhenCollapsed = createMemo(
    () => props.menuButton !== undefined && showRail() && isModal() && isHideWhenCollapsed()
  );

  return (
    <sm-nav-rail-layout class={styles['container']}>
      <div class={styles['rail']} bool:data-show={showRail()} ref={setTarget}>
        <MaterialNavigationRail
          show={showRail()}
          items={props.items}
          secondary={props.secondary}
          ariaLabel={props.ariaLabel}
          fab={props.fab?.rail}
          menuButton={props.menuButton}
          modal={isModal()}
          hideWhenCollapsed={isHideWhenCollapsed()}
          center={Breakpoints.isMediumWidth() && !Breakpoints.isCompactHeight()}
          expanded={isExpanded()}
          onClickMenuButton={onClickMenuButton}
        />
      </div>
      <MaterialNavigationLayoutRailWidthContext.Provider value={navigationRailWidth}>
        <MaterialNavigationRailMenuContext.Provider value={[isHiddenWhenCollapsed, isExpanded, onClickMenuButton]}>
          {props.children}
        </MaterialNavigationRailMenuContext.Provider>
      </MaterialNavigationLayoutRailWidthContext.Provider>
    </sm-nav-rail-layout>
  );
};
