import type { TransitionMode } from '@solid-primitives/transition-group';
import type { BeforeLeaveEventArgs } from '@solidjs/router';
import type { FlowComponent, JSX } from 'solid-js';

import { resolveFirst } from '@solid-primitives/refs';
import { createSwitchTransition } from '@solid-primitives/transition-group';
import { useBeforeLeave } from '@solidjs/router';

/**
 * Enable animated transitions between pages using the View Transitions API
 *
 * Use the 'transition' key from the navigation state to specify the
 * view transition to use.
 */
export const enableViewTransitions = (): void => {
  useBeforeLeave((event: BeforeLeaveEventArgs) => {
    event.preventDefault();

    // Use the 'transition' key from the navigation state to specify
    // the view transition to use
    // oxlint-disable-next-line no-unsafe-type-assertion
    const state = event.options?.state as Record<string, unknown> | undefined;
    const transition = state?.['transition'];

    document.startViewTransition({
      update: () => event.retry(true),
      // oxlint-disable-next-line unicorn/no-null
      types: typeof transition === 'string' ? [transition] : null
    });
  });
};

export interface TransitionProps {
  mode?: TransitionMode;
}

/**
 * A component which adds or removes the data-show attribute to its
 * children when they are added or removed from the component tree
 *
 * Entering or exiting the tree ends when the CSS transitions of the
 * child element have ended or have been canceled.
 */
export const Transition: FlowComponent<TransitionProps> = props => {
  const transition = createSwitchTransition<HTMLElement | null>(
    resolveFirst(
      () => props.children,
      (item: JSX.Element): item is HTMLElement => item instanceof HTMLElement
    ),
    {
      mode: props.mode ?? 'parallel',
      appear: true,
      onEnter(el, done) {
        queueMicrotask(() => {
          if (!el.parentNode) {
            done();
          }

          el.dataset['show'] = '';
          el.addEventListener('transitionend', done, { once: true });
          el.addEventListener('transitioncancel', done, { once: true });
        });
      },
      onExit(el, done) {
        if (!el.parentNode) {
          done();
        }

        delete el.dataset['show'];
        el.addEventListener('transitionend', done, { once: true });
        el.addEventListener('transitioncancel', done, { once: true });
      }
    }
  );

  return <>{transition()}</>;
};
