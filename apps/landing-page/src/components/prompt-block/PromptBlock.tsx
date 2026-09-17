import type { VoidComponent } from 'solid-js';

import { MaterialCard } from '@solidmaterial/material/components/card';
import { MaterialTabs } from '@solidmaterial/material/components/tab';
import { Span } from '@solidmaterial/material/components/typography';

import NPMIcon from '../../assets/NPM.svg';
import PNPMIcon from '../../assets/PNPM.svg';
import YarnIcon from '../../assets/Yarn.svg';
import { CopyToClipBoardButton } from '../copy-to-clipboard-button/CopyToClipboardButton';

import styles from './PromptBlock.module.css';

export interface PromptBlockProps {
  prompts: {
    npm: string;
    pnpm: string;
    yarn: string;
  };
  active?: string;
  onChange?: (key: string) => void;
}

const KEYS = ['pnpm', 'yarn', 'npm'];

export const PromptBlock: VoidComponent<PromptBlockProps> = props => {
  const onChange = (index: number) => {
    const key = KEYS[index];

    if (key !== undefined) {
      props.onChange?.(key);
    }
  };

  return (
    <div class={styles['block']}>
      <MaterialCard variant="filled">
        <MaterialTabs
          variant="secondary"
          alignment="start"
          inlineIcons
          activeTabIndex={props.active !== undefined ? KEYS.indexOf(props.active) : undefined}
          tabs={[
            {
              label: 'pnpm',
              icon: <PNPMIcon />,
              panel: () => (
                <div class={styles['panel']}>
                  <Span role="body" size="medium" class={styles['prompt']}>
                    {props.prompts.pnpm}
                  </Span>
                  <CopyToClipBoardButton content={props.prompts.pnpm} />
                </div>
              )
            },
            {
              label: 'yarn',
              icon: <YarnIcon />,
              panel: () => (
                <div class={styles['panel']}>
                  <Span role="body" size="medium" class={styles['prompt']}>
                    {props.prompts.yarn}
                  </Span>
                  <CopyToClipBoardButton content={props.prompts.yarn} />
                </div>
              )
            },
            {
              label: 'npm',
              icon: <NPMIcon />,
              panel: () => (
                <div class={styles['panel']}>
                  <Span role="body" size="medium" class={styles['prompt']}>
                    {props.prompts.npm}
                  </Span>
                  <CopyToClipBoardButton content={props.prompts.npm} />
                </div>
              )
            }
          ]}
          onChange={onChange}
        />
      </MaterialCard>
    </div>
  );
};
