import type { VoidComponent } from 'solid-js';

import styles from './Superscript.module.css';

export interface SuperscriptProps {
  base: string;
  superscript: string;
}

export const Superscript: VoidComponent<SuperscriptProps> = props => {
  return (
    <>
      <span>{props.base}</span>
      <math class={styles['math']}>
        <msup>
          <mi></mi>
          <mn>{props.superscript}</mn>
        </msup>
      </math>
    </>
  );
};
