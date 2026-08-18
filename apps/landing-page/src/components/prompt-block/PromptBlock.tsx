import type { VoidComponent } from 'solid-js';

import { MaterialCard } from '@solid-material/material/components/card';
import { MaterialTabs } from '@solid-material/material/components/tab';
import { Span } from '@solid-material/material/components/typography';
import { Show, createSignal } from 'solid-js';

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
  const [isHovering, setHovering] = createSignal(false);

  const onPointerEnter = () => setHovering(true);
  const onPointerLeave = () => setHovering(false);

  const onChange = (index: number) => {
    const key = KEYS[index];

    if (key !== undefined) {
      props.onChange?.(key);
    }
  };

  return (
    <div class={styles['block']} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
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
                  <Show when={isHovering()}>
                    <CopyToClipBoardButton content={props.prompts.pnpm} />
                  </Show>
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
                  <Show when={isHovering()}>
                    <CopyToClipBoardButton content={props.prompts.yarn} />
                  </Show>
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
                  <Show when={isHovering()}>
                    <CopyToClipBoardButton content={props.prompts.npm} />
                  </Show>
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
