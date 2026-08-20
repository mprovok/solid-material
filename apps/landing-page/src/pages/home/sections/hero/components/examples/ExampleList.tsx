import type { VoidComponent } from 'solid-js';

import { MaterialIcon } from '@solidmaterial/material/components/icon';
import { MaterialList, MaterialListItem } from '@solidmaterial/material/components/list';

import StarIcon from '@solidmaterial/icons/400/outlined/star.svg';

export const ExampleList: VoidComponent = () => (
  <MaterialList segmented={true}>
    <MaterialListItem
      start={
        <MaterialIcon>
          <StarIcon />
        </MaterialIcon>
      }
    >
      Label
    </MaterialListItem>
    <MaterialListItem
      start={
        <MaterialIcon>
          <StarIcon />
        </MaterialIcon>
      }
    >
      Label
    </MaterialListItem>
    <MaterialListItem
      start={
        <MaterialIcon>
          <StarIcon />
        </MaterialIcon>
      }
    >
      Label
    </MaterialListItem>
  </MaterialList>
);
