import type { MaterialIconSvg } from '@solid-material/material/components/icon';
import type { VoidComponent } from 'solid-js';

import { MaterialIcon } from '@solid-material/material/components/icon';
import { MaterialList, MaterialListItem } from '@solid-material/material/components/list';
import { For } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export type ListItemType = {
  name: string;
  label: string;
  icon: MaterialIconSvg;
  supportingText?: string;
  overlineText?: string;
};

export interface ListProps {
  items: ListItemType[];
  name: string | undefined;
  onClick: (name: string) => void;
  ariaLabel?: string;
}

export const List: VoidComponent<ListProps> = props => {
  return (
    <MaterialList segmented={true} selectable="single" ariaLabel={props.ariaLabel}>
      <For each={props.items}>
        {item => (
          <MaterialListItem
            selected={props.name === item.name}
            start={
              <MaterialIcon>
                <Dynamic component={item.icon} />
              </MaterialIcon>
            }
            overlineText={item.overlineText}
            supportingText={item.supportingText}
            onClick={() => props.onClick(item.name)}
          >
            {item.label}
          </MaterialListItem>
        )}
      </For>
    </MaterialList>
  );
};
