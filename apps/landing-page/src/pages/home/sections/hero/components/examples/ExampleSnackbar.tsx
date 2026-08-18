import type { VoidComponent } from 'solid-js';

import { onMount } from 'solid-js';

import { MaterialSnackbar } from '../../../../../../../../../packages/material/src/components/snackbar/components/snackbar/MaterialSnackbar';

export const ExampleSnackbar: VoidComponent = () => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDivElement;

  onMount(() => {
    const snackbar = ref.querySelector('sm-snackbar');

    if (snackbar instanceof HTMLElement) {
      snackbar.dataset['show'] = '';
    }
  });

  return (
    <div ref={ref}>
      <MaterialSnackbar
        actionLabel="Action"
        onAction={() => {
          /* empty */
        }}
      >
        Supporting text
      </MaterialSnackbar>
    </div>
  );
};
