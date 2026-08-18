import type { FlowComponent } from 'solid-js';

import { Index, children, createSignal } from 'solid-js';

import styles from './MaterialButtonGroup.module.css';

export type MaterialButtonGroupVariant = 'standard' | 'connected';

export interface MaterialButtonGroupProps {
  variant: MaterialButtonGroupVariant;
}

export const MaterialButtonGroup: FlowComponent<MaterialButtonGroupProps> = props => {
  const [width, setWidth] = createSignal(4);

  const onPointerEnter = (event: PointerEvent) => {
    if (event.target instanceof HTMLElement) {
      setWidth(Math.max(4, event.target.getBoundingClientRect().width));
    }
  };

  const buttons = children(() => props.children);

  return (
    <sm-button-group attr:data-variant={props.variant} class={styles['group']} style={{ '--width': `${width()}px` }}>
      <Index each={buttons.toArray()}>{button => <div onPointerEnter={onPointerEnter}>{button()}</div>}</Index>
    </sm-button-group>
  );
};
