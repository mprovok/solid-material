import type { VoidComponent } from 'solid-js';

import { MaterialCard } from '@solidmaterial/material/components/card';
import { MaterialTabs } from '@solidmaterial/material/components/tab';
import { Span } from '@solidmaterial/material/components/typography';
import { Show, createSignal } from 'solid-js';

import { CopyToClipBoardButton } from '../copy-to-clipboard-button/CopyToClipboardButton';

import styles from './FilesBlock.module.css';

export type FileType = {
  label: string;
  content: string;
};

export interface FilesBlockProps {
  files: FileType[];
}

export const FilesBlock: VoidComponent<FilesBlockProps> = props => {
  const [isHovering, setHovering] = createSignal(false);

  const onPointerEnter = () => setHovering(true);
  const onPointerLeave = () => setHovering(false);

  const tabs = () =>
    props.files.map(file => ({
      label: file.label,
      panel: () => (
        <div class={styles['panel']}>
          <Span role="body" size="medium" class={styles['code']}>
            <pre>{file.content}</pre>
          </Span>
          <Show when={isHovering()}>
            <CopyToClipBoardButton content={file.content} message={`Copied ${file.label} to clipboard`} />
          </Show>
        </div>
      )
    }));

  return (
    <div class={styles['block']} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <MaterialCard variant="filled">
        <MaterialTabs variant="secondary" alignment="start" inlineIcons tabs={tabs()} />
      </MaterialCard>
    </div>
  );
};
