import type { FlowComponent, VoidComponent } from 'solid-js';

import { Show, onCleanup, onMount, useContext } from 'solid-js';

import { Transition } from '../../utils/transitions';

import { MaterialSkeletonIndexContext } from './MaterialSkeletonManager';

import styles from './MaterialSkeleton.module.css';

export interface MaterialSkeletonProps {
  show: boolean;
}

const MaterialSkeletonLoader: VoidComponent = () => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDivElement;

  const { add, remove, index } = useContext(MaterialSkeletonIndexContext);

  onMount(() => {
    add(ref);
  });

  onCleanup(() => {
    remove(ref);
  });

  return <sm-skeleton ref={ref} class={styles['skeleton']} style={{ '--index': index(ref) }} />;
};

/**
 * A skeleton loader showing a pulsing animation
 */
export const MaterialSkeleton: FlowComponent<MaterialSkeletonProps> = props => {
  return (
    <div class={styles['container']}>
      {props.children}
      <Transition>
        <Show when={props.show} keyed>
          <MaterialSkeletonLoader />
        </Show>
      </Transition>
    </div>
  );
};
