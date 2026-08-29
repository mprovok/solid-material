import type { VoidComponent } from 'solid-js';

import { useNavigate } from '@solidjs/router';

import type { ListItemType } from '../../components/list/List';

import { List } from '../../components/list/List';

import AddBoxIcon from '@solidmaterial/icons/400/outlined/add_box.svg';
import AppBadgingIcon from '@solidmaterial/icons/400/outlined/app_badging.svg';
import ArrowDropDownCircleIcon from '@solidmaterial/icons/400/outlined/arrow_drop_down_circle.svg';
import BottomNavigationIcon from '@solidmaterial/icons/400/outlined/bottom_navigation.svg';
import BottomSheetsIcon from '@solidmaterial/icons/400/outlined/bottom_sheets.svg';
import ButtonsAltIcon from '@solidmaterial/icons/400/outlined/buttons_alt.svg';
import CallToActionIcon from '@solidmaterial/icons/400/outlined/call_to_action.svg';
import CardsIcon from '@solidmaterial/icons/400/outlined/cards.svg';
import CheckBoxIcon from '@solidmaterial/icons/400/outlined/check_box.svg';
import CheckBoxOutlineBlankIcon from '@solidmaterial/icons/400/outlined/check_box_outline_blank.svg';
import CustomTypographyIcon from '@solidmaterial/icons/400/outlined/custom_typography.svg';
import DialogsIcon from '@solidmaterial/icons/400/outlined/dialogs.svg';
import DropdownIcon from '@solidmaterial/icons/400/outlined/dropdown.svg';
import FastFoodIcon from '@solidmaterial/icons/400/outlined/fastfood.svg';
import HighlightKeyboardFocusIcon from '@solidmaterial/icons/400/outlined/highlight_keyboard_focus.svg';
import HorizontalRuleIcon from '@solidmaterial/icons/400/outlined/horizontal_rule.svg';
import ImageIcon from '@solidmaterial/icons/400/outlined/image.svg';
import ListIcon from '@solidmaterial/icons/400/outlined/list.svg';
import MenuIcon from '@solidmaterial/icons/400/outlined/menu.svg';
import MenuOpenIcon from '@solidmaterial/icons/400/outlined/menu_open.svg';
import MoreHorizIcon from '@solidmaterial/icons/400/outlined/more_horiz.svg';
import PaletteIcon from '@solidmaterial/icons/400/outlined/palette.svg';
import Password2Icon from '@solidmaterial/icons/400/outlined/password_2.svg';
import ProgressActivityIcon from '@solidmaterial/icons/400/outlined/progress_activity.svg';
import RadioButtonCheckedIcon from '@solidmaterial/icons/400/outlined/radio_button_checked.svg';
import ResponsiveLayoutIcon from '@solidmaterial/icons/400/outlined/responsive_layout.svg';
import RipplesIcon from '@solidmaterial/icons/400/outlined/ripples.svg';
import SearchIcon from '@solidmaterial/icons/400/outlined/search.svg';
import SlidersIcon from '@solidmaterial/icons/400/outlined/sliders.svg';
import SwitchesIcon from '@solidmaterial/icons/400/outlined/switches.svg';
import TableRowsIcon from '@solidmaterial/icons/400/outlined/table_rows.svg';
import TabsIcon from '@solidmaterial/icons/400/outlined/tabs.svg';
import TextFieldsIcon from '@solidmaterial/icons/400/outlined/text_fields.svg';
import ThumbnailBarIcon from '@solidmaterial/icons/400/outlined/thumbnail_bar.svg';
import ToolbarIcon from '@solidmaterial/icons/400/outlined/toolbar.svg';
import TooltipIcon from '@solidmaterial/icons/400/outlined/tooltip.svg';
import Tooltip2Icon from '@solidmaterial/icons/400/outlined/tooltip_2.svg';
import ViewCarouselIcon from '@solidmaterial/icons/400/outlined/view_carousel.svg';
import ViewColumnIcon from '@solidmaterial/icons/400/outlined/view_column.svg';
import ViewColumn2Icon from '@solidmaterial/icons/400/outlined/view_column_2.svg';
import ViewSidebarIcon from '@solidmaterial/icons/400/outlined/view_sidebar.svg';

export const COMPONENTS: (ListItemType & { storyBookId: string })[] = [
  {
    name: 'app-bar',
    icon: ToolbarIcon,
    label: 'MaterialAppBar',
    storyBookId: 'components-materialappbar--docs'
  },
  {
    name: 'badge',
    icon: AppBadgingIcon,
    label: 'MaterialBadge 😵',
    storyBookId: 'components-materialbadge--docs'
  },
  {
    name: 'bottom-sheet',
    icon: BottomSheetsIcon,
    label: 'MaterialBottomSheet',
    storyBookId: 'components-materialbottomsheet--docs'
  },
  {
    name: 'card',
    icon: CardsIcon,
    label: 'MaterialCard',
    storyBookId: 'components-materialcard--docs'
  },
  {
    name: 'carousel',
    icon: ViewCarouselIcon,
    label: 'MaterialCarousel',
    storyBookId: 'components-materialcarousel--docs'
  },
  {
    name: 'chip',
    icon: MoreHorizIcon,
    label: 'MaterialChipSet',
    storyBookId: 'components-materialchipset--docs'
  },
  {
    name: 'dialog',
    icon: DialogsIcon,
    label: 'MaterialDialog 😵',
    storyBookId: 'components-materialdialog--docs'
  },
  {
    name: 'divider',
    icon: HorizontalRuleIcon,
    label: 'MaterialDivider',
    storyBookId: 'components-materialdivider--docs'
  },
  {
    name: 'icon',
    icon: ImageIcon,
    label: 'MaterialIcon',
    storyBookId: 'components-materialicon--docs'
  },
  {
    name: 'list',
    icon: TableRowsIcon,
    label: 'MaterialList',
    storyBookId: 'components-materiallist--docs'
  },
  {
    name: 'list-item',
    icon: ListIcon,
    label: 'MaterialListItem',
    storyBookId: 'components-materiallistitem--docs'
  },
  {
    name: 'menu',
    icon: MenuIcon,
    label: 'MaterialMenu',
    storyBookId: 'components-materialmenu--docs'
  },
  {
    name: 'progress-linear',
    icon: SlidersIcon,
    label: 'MaterialProgress (linear)',
    storyBookId: 'components-materialprogress-linear--docs'
  },
  {
    name: 'progress-circular',
    icon: ProgressActivityIcon,
    label: 'MaterialProgress (circular)',
    storyBookId: 'components-materialprogress-circular--docs'
  },
  {
    name: 'search',
    icon: SearchIcon,
    label: 'MaterialSearch',
    storyBookId: 'components-materialsearch--docs'
  },
  {
    name: 'side-sheet',
    icon: ViewSidebarIcon,
    label: 'MaterialSideSheet 😵',
    storyBookId: 'components-materialsidesheet--docs'
  },
  {
    name: 'skeleton',
    icon: CheckBoxOutlineBlankIcon,
    label: 'MaterialSkeleton',
    storyBookId: 'components-materialskeleton--docs'
  },
  {
    name: 'snackbar-container',
    icon: FastFoodIcon,
    label: 'MaterialSnackbarContainer',
    storyBookId: 'components-materialsnackbarcontainer--docs'
  },
  {
    name: 'snackbar',
    icon: FastFoodIcon,
    label: 'MaterialSnackbar',
    storyBookId: 'components-materialsnackbarcontainer-materialsnackbar--docs'
  },
  {
    name: 'tabs',
    icon: TabsIcon,
    label: 'MaterialTabs',
    storyBookId: 'components-materialtabs--docs'
  },
  {
    name: 'toolbar',
    icon: CallToActionIcon,
    label: 'MaterialToolbar',
    storyBookId: 'components-materialtoolbar--docs'
  },
  {
    name: 'tooltip-plain',
    icon: TooltipIcon,
    label: 'MaterialPlainTooltip',
    storyBookId: 'components-materialtooltip-materialplaintooltip--docs'
  },
  {
    name: 'tooltip-rich',
    icon: Tooltip2Icon,
    label: 'MaterialRichTooltip',
    storyBookId: 'components-materialtooltip-materialrichtooltip--docs'
  }
];

export const BUTTONS: (ListItemType & { storyBookId: string })[] = [
  {
    name: 'button-group',
    icon: ButtonsAltIcon,
    label: 'MaterialButtonGroup',
    storyBookId: 'buttons-materialbuttongroup--docs'
  },
  {
    name: 'button',
    icon: ButtonsAltIcon,
    label: 'MaterialButton',
    storyBookId: 'buttons-materialbutton--docs'
  },
  {
    name: 'fab-menu',
    icon: MenuIcon,
    label: 'MaterialFabMenu',
    storyBookId: 'buttons-materialfabmenu--docs'
  },
  {
    name: 'fab-web-menu',
    icon: MenuOpenIcon,
    label: 'MaterialFabWebMenu',
    storyBookId: 'buttons-materialfabwebmenu--docs'
  },
  {
    name: 'fab',
    icon: AddBoxIcon,
    label: 'MaterialFab',
    storyBookId: 'buttons-materialfab--docs'
  },
  {
    name: 'icon-button',
    icon: ImageIcon,
    label: 'MaterialIconButton',
    storyBookId: 'buttons-materialiconbutton--docs'
  },
  {
    name: 'split-button',
    icon: ArrowDropDownCircleIcon,
    label: 'MaterialSplitButton',
    storyBookId: 'buttons-materialsplitbutton--docs'
  },
  {
    name: 'split-button-menu',
    icon: ArrowDropDownCircleIcon,
    label: 'MaterialSplitButtonMenu',
    storyBookId: 'buttons-materialsplitbuttonmenu--docs'
  }
];
export const CONTROLS: (ListItemType & { storyBookId: string })[] = [
  {
    name: 'checkbox',
    icon: CheckBoxIcon,
    label: 'MaterialCheckbox',
    storyBookId: 'controls-materialcheckbox--docs'
  },
  {
    name: 'radio',
    icon: RadioButtonCheckedIcon,
    label: 'MaterialRadio',
    storyBookId: 'controls-materialradio--docs'
  },
  {
    name: 'select',
    icon: DropdownIcon,
    label: 'MaterialSelect',
    storyBookId: 'controls-materialselect--docs'
  },
  {
    name: 'slider',
    icon: SlidersIcon,
    label: 'MaterialSlider',
    storyBookId: 'controls-materialslider--docs'
  },
  {
    name: 'switch',
    icon: SwitchesIcon,
    label: 'MaterialSwitch',
    storyBookId: 'controls-materialswitch--docs'
  },
  {
    name: 'password-field',
    icon: Password2Icon,
    label: 'MaterialPasswordField',
    storyBookId: 'controls-materialpasswordfield--docs'
  },
  {
    name: 'text-field',
    icon: TextFieldsIcon,
    label: 'MaterialTextField',
    storyBookId: 'controls-materialtextfield--docs'
  }
];

export const UTILITIES: (ListItemType & { storyBookId: string })[] = [
  {
    name: 'focus-ring',
    icon: HighlightKeyboardFocusIcon,
    label: 'MaterialFocusRing',
    storyBookId: 'utilities-materialfocusring--docs'
  },
  {
    name: 'ripple',
    icon: RipplesIcon,
    label: 'MaterialRipple',
    storyBookId: 'utilities-materialripple--docs'
  },
  {
    name: 'typography',
    icon: CustomTypographyIcon,
    label: 'H1, H2, H3, H4, H5, H6, Span',
    storyBookId: 'utilities-typography-span--docs'
  },
  {
    name: 'theme',
    icon: PaletteIcon,
    label: 'MaterialTheme',
    storyBookId: 'utilities-materialtheme--docs'
  }
];

export const NAVIGATION: (ListItemType & { storyBookId: string })[] = [
  {
    name: 'navigation-bar',
    icon: BottomNavigationIcon,
    label: 'MaterialNavigationBar',
    storyBookId: 'navigation-materialnavigationbar--docs'
  },
  {
    name: 'navigation-rail',
    icon: ThumbnailBarIcon,
    label: 'MaterialNavigationRail',
    storyBookId: 'navigation-materialnavigationrail--docs'
  }
];

export const LAYOUT: (ListItemType & { storyBookId: string })[] = [
  {
    name: 'body-layout',
    icon: ViewColumnIcon,
    label: 'MaterialBodyLayout 😵',
    storyBookId: 'layouts-materialbodylayout--docs'
  },
  {
    name: 'list-detail-layout',
    icon: ViewColumn2Icon,
    label: 'MaterialListDetailLayout 😵',
    storyBookId: 'layouts-materiallistdetaillayout--docs'
  },
  {
    name: 'navigation-layout',
    icon: ResponsiveLayoutIcon,
    label: 'MaterialNavigationLayout 💤',
    storyBookId: 'layouts-materialnavigationlayout--docs'
  }
];

export interface ComponentListProps {
  items: ListItemType[];
  name: string | undefined;
}

export const ComponentList: VoidComponent<ComponentListProps> = props => {
  const navigate = useNavigate();

  const onClick = (name: string) => navigate(`/components/${name}`, { state: { transition: 'forward' } });

  return <List items={props.items} name={props.name} onClick={onClick} />;
};
