import type { VoidComponent } from 'solid-js';

import { MaterialIconButton } from '@solidmaterial/material/components/icon-button';
import { showSnack } from '@solidmaterial/material/components/snackbar';

import styles from './CopyToClipboardButton.module.css';

import ContentCopyIcon from '@solidmaterial/icons/400/outlined/content_copy.svg';

export interface CopyToClipBoardButtonProps {
  content: string;
  message?: string;
}

export const CopyToClipBoardButton: VoidComponent<CopyToClipBoardButtonProps> = props => {
  const onClick = async () => {
    await navigator.clipboard.writeText(props.content);

    showSnack({
      text: props.message ?? 'Copied text to clipboard',
      dismissable: false
    });
  };

  return (
    <div class={styles['button']}>
      <MaterialIconButton variant="text" icon={<ContentCopyIcon />} title="Copy" onClick={void onClick} />
    </div>
  );
};
