import type { Component } from 'solid-js';

import { createJSXDecorator } from 'storybook-solidjs-vite';
import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { MaterialIconButton } from '../icon-button/MaterialIconButton';

import { MaterialAppBar } from './MaterialAppBar';

import CalendarTodayFillIcon from '@solidmaterial/icons/400/outlined/calendar_today-fill.svg';
import MapFillIcon from '@solidmaterial/icons/400/outlined/map-fill.svg';
import SearchIcon from '@solidmaterial/icons/400/outlined/search.svg';

const PlaceholderText: Component = () => {
  return (
    <div style={{ 'background-color': 'var(--md-sys-color-inverse-on-surface)', padding: '1rem' }}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </p>
      <br />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </p>
      <br />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </p>
    </div>
  );
};

const meta = preview.meta({
  title: 'Components/MaterialAppBar',
  component: MaterialAppBar,
  decorators: [
    createJSXDecorator(Story => (
      <div>
        <Story />
        <PlaceholderText />
      </div>
    ))
  ],
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: false }
  },
  parameters: {
    layout: 'fullscreen'
  }
});

export const Example = meta.story({
  args: {
    variant: 'large',
    title: 'Title',
    subtitle: 'Subtitle',
    leadingButtonAriaLabel: 'Go back',
    onNavigate: fn(),
    trailingButtons: <MaterialIconButton variant="text" ariaLabel="Search" icon={<MapFillIcon />} />
  }
});

export const SizeSmall = meta.story({
  args: {
    variant: 'small',
    title: 'Title'
  }
});

export const SizeMedium = meta.story({
  args: {
    variant: 'medium',
    title: 'Title'
  }
});

export const SizeLarge = meta.story({
  args: {
    variant: 'large',
    title: 'Title'
  }
});

export const Subtitle = meta.story({
  args: {
    variant: 'small',
    title: 'Title',
    subtitle: 'Subtitle'
  }
});

export const Center = meta.story({
  args: {
    variant: 'large',
    title: 'Title',
    center: true
  }
});

export const LeadingButtonBack = meta.story({
  args: {
    variant: 'small',
    title: 'Title',
    leadingButtonAriaLabel: 'Go back',
    onNavigate: fn()
  }
});

export const LeadingButtonMenu = meta.story({
  args: {
    variant: 'small',
    title: 'Title',
    leadingButtonType: 'menu',
    leadingButtonAriaLabel: 'Open menu',
    onNavigate: fn()
  }
});

export const trailingButtons = meta.story({
  args: {
    variant: 'small',
    title: 'Title',
    trailingButtons: (
      <>
        <MaterialIconButton variant="text" ariaLabel="Search" icon={<SearchIcon />} />
        <MaterialIconButton variant="text" ariaLabel="Open calendar" icon={<CalendarTodayFillIcon />} />
      </>
    )
  }
});
