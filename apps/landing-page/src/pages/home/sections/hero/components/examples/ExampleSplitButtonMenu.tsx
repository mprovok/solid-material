import type { VoidComponent } from 'solid-js';

import { showSnack } from '@solidmaterial/material/components/snackbar';
import { MaterialSplitButtonMenu } from '@solidmaterial/material/components/split-button';
import { createSignal } from 'solid-js';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

const LABELS = ['Label', 'Two', 'Three'];

export const ExampleSplitButtonMenu: VoidComponent = () => {
  const [label, setLabel] = createSignal('Label');

  const onClick = () => {
    showSnack({
      text: `Clicked on ${label()}`,
      dismissable: false
    });
  };

  return (
    <MaterialSplitButtonMenu
      variant="filled"
      icon={<EditIcon />}
      menuItems={LABELS.map(text => ({ label: text, onClick: () => setLabel(text) }))}
      onClick={onClick}
    >
      {label()}
    </MaterialSplitButtonMenu>
  );
};
