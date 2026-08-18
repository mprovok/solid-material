import type { FlowComponent } from 'solid-js';

import type { MaterialNavigationLayoutProps } from '../navigation-layout/MaterialNavigationLayout.types';

import { MaterialNavigationBar } from '../../components/navigation-bar/MaterialNavigationBar';
import { MaterialSnackbarContainer } from '../../components/snackbar/MaterialSnackbarContainer';
import { Breakpoints } from '../../utils/breakpoints';
import { createDebouncedMemo } from '../../utils/utils';
import { shouldShowBar } from '../navigation-layout/utils';

import styles from './MaterialNavigationBarLayout.module.css';

export const MaterialNavigationBarLayout: FlowComponent<MaterialNavigationLayoutProps> = props => {
  const showBar = () => props.show !== false && shouldShowBar(props.items.length, props.preferSpace);
  const showFab = () => props.fab?.bar !== undefined && (showBar() || props.fab?.rail === undefined);

  const isMediumLayout = createDebouncedMemo(() => !Breakpoints.isCompactWidth(), 50);

  return (
    <sm-nav-bar-layout class={styles['container']}>
      {props.children}
      <div class={styles['bar']} bool:data-show={showBar()}>
        <div class={styles['snackbar-fab']}>
          <div class={styles['snackbar']}>
            <MaterialSnackbarContainer alignment={props.snackbarAlignment} closeTitle={props.snackbarCloseTitle} />
          </div>
          <div class={styles['fab']} bool:data-show={showFab()}>
            {props.fab?.bar}
          </div>
        </div>
        <MaterialNavigationBar
          show={showBar()}
          expanded={isMediumLayout()}
          items={props.items}
          ariaLabel={props.ariaLabel}
        />
      </div>
    </sm-nav-bar-layout>
  );
};
