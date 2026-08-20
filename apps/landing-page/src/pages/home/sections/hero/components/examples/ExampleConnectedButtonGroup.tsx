import type { VoidComponent } from 'solid-js';

import { MaterialButton } from '@solidmaterial/material/components/button';
import { MaterialButtonGroup } from '@solidmaterial/material/components/button-group';
import { Index, createSignal } from 'solid-js';

export const ExampleConnectedButtonGroup: VoidComponent = () => {
  const [toggled, setToggled] = createSignal<number>(0);

  return (
    <MaterialButtonGroup variant="connected">
      <Index each={Array.from({ length: 3 })}>
        {(_, index) => (
          <MaterialButton
            variant="tonal"
            shape="round"
            size="small"
            toggle={toggled() === index}
            onClick={() => setToggled(index)}
          >
            Label
          </MaterialButton>
        )}
      </Index>
    </MaterialButtonGroup>
  );
};
