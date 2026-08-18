import type { VoidComponent } from 'solid-js';

import { MaterialIcon } from '@solid-material/material/components/icon';
import { MaterialList, MaterialListItem } from '@solid-material/material/components/list';

import StarIcon from '@solid-material/icons/400/outlined/star.svg';

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
