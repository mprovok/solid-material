import type { VoidComponent } from 'solid-js';

import { MaterialButton } from '@solidmaterial/material/components/button';
import { MaterialButtonGroup } from '@solidmaterial/material/components/button-group';
import { Breakpoints } from '@solidmaterial/material/utils';
import { Index, createSignal } from 'solid-js';

const LABELS = ['One', 'Two', 'Three'];
const LABELS_MOBILE = ['A', 'B', 'C'];

export const ExampleConnectedButtonGroup: VoidComponent = () => {
  const [toggled, setToggled] = createSignal<number>(0);

  const isMobile = () => Breakpoints.isCompactWidth();

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
            {isMobile() ? LABELS_MOBILE[index] : LABELS[index]}
          </MaterialButton>
        )}
      </Index>
    </MaterialButtonGroup>
  );
};
