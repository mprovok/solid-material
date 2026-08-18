import { createMediaQuery } from '@solid-primitives/media';

export enum Widths {
  MEDIUM = 600,
  EXPANDED = 840,
  LARGE = 1200,
  EXTRA_LARGE = 1600
}

export enum Heights {
  MEDIUM = 480,
  EXPANDED = 900
}

export const Breakpoints: {
  isCompactWidth: () => boolean;
  isMediumWidth: () => boolean;
  isExpandedWidth: () => boolean;
  isLargeWidth: () => boolean;
  isExtraLargeWidth: () => boolean;
  isCompactHeight: () => boolean;
  isMediumHeight: () => boolean;
  isExpandedHeight: () => boolean;
} = {
  isCompactWidth: createMediaQuery(`(width < ${Widths.MEDIUM}px)`),
  isMediumWidth: createMediaQuery(`(${Widths.MEDIUM}px <= width < ${Widths.EXPANDED}px)`),
  isExpandedWidth: createMediaQuery(`(${Widths.EXPANDED}px <= width < ${Widths.LARGE}px)`),
  isLargeWidth: createMediaQuery(`(${Widths.LARGE}px <= width < ${Widths.EXTRA_LARGE}px)`),
  isExtraLargeWidth: createMediaQuery(`(width >= ${Widths.EXTRA_LARGE}px)`),

  isCompactHeight: createMediaQuery(`(height < ${Heights.MEDIUM}px)`),
  isMediumHeight: createMediaQuery(`(${Heights.MEDIUM}px <= height < ${Heights.EXPANDED}px)`),
  isExpandedHeight: createMediaQuery(`(height >= ${Heights.EXPANDED}px)`)
};
