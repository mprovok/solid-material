import type { MaterialNavigationItemType } from '@solidmaterial/material/components/navigation-item';
import type { FlowComponent } from 'solid-js';

import { MaterialNavigationLayout } from '@solidmaterial/material/layouts';

import HomeFillIcon from '@solidmaterial/icons/400/outlined/home-fill.svg';
import HomeIcon from '@solidmaterial/icons/400/outlined/home.svg';
import SettingsFillIcon from '@solidmaterial/icons/400/outlined/settings-fill.svg';
import SettingsIcon from '@solidmaterial/icons/400/outlined/settings.svg';
import ImageFillIcon from '@solidmaterial/icons/400/rounded/image-fill.svg';
import ImageIcon from '@solidmaterial/icons/400/rounded/image.svg';
import VideocamFillIcon from '@solidmaterial/icons/400/rounded/videocam-fill.svg';
import VideocamIcon from '@solidmaterial/icons/400/rounded/videocam.svg';

export const NavigationLayout: FlowComponent = props => {
  const items: MaterialNavigationItemType[] = [
    {
      label: 'Label 1',
      icon: HomeIcon,
      activeIcon: HomeFillIcon,
      href: '/',
      end: true
    },
    {
      label: 'Label 2',
      icon: ImageIcon,
      activeIcon: ImageFillIcon,
      href: '/label-2'
    },
    {
      label: 'Label 3',
      icon: VideocamIcon,
      activeIcon: VideocamFillIcon,
      href: '/label-3'
    },
    {
      label: 'Label 4',
      icon: SettingsIcon,
      activeIcon: SettingsFillIcon,
      href: '/label-4'
    }
  ];

  return (
    <MaterialNavigationLayout
      items={items}
      menuButton={{
        title: 'Open menu',
        titleSelected: 'Close menu'
      }}
      snackbarAlignment="start"
    >
      {props.children}
    </MaterialNavigationLayout>
  );
};
