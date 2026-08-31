import type { FlowComponent } from 'solid-js';

import { Span } from '@solidmaterial/material/components/typography';
import { Breakpoints } from '@solidmaterial/material/utils';
import { createMemo } from 'solid-js';

import styles from './Display.module.css';

export type DisplayVariant = 'input' | 'output' | 'error';

export interface DisplayProps {
  variant: DisplayVariant;
  ariaLabel?: string;
}

const VARIANT_CLASS: Record<DisplayVariant, string> = {
  input: styles['input']!,
  output: styles['output']!,
  error: styles['error']!
};

export const Display: FlowComponent<DisplayProps> = props => {
  const isMobile = () => Breakpoints.isCompactWidth() || Breakpoints.isCompactHeight();
  const displayFontSize = createMemo(() => (isMobile() ? 'medium' : 'large'));

  return (
    <output aria-label={props.ariaLabel} class={styles['display']}>
      <Span role="display" size={displayFontSize()} class={VARIANT_CLASS[props.variant]}>
        {props.children}
      </Span>
    </output>
  );
};
