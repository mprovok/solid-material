import type { MaterialBodyLayoutWithDragHandleProps } from '../MaterialBodyLayout.types';

export interface TwoPaneLayoutProps extends MaterialBodyLayoutWithDragHandleProps {
  maximumWidth: number;
  margin: [number, number];
  class?: string | undefined;
}

export interface FixedAndFlexiblePaneLayoutProps extends TwoPaneLayoutProps {
  width: number;
  snapWidths: number[];
  preferredWidth?: number;
}
