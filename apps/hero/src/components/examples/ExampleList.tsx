import type { VoidComponent } from 'solid-js';

import { MaterialIcon } from '@solidmaterial/material/components/icon';
import { MaterialList, MaterialListItem } from '@solidmaterial/material/components/list';
import { For } from 'solid-js';

import StarIcon from '@solidmaterial/icons/400/outlined/star.svg';

const LABELS = ['Segmented', 'Item', 'List'];

export const ExampleList: VoidComponent = () => (
  <MaterialList segmented={true}>
    <For each={Array.from({ length: 3 })} keyed={false}>
      {(_, index) => (
        <MaterialListItem
          start={
            <MaterialIcon>
              <StarIcon />
            </MaterialIcon>
          }
        >
          {LABELS[index]}
        </MaterialListItem>
      )}
    </For>
  </MaterialList>
);
