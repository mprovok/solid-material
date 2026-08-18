import type { Accessor, Context, FlowComponent } from 'solid-js';

import { createElementSize } from '@solid-primitives/resize-observer';
import { createContext, createEffect, createSignal } from 'solid-js';

import type { MaterialNavigationLayoutProps } from '../navigation-layout/MaterialNavigationLayout.types';

import { MaterialNavigationRail } from '../../components/navigation-rail/MaterialNavigationRail';
import { Breakpoints } from '../../utils/breakpoints';
import { shouldShowBar } from '../navigation-layout/utils';

import styles from './MaterialNavigationRailLayout.module.css';

// Provide an accessor otherwise the consumers do not receive the updated rail width
export const MaterialNavigationLayoutRailWidthContext: Context<Accessor<number> | undefined> =
  createContext<Accessor<number>>();

export const MaterialNavigationRailLayout: FlowComponent<MaterialNavigationLayoutProps> = props => {
  const numberOfItemsForRail = () => props.items.length + (props.secondary?.items.length ?? 0);
  const hasManyItemsForRail = () =>
    Breakpoints.isCompactHeight() && (props.fab ? numberOfItemsForRail() > 3 : numberOfItemsForRail() > 4);

  const showRail = () => props.show !== false && !shouldShowBar(props.items.length, props.preferSpace);

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
          modal={
            Breakpoints.isCompactWidth() ||
            Breakpoints.isMediumWidth() ||
            (Breakpoints.isExpandedWidth() && props.preferSpace === 'horizontal') ||
            hasManyItemsForRail()
          }
          hideWhenCollapsed={Breakpoints.isCompactWidth() || hasManyItemsForRail()}
          center={Breakpoints.isMediumWidth() && !Breakpoints.isCompactHeight()}
          expanded={isExpanded()}
          onClickMenuButton={onClickMenuButton}
        />
      </div>
      <MaterialNavigationLayoutRailWidthContext.Provider value={navigationRailWidth}>
        {props.children}
      </MaterialNavigationLayoutRailWidthContext.Provider>
    </sm-nav-rail-layout>
  );
};
