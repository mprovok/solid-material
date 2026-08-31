import type { VoidComponent } from 'solid-js';

import { MaterialIconButton } from '@solidmaterial/material/components/icon-button';
import { useContext } from 'solid-js';

import { ExpandContext } from '../../../contexts';

import styles from './ExpandButton.module.css';

import CollapseAllIcon from '@solidmaterial/icons/400/rounded/collapse_all.svg';
import ExpandAllIcon from '@solidmaterial/icons/400/rounded/expand_all.svg';

export const ExpandButton: VoidComponent = () => {
  const [isExpanded, setExpanded] = useContext(ExpandContext);

  return (
    <div class={styles['expand-button']}>
      <MaterialIconButton
        variant="text"
        size="small"
        icon={isExpanded() ? <CollapseAllIcon /> : <ExpandAllIcon />}
        title={isExpanded() ? 'Hide scientific buttons' : 'Show scientific buttons'}
        onClick={() => setExpanded(v => !v)}
      />
    </div>
  );
};
