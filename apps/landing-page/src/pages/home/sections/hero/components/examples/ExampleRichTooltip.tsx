import type { VoidComponent } from 'solid-js';

import { MaterialButton } from '@solid-material/material/components/button';
import { showSnack } from '@solid-material/material/components/snackbar';
import { MaterialRichTooltip } from '@solid-material/material/components/tooltip';
import { createSignal } from 'solid-js';

const getMessage = (count: number) => {
  if (count === 1) {
    return 'Did you just press that button in the tooltip?';
  } else if (count === 2) {
    return 'You pressed it again!';
  } else if (count === 6) {
    return 'Try to click this action button instead';
  } else if (count === 7) {
    return 'You want me to remove the close button?';
  } else if (count === 8) {
    return 'Close button removed!';
  }
  return `Button pressed ${count} times`;
};

export const ExampleRichTooltip: VoidComponent = () => {
  const [snackCounter, setSnackCounter] = createSignal(1);

  return (
    <MaterialRichTooltip
      title="Title"
      actions={
        <MaterialButton
          variant="text"
          onClick={() => {
            showSnack({
              text: getMessage(snackCounter()),
              dismissable: snackCounter() >= 4 && snackCounter() <= 7,
              action:
                snackCounter() >= 6
                  ? {
                      label: 'Reset counter',
                      onClick: () => setSnackCounter(1)
                    }
                  : undefined
            });
            setSnackCounter(c => c + 1);
          }}
        >
          Button
        </MaterialButton>
      }
    >
      A rich tooltip with a title, supporting text and a button.
    </MaterialRichTooltip>
  );
};
