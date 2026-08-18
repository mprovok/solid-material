import type { Component } from 'solid-js';

import { MaterialCard } from '@solid-material/material/components/card';
import { Span } from '@solid-material/material/components/typography';
import { Show, createSignal } from 'solid-js';

import { CopyToClipBoardButton } from '../copy-to-clipboard-button/CopyToClipboardButton';

import styles from './CodeBlock.module.css';

export interface CodeBlockProps {
  children: string;
}

export const CodeBlock: Component<CodeBlockProps> = props => {
  const [isHovering, setHovering] = createSignal(false);

  const onPointerEnter = () => setHovering(true);
  const onPointerLeave = () => setHovering(false);

  return (
    <div class={styles['block']} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <MaterialCard variant="filled">
        <Span role="body" size="medium" class={styles['code']}>
          <pre>{props.children}</pre>
          <Show when={isHovering()}>
            <CopyToClipBoardButton content={props.children} />
          </Show>
        </Span>
      </MaterialCard>
    </div>
  );
};
