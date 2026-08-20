import { MemoryRouter, Route } from '@solidjs/router';
import { createJSXDecorator } from 'storybook-solidjs-vite';

import type { MaterialNavigationItemType } from '../navigation-item/MaterialNavigationItem';

import preview from '../../../.storybook/preview';

import { MaterialNavigationBar } from './MaterialNavigationBar';

import PhotoFillIcon from '@solidmaterial/icons/400/outlined/photo-fill.svg';
import PhotoIcon from '@solidmaterial/icons/400/outlined/photo.svg';
import SpeakerFillIcon from '@solidmaterial/icons/400/outlined/speaker-fill.svg';
import SpeakerIcon from '@solidmaterial/icons/400/outlined/speaker.svg';
import VideocamFillIcon from '@solidmaterial/icons/400/outlined/videocam-fill.svg';
import VideocamIcon from '@solidmaterial/icons/400/outlined/videocam.svg';

const getItems = (): MaterialNavigationItemType[] => [
  {
    label: 'Photos',
    icon: PhotoIcon,
    activeIcon: PhotoFillIcon,
    href: '/photos',
    badge: {
      value: 2000,
      ariaLabel: '2000 new photos'
    }
  },
  {
    label: 'Videos',
    icon: VideocamIcon,
    activeIcon: VideocamFillIcon,
    href: '/disabled'
  },
  {
    label: 'Music',
    icon: SpeakerIcon,
    activeIcon: SpeakerFillIcon,
    href: '/music'
  }
];

const meta = preview.meta({
  title: 'Navigation/MaterialNavigationBar',
  component: MaterialNavigationBar,
  decorators: [
    createJSXDecorator(Story => (
      <div
        style={{
          display: 'flex',
          'flex-direction': 'column',
          height: '100vh',
          'justify-content': 'end',
          overflow: 'hidden'
        }}
      >
        <Story />
      </div>
    )),
    createJSXDecorator(Story => (
      <MemoryRouter>
        <Route path="*" component={Story} />
      </MemoryRouter>
    ))
  ],
  parameters: {
    docs: {
      story: {
        height: '500px',
        inline: false
      }
    },
    layout: 'fullscreen'
  },
  globals: {
    backgrounds: {
      value: 'surface'
    }
  },
  args: {
    show: true
  }
});

export const Horizontal = meta.story({
  args: {
    show: true,
    expanded: true,
    items: getItems(),
    ariaLabel: 'ARIA label of navigation bar'
  },
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: true }
  }
});

export const Vertical = meta.story({
  args: {
    show: true,
    expanded: false,
    items: getItems(),
    ariaLabel: 'ARIA label of navigation bar'
  },
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: false }
  }
});
