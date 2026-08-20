import type { VoidComponent } from 'solid-js';

import { showSnack } from '@solidmaterial/material/components/snackbar';
import { MaterialSplitButtonMenu } from '@solidmaterial/material/components/split-button';
import { createSignal } from 'solid-js';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

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
      menuItems={[
        {
          label: 'Label',
          onClick: () => setLabel('Label')
        },
        {
          label: 'Label 2',
          onClick: () => setLabel('Label 2')
        },
        {
          label: 'Label 3',
          onClick: () => setLabel('Label 3')
        }
      ]}
      onClick={onClick}
    >
      {label()}
    </MaterialSplitButtonMenu>
  );
};
