import type { MenuPlacementAlignment, MenuPlacementSide } from './MaterialMenu.types';

const ANCHOR_CORNERS = {
  'left-start': 'start-start',
  'left-end': 'end-start',
  'right-start': 'start-end',
  'right-end': 'end-end',

  'top-start': 'start-start',
  'top-end': 'start-end',
  'bottom-start': 'end-start',
  'bottom-end': 'end-end'
};

const MENU_CORNERS = {
  'left-start': 'start-end',
  'left-end': 'end-end',
  'right-start': 'start-start',
  'right-end': 'end-start',

  'top-start': 'end-start',
  'top-end': 'end-end',
  'bottom-start': 'start-start',
  'bottom-end': 'start-end'
};

export const getAnchorCorner = (side: MenuPlacementSide, alignment: MenuPlacementAlignment): string => {
  return ANCHOR_CORNERS[`${side}-${alignment}`];
};

export const getMenuCorner = (side: MenuPlacementSide, alignment: MenuPlacementAlignment): string => {
  return MENU_CORNERS[`${side}-${alignment}`];
};
