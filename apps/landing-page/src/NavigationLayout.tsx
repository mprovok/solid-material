import type { MaterialNavigationItemType } from '@solidmaterial/material/components/navigation-item';
import type { MaterialNavigationRailSecondaryItems } from '@solidmaterial/material/components/navigation-rail';
import type { FlowComponent } from 'solid-js';

import { MaterialNavigationLayout } from '@solidmaterial/material/layouts';

import AppsFillIcon from '@solidmaterial/icons/400/outlined/apps-fill.svg';
import AppsIcon from '@solidmaterial/icons/400/outlined/apps.svg';
import CodeBlocksFillIcon from '@solidmaterial/icons/400/outlined/code_blocks-fill.svg';
import CodeBlocksIcon from '@solidmaterial/icons/400/outlined/code_blocks.svg';
import ForkRightFillIcon from '@solidmaterial/icons/400/outlined/fork_right-fill.svg';
import ForkRightIcon from '@solidmaterial/icons/400/outlined/fork_right.svg';
import HomeFillIcon from '@solidmaterial/icons/400/outlined/home-fill.svg';
import HomeIcon from '@solidmaterial/icons/400/outlined/home.svg';
import LibraryBooksFillIcon from '@solidmaterial/icons/400/outlined/library_books-fill.svg';
import LibraryBooksIcon from '@solidmaterial/icons/400/outlined/library_books.svg';
import StartIcon from '@solidmaterial/icons/400/outlined/start.svg';

export const NavigationLayout: FlowComponent = props => {
  const items: MaterialNavigationItemType[] = [
    {
      label: 'Home',
      icon: HomeIcon,
      activeIcon: HomeFillIcon,
      href: '/',
      end: true
    },
    {
      label: 'Get started',
      icon: StartIcon,
      activeIcon: StartIcon,
      href: '/get-started'
    },
    {
      label: 'Components',
      icon: CodeBlocksIcon,
      activeIcon: CodeBlocksFillIcon,
      href: '/components'
    },
    {
      label: 'Examples',
      icon: AppsIcon,
      activeIcon: AppsFillIcon,
      href: '/examples'
    }
  ];

  const secondaryItems: MaterialNavigationItemType[] = [
    {
      label: 'Storybook',
      icon: LibraryBooksIcon,
      activeIcon: LibraryBooksFillIcon,
      href: '/storybook',
      target: '_blank'
    },
    {
      label: 'Repository',
      icon: ForkRightIcon,
      activeIcon: ForkRightFillIcon,
      href: 'https://github.com/mprovok/solid-material',
      target: '_blank'
    }
  ];

  const secondaryItemsData: MaterialNavigationRailSecondaryItems = {
    label: 'Links',
    items: secondaryItems
  };

  return (
    <MaterialNavigationLayout
      items={items}
      secondary={secondaryItemsData}
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
