import preview from '../../../.storybook/preview';

import { MaterialTab } from './MaterialTab';
import { MaterialTabs } from './MaterialTabs';

import MusicIcon from '@solidmaterial/icons/400/rounded/music_note.svg';
import PhotoIcon from '@solidmaterial/icons/400/rounded/photo.svg';
import VideocamIcon from '@solidmaterial/icons/400/rounded/videocam.svg';

const getTabs = () => [
  {
    label: 'Photos',
    icon: <PhotoIcon />,
    panel: () => <div>Photos panel</div>
  },
  {
    label: 'Videos',
    icon: <VideocamIcon />,
    panel: () => <div>Videos panel</div>
  },
  {
    label: 'Music',
    icon: <MusicIcon />,
    panel: () => <div>Music panel</div>
  }
];

const meta = preview.meta({
  title: 'Components/MaterialTabs',
  component: MaterialTabs,
  subcomponents: {
    MaterialTab
  },
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: true }
  },
  parameters: {
    layout: 'fullscreen'
  }
});

export const Primary = meta.story({
  args: {
    variant: 'primary',
    inlineIcons: false,
    ariaLabel: 'Tabs for photos, videos, and music',
    tabs: getTabs()
  }
});

export const PrimaryWithInlineIcons = meta.story({
  args: {
    variant: 'primary',
    inlineIcons: true,
    ariaLabel: 'Tabs for photos, videos, and music',
    tabs: getTabs()
  }
});

export const Secondary = meta.story({
  args: {
    variant: 'secondary',
    activeTabIndex: 1,
    ariaLabel: 'Tabs for photos, videos, and music',
    tabs: getTabs()
  }
});
