import type { FlowComponent } from 'solid-js';

import { createMemo } from 'solid-js';

import type { FixedAndFlexiblePaneLayoutProps } from '../pane-layout.types';

import { isRTL } from '../../../../utils/i18n';
import { SPACER_WIDTH } from '../two-panes-with-spacer-layout/spacer/Spacer';
import { TwoPanesWithSpacerLayout } from '../two-panes-with-spacer-layout/TwoPanesWithSpacerLayout';

const clamp = (min: number, value: number, max: number) => Math.min(Math.max(min, value), max);

export const FixedFlexibleLayout: FlowComponent<FixedAndFlexiblePaneLayoutProps> = props => {
  const maximumWidth = createMemo(() => props.maximumWidth - SPACER_WIDTH);

  const snapWidths = () => [0, ...props.snapWidths, maximumWidth()];

  const offsetLeft = () => clamp(0, props.width - SPACER_WIDTH, SPACER_WIDTH);
  const offsetRight = () => clamp(0, props.maximumWidth - props.width - SPACER_WIDTH, SPACER_WIDTH);

  const clampedWidth = () => clamp(0, props.width, maximumWidth());
  const leftPaneWidth = () => clampedWidth() - (offsetRight() - SPACER_WIDTH);

  return (
    <TwoPanesWithSpacerLayout
      {...props}
      offsetLeft={offsetLeft()}
      offsetRight={offsetRight()}
      leftPaneWidth={leftPaneWidth()}
      snapWidths={snapWidths()}
      getUpdatedPosition={(position, delta) => (isRTL() ? position - delta : position + delta)}
    />
  );
};
