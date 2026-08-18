import type { Context, FlowComponent } from 'solid-js';

import { createMutationObserver } from '@solid-primitives/mutation-observer';
import { createContext, createSignal, onCleanup } from 'solid-js';

export const MaterialSkeletonIndexContext: Context<{
  add: (target: Element) => void;
  remove: (target: Element) => void;
  index: (ref: Element) => number;
}> = createContext<{
  add: (target: Element) => void;
  remove: (target: Element) => void;
  index: (ref: Element) => number;
}>({
  add: () => {
    /* empty */
  },
  remove: () => {
    /* empty */
  },
  index: () => 0
});

export const MaterialSkeletonManager: FlowComponent = props => {
  const [skeletons, setSkeletons] = createSignal<Element[]>([]);

  const updateVisibleSkeletons = () => {
    setSkeletons([...document.querySelectorAll('sm-skeleton[data-show]')]);
  };

  const onAttributeChange = (records: MutationRecord[]) => {
    const skeletonRecord = records.find(record => record.attributeName === 'data-show');

    if (skeletonRecord?.target instanceof HTMLElement) {
      updateVisibleSkeletons();
    }
  };

  const [observe, { stop }] = createMutationObserver([], { attributes: true }, onAttributeChange);

  const add = (target: Element) => {
    updateVisibleSkeletons();
    observe(target);
  };

  const remove = (_target: Element) => {
    updateVisibleSkeletons();
  };

  const index = (target: Element): number => {
    return skeletons().indexOf(target);
  };

  onCleanup(() => {
    stop();
  });

  return (
    <MaterialSkeletonIndexContext.Provider value={{ add, remove, index }}>
      {props.children}
    </MaterialSkeletonIndexContext.Provider>
  );
};
