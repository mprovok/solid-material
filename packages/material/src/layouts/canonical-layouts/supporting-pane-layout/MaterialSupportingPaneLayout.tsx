import type { FlowComponent } from 'solid-js';

import { MaterialBodyLayout } from '../../body-layout/MaterialBodyLayout';

import styles from './MaterialSupportingPaneLayout.module.css';

export interface MaterialSupportingPaneLayoutProps {
  rounded?: boolean;
}

export const MaterialSupportingPaneLayout: FlowComponent<MaterialSupportingPaneLayoutProps> = props => {
  return (
    <MaterialBodyLayout
      variant="flexible-flexible"
      showDragHandle={false}
      rounded={props.rounded}
      class={styles['layout']}
    >
      {props.children}
    </MaterialBodyLayout>
  );
};
