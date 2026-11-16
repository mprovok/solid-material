import type { MaterialIconSvg } from '@solidmaterial/material/components/icon';
import type { VoidComponent } from 'solid-js';

import { dynamic } from '@solidjs/web';
import { MaterialIcon } from '@solidmaterial/material/components/icon';
import { MaterialList, MaterialListItem } from '@solidmaterial/material/components/list';
import { For } from 'solid-js';

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
        {item => {
          const Icon = dynamic(() => item.icon);

          return (
            <MaterialListItem
              selected={props.name === item.name}
              start={
                <MaterialIcon>
                  <Icon />
                </MaterialIcon>
              }
              overlineText={item.overlineText}
              supportingText={item.supportingText}
              onClick={() => props.onClick(item.name)}
            >
              {item.label}
            </MaterialListItem>
          );
        }}
      </For>
    </MaterialList>
  );
};
