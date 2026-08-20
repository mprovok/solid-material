import { MemoryRouter, Route } from '@solidjs/router';
import { createJSXDecorator } from 'storybook-solidjs-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import type { MaterialNavigationItemType } from '../../components/navigation-item/MaterialNavigationItem';

import preview from '../../../.storybook/preview';
import { MaterialFab } from '../../components/fab/MaterialFab';
import { showSnack } from '../../components/snackbar/MaterialSnackbarContext';
import { MaterialPane } from '../pane/MaterialPane';

import { MaterialNavigationLayout } from './MaterialNavigationLayout';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';
import PhotoFillIcon from '@solidmaterial/icons/400/outlined/photo-fill.svg';
import PhotoIcon from '@solidmaterial/icons/400/outlined/photo.svg';
import SpeakerFillIcon from '@solidmaterial/icons/400/outlined/speaker-fill.svg';
import SpeakerIcon from '@solidmaterial/icons/400/outlined/speaker.svg';
import ToastIcon from '@solidmaterial/icons/400/outlined/toast.svg';
import VideocamFillIcon from '@solidmaterial/icons/400/outlined/videocam-fill.svg';
import VideocamIcon from '@solidmaterial/icons/400/outlined/videocam.svg';

const ITEMS: MaterialNavigationItemType[] = [
  {
    label: 'Photos',
    icon: PhotoIcon,
    activeIcon: PhotoFillIcon,
    href: '/',
    end: true,
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

const getRailFab = () => ({
  label: 'In rail',
  icon: EditIcon
});

const showSnackbar = () => {
  showSnack({
    text: 'Supporting text',
    dismissable: true
  });
};

const getRailFabShowingSnackbar = () => ({
  label: 'Show snackbar',
  icon: ToastIcon,
  onClick: showSnackbar
});

const getBarFab = () => <MaterialFab icon={<PhotoIcon />}>Above bar</MaterialFab>;

const getBarFabShowingSnackbar = () => (
  <MaterialFab icon={<ToastIcon />} onClick={showSnackbar}>
    Show snackbar
  </MaterialFab>
);

const meta = preview.meta({
  title: 'Layouts/MaterialNavigationLayout',
  component: MaterialNavigationLayout,
  decorators: [
    createJSXDecorator(Story => (
      <MemoryRouter>
        <Route path="*" component={Story} />
      </MemoryRouter>
    ))
  ],
  args: {
    children: <MaterialPane></MaterialPane>,
    menuButton: {
      title: 'Expand',
      titleSelected: 'Collapse'
    }
  },
  parameters: {
    docs: {
      story: {
        height: '500px',
        inline: false
      }
    },
    layout: 'fullscreen'
  }
});

export const Example = meta.story({
  args: {
    show: true,
    items: ITEMS
  },
  play: async ({ canvas }) => {
    const menuButton = canvas.getByRole('switch');
    const items = canvas.getAllByRole('menuitem');

    await expect(menuButton).toBeInTheDocument();
    await Promise.all(items.map(async item => waitFor(async () => expect(item).not.toHaveAttribute('data-expanded'))));
    await expect(menuButton).toHaveAccessibleName('Expand');

    await userEvent.click(menuButton, { delay: 250 });

    await Promise.all(items.map(async item => waitFor(async () => expect(item).toHaveAttribute('data-expanded'))));
    await expect(menuButton).toHaveAccessibleName('Collapse');

    await userEvent.click(menuButton, { delay: 250 });
    await Promise.all(items.map(async item => waitFor(async () => expect(item).not.toHaveAttribute('data-expanded'))));
    await expect(menuButton).toHaveAccessibleName('Expand');
  },
  globals: {
    viewport: { value: 'ipad', isRotated: true }
  }
});

export const Hidden = meta.story({
  args: {
    show: false,
    items: ITEMS
  }
});

export const CompactWidth = meta.story({
  args: {
    show: true,
    items: ITEMS
  },
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: false }
  }
});

export const MediumWidth = meta.story({
  args: {
    show: true,
    items: ITEMS
  },
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: true }
  }
});

export const HorizontalSpace = meta.story({
  args: {
    show: true,
    items: ITEMS,
    preferSpace: 'horizontal'
  },
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: true }
  }
});

export const VerticalSpace = meta.story({
  args: {
    show: true,
    items: ITEMS,
    preferSpace: 'vertical'
  },
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: false }
  }
});

export const Tablet = meta.story({
  args: {
    show: true,
    items: ITEMS
  },
  globals: {
    viewport: { value: 'ipad', isRotated: false }
  }
});

export const FABInRail = meta.story({
  args: {
    show: true,
    items: ITEMS,
    fab: {
      rail: getRailFab(),
      bar: getBarFab()
    }
  }
});

export const FABInCorner = meta.story({
  args: {
    show: true,
    items: ITEMS,
    fab: {
      bar: getBarFabShowingSnackbar()
    }
  }
});

export const SnackbarAboveFAB = meta.story({
  args: {
    show: true,
    items: ITEMS,
    fab: {
      bar: getBarFabShowingSnackbar()
    }
  },
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: false }
  }
});

export const SnackbarAlignmentStart = meta.story({
  args: {
    show: true,
    items: ITEMS,
    fab: {
      rail: getRailFabShowingSnackbar(),
      bar: undefined
    },
    snackbarAlignment: 'start',
    snackbarCloseTitle: 'Close'
  }
});

export const SnackbarAlignmentCenter = meta.story({
  args: {
    show: true,
    items: ITEMS,
    fab: {
      rail: getRailFabShowingSnackbar(),
      bar: undefined
    },
    snackbarAlignment: 'center',
    snackbarCloseTitle: 'Close'
  }
});
