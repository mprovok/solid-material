import type { VoidComponent } from 'solid-js';

import { MaterialIconButton } from '@solid-material/material/components/icon-button';
import { MaterialSearch, MaterialSearchBar } from '@solid-material/material/components/search';
import { Match, Switch, createSignal } from 'solid-js';

import FavoriteIcon from '@solid-material/icons/400/outlined/favorite.svg';
import MapIcon from '@solid-material/icons/400/outlined/map.svg';
import StarIcon from '@solid-material/icons/400/outlined/star.svg';

export const ExampleSearchBar: VoidComponent = () => {
  const [searchInput, setSearchInput] = createSignal('');

  return (
    <MaterialSearch open={false}>
      <MaterialSearchBar
        placeholder="Placeholder"
        input={searchInput}
        setInput={setSearchInput}
        initialFocus={false}
        showClearButton={true}
        trailingButtons={focus => (
          <Switch>
            <Match when={focus}>
              <MaterialIconButton variant="text" icon={<FavoriteIcon />} />
            </Match>
            <Match when={!focus}>
              <MaterialIconButton variant="text" icon={<StarIcon />} />
              <MaterialIconButton variant="text" icon={<MapIcon />} />
            </Match>
          </Switch>
        )}
      />
    </MaterialSearch>
  );
};
