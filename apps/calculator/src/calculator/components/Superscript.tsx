import type { VoidComponent } from 'solid-js';

import { Show } from 'solid-js';

import styles from './Superscript.module.css';

export interface SuperscriptProps {
  base?: string;
  superscript: string;
}

export const Superscript: VoidComponent<SuperscriptProps> = props => {
  return (
    <>
      <Show when={props.base}>
        <span>{props.base}</span>
      </Show>
      <math class={styles['math']}>
        <msup>
          <mi></mi>
          <mn>{props.superscript}</mn>
        </msup>
      </math>
    </>
  );
};
