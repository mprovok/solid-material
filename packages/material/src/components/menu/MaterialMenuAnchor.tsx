import type { FlowComponent, Ref } from 'solid-js';

import styles from './MaterialMenuAnchor.module.css';

export interface MaterialMenuAnchorProps {
  ref: Ref<HTMLDivElement>;
}

export const MaterialMenuAnchor: FlowComponent<MaterialMenuAnchorProps> = props => {
  return (
    <div class={styles['anchor']} ref={props.ref}>
      {props.children}
    </div>
  );
};
