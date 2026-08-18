import preview from '../../../.storybook/preview';

import { MaterialChip } from './MaterialChip';
import { MaterialChipSet } from './MaterialChipSet';

import BatteryAndroidBoltIcon from '@solid-material/icons/400/outlined/battery_android_bolt.svg';
import CheckCircleIcon from '@solid-material/icons/400/outlined/check_circle.svg';
import MenuIcon from '@solid-material/icons/400/outlined/menu.svg';

const onRemoveFilter = (event: Event) => {
  console.info('onRemove', event);
};

const onClickFilter = (event: Event) => {
  console.info('onClick', event);
};

const meta = preview.meta({
  title: 'Components/MaterialChipSet',
  component: MaterialChipSet,
  tags: ['autodocs']
});

export const AssistChips = meta.story({
  tags: ['!test'],
  render: () => (
    <MaterialChipSet>
      <MaterialChip variant="assist" elevated>
        Elevated
      </MaterialChip>
      <MaterialChip variant="assist">Normal</MaterialChip>
      <MaterialChip variant="assist" ariaLabel="The ARIA label">
        ARIA label
      </MaterialChip>
      <MaterialChip variant="assist" elevated disabled>
        Elevated (disabled)
      </MaterialChip>
      <MaterialChip variant="assist" disabled>
        Disabled
      </MaterialChip>
      <MaterialChip variant="assist" disabled alwaysFocusable>
        Soft disabled
      </MaterialChip>
      <MaterialChip variant="assist" href="http://localhost:3000" target="_blank">
        Link
      </MaterialChip>
    </MaterialChipSet>
  )
});

export const FilterChips = meta.story({
  tags: ['!test'],
  render: () => (
    <MaterialChipSet>
      <MaterialChip variant="filter" selected={true} onClick={onClickFilter}>
        Selected
      </MaterialChip>
      <MaterialChip variant="filter" selected={false} onClick={onClickFilter}>
        Not selected
      </MaterialChip>

      <MaterialChip
        variant="filter"
        icon={<BatteryAndroidBoltIcon />}
        onRemove={onRemoveFilter}
        selected={true}
        onClick={onClickFilter}
      >
        Selected
      </MaterialChip>
      <MaterialChip
        variant="filter"
        icon={<BatteryAndroidBoltIcon />}
        onRemove={onRemoveFilter}
        selected={false}
        onClick={onClickFilter}
      >
        Not selected
      </MaterialChip>
      <MaterialChip
        variant="filter"
        icon={<MenuIcon />}
        selectedIcon={<CheckCircleIcon />}
        selected={true}
        onClick={onClickFilter}
      >
        Custom selected icon
      </MaterialChip>
      <MaterialChip variant="filter" disabled selected={true} onClick={onClickFilter}>
        Selected (disabled)
      </MaterialChip>
      <MaterialChip variant="filter" disabled selected={false} onClick={onClickFilter}>
        Not selected (disabled)
      </MaterialChip>
      <MaterialChip variant="filter" elevated selected={true} onClick={onClickFilter}>
        Selected (elevated)
      </MaterialChip>
      <MaterialChip variant="filter" elevated selected={false} onClick={onClickFilter}>
        Not selected (elevated)
      </MaterialChip>
      <MaterialChip variant="filter" disabled elevated selected={true} onClick={onClickFilter}>
        Selected (disabled and elevated)
      </MaterialChip>
      <MaterialChip variant="filter" disabled elevated selected={false} onClick={onClickFilter}>
        Not selected (disabled and elevated)
      </MaterialChip>
    </MaterialChipSet>
  )
});

export const InputChips = meta.story({
  tags: ['!test'],
  render: () => (
    <MaterialChipSet>
      <MaterialChip variant="input" selected>
        Selected
      </MaterialChip>
      <MaterialChip variant="input" selected={false}>
        Not selected
      </MaterialChip>
      <MaterialChip variant="input" removeOnly selected>
        Selected (remove only)
      </MaterialChip>
      <MaterialChip variant="input" removeOnly selected={false}>
        Not selected (remove only)
      </MaterialChip>
    </MaterialChipSet>
  )
});

export const SuggestionChips = meta.story({
  tags: ['!test'],
  render: () => (
    <MaterialChipSet>
      <MaterialChip variant="suggestion">Suggestion chip</MaterialChip>
      <MaterialChip variant="suggestion" elevated>
        Elevated
      </MaterialChip>
      <MaterialChip variant="suggestion" disabled>
        Disabled
      </MaterialChip>
    </MaterialChipSet>
  )
});
