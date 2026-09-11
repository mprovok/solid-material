import type { VoidComponent } from 'solid-js';

import { MaterialIconButton } from '@solidmaterial/material/components/icon-button';
import { useContext } from 'solid-js';

import { ExpandContext, VibrateContext } from '../../../contexts';
import { BUTTON_PRESS_VIBRATE_MS } from '../../Calculator.types';

import styles from './ExpandButton.module.css';

import CollapseAllIcon from '@solidmaterial/icons/400/rounded/collapse_all.svg';
import ExpandAllIcon from '@solidmaterial/icons/400/rounded/expand_all.svg';

export const ExpandButton: VoidComponent = () => {
  const [isExpanded, setExpanded] = useContext(ExpandContext);
  const [isVibrate, _setVibrate] = useContext(VibrateContext);

  const vibrate = () => {
    if (isVibrate()) {
      globalThis.navigator.vibrate?.(BUTTON_PRESS_VIBRATE_MS);
    }
  };

  return (
    <div class={styles['expand-button']}>
      <MaterialIconButton
        variant="text"
        size="small"
        icon={isExpanded() ? <CollapseAllIcon /> : <ExpandAllIcon />}
        title={isExpanded() ? 'Hide scientific buttons' : 'Show scientific buttons'}
        onClick={() => {
          setExpanded(v => !v);
          vibrate();
        }}
      />
    </div>
  );
};
