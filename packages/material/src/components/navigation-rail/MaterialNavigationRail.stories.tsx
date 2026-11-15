import { MemoryRouter, Route } from '@solidjs/router';
import { createJSXDecorator } from 'storybook-solidjs-vite';

import type { MaterialNavigationItemType } from '../navigation-item/MaterialNavigationItem';

import preview from '../../../.storybook/preview';

import type { MaterialNavigationRailSecondaryItems } from './MaterialNavigationRail';

import { MaterialNavigationRail } from './MaterialNavigationRail';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';
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
      value: 2_000,
      ariaLabel: '2000 new photos'
    }
  },
  {
    label: 'Videos',
    icon: VideocamIcon,
    activeIcon: VideocamFillIcon,
    href: '/videos'
  },
  {
    label: 'Music',
    icon: SpeakerIcon,
    activeIcon: SpeakerFillIcon,
    href: '/music'
  }
];

const getSecondaryItems = (): MaterialNavigationRailSecondaryItems => ({
  label: 'Secondary items',
  items: [
    {
      label: 'Photos',
      icon: PhotoIcon,
      activeIcon: PhotoFillIcon,
      href: '/photos'
    },
    {
      label: 'Music',
      icon: SpeakerIcon,
      activeIcon: SpeakerFillIcon,
      href: '/music'
    }
  ]
});

const getFab = () => ({
  label: 'Edit',
  icon: EditIcon,
  ariaLabel: 'Edit button in navigation rail',
  onClick: () => console.info('Clicked FAB in navigation rail')
});

const meta = preview.meta({
  title: 'Navigation/MaterialNavigationRail',
  component: MaterialNavigationRail,
  decorators: [
    createJSXDecorator(Story => (
      <MemoryRouter>
        <Route path="*" component={Story} />
      </MemoryRouter>
    ))
  ],
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'label-content-name-mismatch',
            enabled: false
          }
        ]
      }
    },
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

export const Collapsed = meta.story({
  args: {
    show: true,
    hideWhenCollapsed: false,
    expanded: false,
    items: getItems(),
    ariaLabel: 'ARIA label of navigation rail'
  },
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: true }
  }
});

export const Expanded = meta.story({
  args: {
    show: true,
    expanded: true,
    items: getItems(),
    ariaLabel: 'ARIA label of navigation rail'
  },
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: true }
  }
});

export const Center = meta.story({
  args: {
    show: true,
    center: true,
    items: getItems()
  },
  globals: {
    viewport: { value: 'ipad', isRotated: true }
  }
});

export const WithMenuButton = meta.story({
  args: {
    show: true,
    items: getItems(),
    menuButton: {
      title: 'Expand',
      titleSelected: 'Collapse'
    }
  },
  globals: {
    viewport: { value: 'pixel', isRotated: false }
  }
});

export const WithFAB = meta.story({
  args: {
    show: true,
    items: getItems(),
    fab: getFab()
  },
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: false }
  }
});

export const WithSecondaryItems = meta.story({
  args: {
    show: true,
    expanded: true,
    items: getItems(),
    secondary: getSecondaryItems(),
    ariaLabel: 'ARIA label of navigation rail'
  },
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: true }
  }
});

export const Modal = meta.story({
  args: {
    show: true,
    modal: true,
    menuButton: {
      title: 'Expand',
      titleSelected: 'Collapse'
    },
    hideWhenCollapsed: false,
    items: getItems(),
    fab: getFab()
  },
  globals: {
    viewport: { value: 'pixel', isRotated: true }
  }
});

export const HideWhenCollapsed = meta.story({
  args: {
    show: true,
    modal: true,
    menuButton: {
      title: 'Show',
      titleSelected: 'Hide'
    },
    hideWhenCollapsed: true,
    expanded: false,
    items: getItems(),
    fab: getFab()
  },
  globals: {
    viewport: { value: 'pixel', isRotated: false }
  }
});
