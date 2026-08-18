import type { VoidComponent } from 'solid-js';

import { useContext } from 'solid-js';

import { ColorContext } from '../../../contexts';

import { ColorButton } from './ColorButton';

import styles from './SettingsColorButtons.module.css';

export const SettingsColorButtons: VoidComponent = () => {
  const [_, setColor] = useContext(ColorContext);

  return (
    <div class={styles['buttons']}>
      <ColorButton color="#ff7b00" shape="square" onChange={setColor} />
      <ColorButton color="#2c4f7c" changable={false} onChange={setColor} />
      <ColorButton color="#6750a4" changable={false} onChange={setColor} />
    </div>
  );
};
