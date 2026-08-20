import type { Component } from 'solid-js';

import { createSignal } from 'solid-js';

import preview from '../../../.storybook/preview';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';

import { MaterialToolbar } from './MaterialToolbar';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';
import FormatBoldFillIcon from '@solidmaterial/icons/400/outlined/format_bold-fill.svg';
import FormatBoldIcon from '@solidmaterial/icons/400/outlined/format_bold.svg';
import FormatColorFillFillIcon from '@solidmaterial/icons/400/outlined/format_color_fill-fill.svg';
import FormatColorFillIcon from '@solidmaterial/icons/400/outlined/format_color_fill.svg';
import FormatColorTextFillIcon from '@solidmaterial/icons/400/outlined/format_color_text-fill.svg';
import FormatColorTextIcon from '@solidmaterial/icons/400/outlined/format_color_text.svg';
import FormatItalicFillIcon from '@solidmaterial/icons/400/outlined/format_italic-fill.svg';
import FormatItalicIcon from '@solidmaterial/icons/400/outlined/format_italic.svg';
import FormatUnderlinedFillIcon from '@solidmaterial/icons/400/outlined/format_underlined-fill.svg';
import FormatUnderlinedIcon from '@solidmaterial/icons/400/outlined/format_underlined.svg';

const PlaceholderButtons: Component = () => {
  const [isBold, setBold] = createSignal(true);
  const [isItalic, setItalic] = createSignal(true);
  const [isUnderlined, setUnderlined] = createSignal(false);
  const [isColorText, setColorText] = createSignal(false);
  const [isColorFill, setColorFill] = createSignal(false);

  return (
    <>
      <MaterialIconButton
        variant="filled"
        icon={isBold() ? <FormatBoldFillIcon /> : <FormatBoldIcon />}
        toggle={isBold()}
        title="Bold"
        ariaLabel="Bold"
        onClick={() => setBold(v => !v)}
      />
      <MaterialIconButton
        variant="tonal"
        icon={isItalic() ? <FormatItalicFillIcon /> : <FormatItalicIcon />}
        toggle={isItalic()}
        title="Italic"
        ariaLabel="Italic"
        onClick={() => setItalic(v => !v)}
      />
      <MaterialIconButton
        variant="text"
        icon={isUnderlined() ? <FormatUnderlinedFillIcon /> : <FormatUnderlinedIcon />}
        toggle={isUnderlined()}
        title="Underline"
        ariaLabel="Underline"
        onClick={() => setUnderlined(v => !v)}
      />
      <MaterialIconButton
        variant="tonal"
        icon={isColorText() ? <FormatColorTextFillIcon /> : <FormatColorTextIcon />}
        toggle={isColorText()}
        title="Color text"
        ariaLabel={'Color text'}
        onClick={() => setColorText(v => !v)}
      />
      <MaterialIconButton
        variant="filled"
        icon={isColorFill() ? <FormatColorFillFillIcon /> : <FormatColorFillIcon />}
        toggle={isColorFill()}
        title="Color fill"
        ariaLabel="Color fill"
        onClick={() => setColorFill(v => !v)}
      />
    </>
  );
};

const meta = preview.meta({
  title: 'Components/MaterialToolbar',
  component: MaterialToolbar,
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: false }
  },
  parameters: {
    docs: {
      story: {
        iframeHeight: '400px',
        inline: false
      }
    }
  }
});

export const FloatingHorizontal = meta.story({
  args: {
    direction: 'horizontal',
    mode: 'floating',
    children: <PlaceholderButtons />
  }
});

export const FloatingVertical = meta.story({
  args: {
    direction: 'vertical',
    mode: 'floating',
    children: <PlaceholderButtons />
  }
});

export const Docked = meta.story({
  args: {
    direction: 'horizontal',
    mode: 'docked',
    children: <PlaceholderButtons />
  }
});

export const VibrantColors = meta.story({
  args: {
    direction: 'horizontal',
    mode: 'floating',
    color: 'vibrant',
    children: <PlaceholderButtons />
  }
});

export const WithFAB = meta.story({
  args: {
    direction: 'horizontal',
    mode: 'floating',
    fab: {
      label: 'Edit',
      variant: 'tertiary',
      icon: <EditIcon />,
      ariaLabel: 'FAB in toolbar'
    },
    children: <PlaceholderButtons />
  }
});
