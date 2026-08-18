import type { FlowComponent } from 'solid-js';

import { Show } from 'solid-js';

import type { MaterialFabProps } from '../fab/MaterialFab';

import { Breakpoints } from '../../utils/breakpoints';
import { MaterialFab } from '../fab/MaterialFab';

import styles from './MaterialToolbar.module.css';

export type MaterialToolbarDirection = 'horizontal' | 'vertical';

export type MaterialToolbarMode = 'floating' | 'docked';

export type MaterialToolbarColor = 'standard' | 'vibrant';

export type MaterialToolbarFab = Omit<MaterialFabProps, 'size' | 'iconOnly' | 'ariaExpanded' | 'shape'>;

export interface MaterialToolbarProps {
  direction: MaterialToolbarDirection;
  mode: MaterialToolbarMode;
  color?: MaterialToolbarColor;
  fab?: MaterialToolbarFab;
  show?: boolean;
}

export const MaterialToolbar: FlowComponent<MaterialToolbarProps> = props => {
  const direction = () => (props.mode === 'docked' ? 'horizontal' : props.direction);
  const center = () => !Breakpoints.isCompactWidth() && !Breakpoints.isMediumWidth();

  return (
    <div class={styles['container']} bool:data-show={props.show ?? true}>
      <sm-toolbar
        role="toolbar"
        aria-orientation={props.direction}
        class={styles['toolbar']}
        attr:data-direction={direction()}
        attr:data-mode={props.mode}
        attr:data-color={props.color ?? 'standard'}
        bool:data-center={center()}
      >
        <md-elevation></md-elevation>
        {props.children}
      </sm-toolbar>
      <Show when={props.mode === 'floating' && props.fab}>
        {fab => <MaterialFab {...fab()} size="small" iconOnly={true} />}
      </Show>
    </div>
  );
};
