import type { Component } from 'solid-js';

import { For, Show, createSignal } from 'solid-js';
import { fn } from 'storybook/test';

import type { MaterialButtonShape, MaterialButtonSize } from '../button/MaterialButton';

import preview from '../../../.storybook/preview';
import { MaterialProgress } from '../progress/MaterialProgress';
import { H3 } from '../typography/Typography';

import type { MaterialIconButtonProps } from './MaterialIconButton';

import { MaterialIconButton } from './MaterialIconButton';

import BookmarkIcon from '@solid-material/icons/400/outlined/bookmark.svg';
import EditIcon from '@solid-material/icons/400/outlined/edit.svg';
import PauseIcon from '@solid-material/icons/400/outlined/pause.svg';
import PlayArrowIcon from '@solid-material/icons/400/outlined/play_arrow.svg';
import SettingsFillIcon from '@solid-material/icons/400/outlined/settings-fill.svg';
import SettingsIcon from '@solid-material/icons/400/outlined/settings.svg';
import MoreVertIcon from '@solid-material/icons/400/rounded/more_vert.svg';
import VideocamIcon from '@solid-material/icons/400/rounded/videocam.svg';

const meta = preview.meta({
  title: 'Buttons/MaterialIconButton',
  component: MaterialIconButton,
  args: { onClick: fn() }
});

const SIZES: MaterialButtonSize[] = ['extra-small', 'small', 'medium', 'large', 'extra-large'];

const SHAPES: MaterialButtonShape[] = ['round', 'square'];

const MaterialIconButtonSizeRenderer: Component<Omit<MaterialIconButtonProps, 'size' | 'variant' | 'icon'>> = args => (
  <div style={{ display: 'flex', gap: '1rem', 'flex-wrap': 'wrap', 'align-items': 'center' }}>
    <For each={SIZES}>
      {size => <MaterialIconButton variant="tonal" icon={<VideocamIcon />} {...args} size={size} />}
    </For>
  </div>
);

const MaterialIconButtonShapeRenderer: Component<
  Omit<MaterialIconButtonProps, 'shape' | 'variant' | 'icon'>
> = args => (
  <div
    style={{
      display: 'grid',
      gap: '1rem',
      'grid-template-columns': 'repeat(4, 1fr)',
      'place-items': 'center'
    }}
  >
    <H3 role="body" size="large"></H3>
    <H3 role="body" size="large"></H3>
    <H3 role="body" size="large">
      Unselected
    </H3>
    <H3 role="body" size="large">
      Selected
    </H3>

    <For each={SHAPES}>
      {shape => (
        <>
          <H3 role="body" size="large">
            {shape[0]?.toUpperCase()}
            {shape.slice(1)}
          </H3>
          <MaterialIconButton variant="tonal" icon={<VideocamIcon />} {...args} shape={shape} />
          <MaterialIconButton variant="tonal" icon={<VideocamIcon />} {...args} shape={shape} toggle={false} />
          <MaterialIconButton variant="tonal" icon={<VideocamIcon />} {...args} shape={shape} toggle={true} />
        </>
      )}
    </For>
  </div>
);

const MaterialIconButtonWidthRenderer: Component<Omit<MaterialIconButtonProps, 'size' | 'variant' | 'icon'>> = args => (
  <div
    style={{
      display: 'grid',
      gap: '1rem',
      'grid-template-columns': 'repeat(3, 1fr)',
      'place-items': 'center'
    }}
  >
    <H3 role="body" size="large">
      Narrow
    </H3>
    <H3 role="body" size="large">
      Default
    </H3>
    <H3 role="body" size="large">
      Wide
    </H3>

    <For each={SIZES}>
      {size => (
        <>
          <MaterialIconButton variant="tonal" icon={<PlayArrowIcon />} {...args} size={size} width="narrow" />
          <MaterialIconButton variant="tonal" icon={<PlayArrowIcon />} {...args} size={size} width="default" />
          <MaterialIconButton variant="tonal" icon={<PlayArrowIcon />} {...args} size={size} width="wide" />
        </>
      )}
    </For>
  </div>
);

export const VariantFilled = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'filled',
    icon: <VideocamIcon />
  }
});

export const VariantTonal = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'tonal',
    icon: <SettingsIcon />
  }
});

export const VariantOutlined = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'outlined',
    icon: <MoreVertIcon />
  }
});

export const VariantText = meta.story({
  tags: ['!dev', '!autodocs'],
  args: {
    variant: 'text',
    icon: <BookmarkIcon />
  }
});

export const Variant = meta.story({
  tags: ['!test'],
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
        'grid-template-columns': 'repeat(4, 1fr)',
        'place-items': 'center'
      }}
    >
      <H3 role="body" size="large"></H3>
      <H3 role="body" size="large"></H3>
      <H3 role="body" size="large">
        Unselected
      </H3>
      <H3 role="body" size="large">
        Selected
      </H3>

      <H3 role="body" size="large">
        Filled
      </H3>
      <MaterialIconButton variant="filled" icon={<VideocamIcon />} />
      <MaterialIconButton variant="filled" icon={<VideocamIcon />} toggle={false} />
      <MaterialIconButton variant="filled" icon={<VideocamIcon />} toggle={true} />

      <H3 role="body" size="large">
        Tonal
      </H3>
      <MaterialIconButton variant="tonal" icon={<SettingsIcon />} />
      <MaterialIconButton variant="tonal" icon={<SettingsIcon />} toggle={false} />
      <MaterialIconButton variant="tonal" icon={<SettingsIcon />} toggle={true} />

      <H3 role="body" size="large">
        Outlined
      </H3>
      <MaterialIconButton variant="outlined" icon={<MoreVertIcon />} />
      <MaterialIconButton variant="outlined" icon={<MoreVertIcon />} toggle={false} />
      <MaterialIconButton variant="outlined" icon={<MoreVertIcon />} toggle={true} />

      <H3 role="body" size="large">
        Text
      </H3>
      <MaterialIconButton variant="text" icon={<SettingsFillIcon />} />
      <MaterialIconButton variant="text" icon={<SettingsFillIcon />} toggle={false} />
      <MaterialIconButton variant="text" icon={<SettingsFillIcon />} toggle={true} />
    </div>
  )
});

export const Size = meta.story({
  tags: ['!test'],
  render: () => <MaterialIconButtonSizeRenderer {...Size.composed.args} />
});

export const Shape = meta.story({
  test: ['!test'],
  render: () => <MaterialIconButtonShapeRenderer {...Shape.composed.args} />
});

export const Width = meta.story({
  tags: ['!test'],
  render: () => <MaterialIconButtonWidthRenderer {...Width.composed.args} />
});

export const Toggle = meta.story({
  tags: ['!test'],
  render: () => {
    const [isSelected, setIsSelected] = createSignal(false);

    const onClick = () => {
      setIsSelected(selected => !selected);
    };

    return (
      <MaterialIconButton
        variant="tonal"
        icon={
          <Show when={isSelected()} fallback={<PlayArrowIcon />}>
            <PauseIcon />
          </Show>
        }
        toggle={isSelected()}
        title={isSelected() ? 'Click to pause' : 'Click to play'}
        onClick={onClick}
      />
    );
  }
});

export const Disabled = meta.story({
  args: {
    variant: 'outlined',
    disabled: true,
    icon: <EditIcon />
  }
});

export const WithCircularProgress = meta.story({
  tags: ['!test'],
  render: () => {
    const [isSelected, setIsSelected] = createSignal(false);
    const onClickWithCircularProgress = () => {
      setIsSelected(selected => !selected);
    };

    return (
      <MaterialProgress variant="circular" value={0} indeterminate={isSelected()}>
        <MaterialIconButton
          variant="text"
          icon={
            <Show when={isSelected()} fallback={<PlayArrowIcon />}>
              <PauseIcon />
            </Show>
          }
          toggle={isSelected()}
          ariaLabel={isSelected() ? 'Click to pause' : 'Click to play'}
          onClick={onClickWithCircularProgress}
        />
      </MaterialProgress>
    );
  }
});
