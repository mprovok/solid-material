import type { FlowComponent } from 'solid-js';

import { For, children, createSignal } from 'solid-js';

import styles from './MaterialButtonGroup.module.css';

export type MaterialButtonGroupVariant = 'standard' | 'connected';

export interface MaterialButtonGroupProps {
  variant: MaterialButtonGroupVariant;
}

const MINIMUM_WIDTH_PX = 4;

export const MaterialButtonGroup: FlowComponent<MaterialButtonGroupProps> = props => {
  const [width, setWidth] = createSignal(MINIMUM_WIDTH_PX);

  const onPointerEnter = (event: PointerEvent) => {
    if (event.target instanceof HTMLElement) {
      setWidth(Math.max(MINIMUM_WIDTH_PX, event.target.getBoundingClientRect().width));
    }
  };

  const buttons = children(() => props.children);

  return (
    <sm-button-group data-variant={props.variant} class={styles['group']} style={{ '--width': `${width()}px` }}>
      <For each={buttons.toArray()} keyed={false}>
        {button => <div onPointerEnter={onPointerEnter}>{button()}</div>}
      </For>
    </sm-button-group>
  );
};
