import { Breakpoints } from '../../utils/breakpoints';

import type { MaterialNavigationLayoutProps } from './MaterialNavigationLayout.types';

/**
 * Return whether the app should display a navigation bar or rail
 *
 * Compact and medium width screens (mobile phones and tablets) can display
 * a navigation bar. Larger screens will always display a navigation rail.
 *
 * On compact width screens (mobile phones in portrait orientation) a navigation
 * bar should be displayed if there are no more than 5 items and the app has no
 * preference for the vertical space (otherwise a navigation rail should be displayed,
 * which can be hidden completely if necessary).
 *
 * On medium width screens (tablets), the app must have a preference for horizontal
 * space to display a navigation bar, otherwise a navigation rail should be displayed.
 *
 * @param items the number of (primary) items to display in the rail or bar
 * @param preferSpace The direction in which the app needs as much space as possible
 * @returns true if a navigation bar should be displayed, false for a navigation rail
 */
export const shouldShowBar = (items: number, preferSpace: MaterialNavigationLayoutProps['preferSpace']): boolean => {
  const hasTooManyItems = items > 5;

  return (
    (Breakpoints.isCompactWidth() && !hasTooManyItems && preferSpace !== 'vertical') ||
    (Breakpoints.isMediumWidth() && preferSpace === 'horizontal')
  );
};
