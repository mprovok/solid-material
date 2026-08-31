import type { FlowComponent } from 'solid-js';

import { Span } from '@solidmaterial/material/components/typography';
import { For, children } from 'solid-js';

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
  const digits = children(() => props.children);

  const count = () =>
    digits
      .toArray()
      .filter(digit => digit !== undefined)
      .map(digit => (typeof digit === 'string' ? digit.length : 1))
      .reduce((a, b) => a + b, 0);

  return (
    <output aria-label={props.ariaLabel} class={styles['display']} style={{ '--count': count() }}>
      <Span role="display" size="medium" class={VARIANT_CLASS[props.variant]}>
        <For each={digits.toArray().toReversed()}>{item => <span>{item}</span>}</For>
      </Span>
    </output>
  );
};
