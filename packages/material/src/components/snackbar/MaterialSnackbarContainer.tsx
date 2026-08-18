import type { FlowComponent, JSX, VoidComponent } from 'solid-js';

import { resolveFirst } from '@solid-primitives/refs';
import { createSwitchTransition } from '@solid-primitives/transition-group';
import { Show, useContext } from 'solid-js';

import type { MaterialSnackbarModalAlignment } from './MaterialSnackbarModal';

import { MaterialSnackbarContext } from './MaterialSnackbarContext';
import { MaterialSnackbarModal } from './MaterialSnackbarModal';

export type MaterialSnackbarContainerAlignment = MaterialSnackbarModalAlignment;

export interface MaterialSnackbarContainerProps {
  alignment?: MaterialSnackbarContainerAlignment;
  closeTitle?: string;
}

export const SnackbarTransition: FlowComponent = props => {
  const transition = createSwitchTransition<HTMLElement | null>(
    resolveFirst(
      () => props.children,
      (item: JSX.Element): item is HTMLElement => item instanceof HTMLElement
    ),
    {
      mode: 'out-in',
      appear: true,
      onEnter(el, done) {
        queueMicrotask(() => {
          if (!el.parentNode) {
            done();
          }

          el.showPopover();

          const snackbar = el.querySelector('sm-snackbar');

          const onTransitionEndCancel = (event: Event) => {
            // Check that the transition event was emitted by the snackbar
            // itself, not by a child like the action button
            if (event.target === event.currentTarget) {
              event.currentTarget?.removeEventListener('transitionend', onTransitionEndCancel);
              event.currentTarget?.removeEventListener('transitioncancel', onTransitionEndCancel);
              done();
            }
          };

          if (snackbar instanceof HTMLElement) {
            snackbar.dataset['show'] = '';
            snackbar.addEventListener('transitionend', onTransitionEndCancel);
            snackbar.addEventListener('transitioncancel', onTransitionEndCancel);
          }
        });
      },
      onExit(el, done) {
        if (!el.parentNode) {
          done();
        }

        const snackbar = el.querySelector('sm-snackbar');

        let timer: number | undefined;

        const onTransitionEndCancel = (event: Event) => {
          // Check that the transition event was emitted by the snackbar
          // itself, not by a child like the action button
          if (event.target === event.currentTarget) {
            event.currentTarget?.removeEventListener('transitionend', onTransitionEndCancel);
            event.currentTarget?.removeEventListener('transitioncancel', onTransitionEndCancel);
            clearTimeout(timer);
            done();
          }
        };

        if (snackbar instanceof HTMLElement) {
          delete snackbar.dataset['show'];
          snackbar.addEventListener('transitionend', onTransitionEndCancel);
          snackbar.addEventListener('transitioncancel', onTransitionEndCancel);

          // On Firefox the exit animation doesn't run, so use a
          // timeout to force the exiting snackbar to be removed
          // See https://bugzilla.mozilla.org/show_bug.cgi?id=1882408
          timer = setTimeout(done, 250);
        }
      }
    }
  );

  return <>{transition()}</>;
};

export const MaterialSnackbarContainer: VoidComponent<MaterialSnackbarContainerProps> = props => {
  const [state, setState] = useContext(MaterialSnackbarContext);

  const removeLast = () => setState(snacks => snacks.toSpliced(-1));
  const currentSnack = () => state.at(-1);

  return (
    <SnackbarTransition>
      <Show when={currentSnack()} keyed>
        <MaterialSnackbarModal
          snack={currentSnack()!}
          onClose={removeLast}
          alignment={props.alignment}
          closeTitle={props.closeTitle}
        />
      </Show>
    </SnackbarTransition>
  );
};
