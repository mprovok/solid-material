import type { Component } from 'solid-js';

import { MaterialCard } from '@solidmaterial/material/components/card';
import { Span } from '@solidmaterial/material/components/typography';

import { CopyToClipBoardButton } from '../copy-to-clipboard-button/CopyToClipboardButton';

import styles from './CodeBlock.module.css';

export interface CodeBlockProps {
  children: string;
}

export const CodeBlock: Component<CodeBlockProps> = props => {
  return (
    <div class={styles['block']}>
      <MaterialCard variant="filled">
        <Span role="body" size="medium" class={styles['code']}>
          <pre>{props.children}</pre>
        </Span>
        <CopyToClipBoardButton content={props.children} />
      </MaterialCard>
    </div>
  );
};
