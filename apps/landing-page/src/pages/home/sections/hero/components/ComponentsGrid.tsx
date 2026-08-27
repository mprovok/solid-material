import type { VoidComponent } from 'solid-js';

import { MaterialFab } from '@solidmaterial/material/components/fab';

import { ExampleConnectedButtonGroup } from './examples/ExampleConnectedButtonGroup';
import { ExampleList } from './examples/ExampleList';
import { ExampleRichTooltip } from './examples/ExampleRichTooltip';
import { ExampleSearchBar } from './examples/ExampleSearchBar';
import { ExampleSnackbar } from './examples/ExampleSnackbar';
import { ExampleSplitButtonMenu } from './examples/ExampleSplitButtonMenu';

import styles from './ComponentsGrid.module.css';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';

export const ComponentsGrid: VoidComponent = () => {
  return (
    <div class={styles['components-grid']}>
      <div class={styles['tooltip']}>
        <ExampleRichTooltip />
      </div>
      <div class={styles['snackbar']}>
        <ExampleSnackbar />
      </div>
      <div class={styles['search-bar']}>
        <ExampleSearchBar />
      </div>
      <div class={styles['split-button']}>
        <ExampleSplitButtonMenu />
      </div>
      <div class={styles['button-group']}>
        <ExampleConnectedButtonGroup />
      </div>
      <div class={styles['fab']}>
        <MaterialFab color="tertiary" size="medium" icon={<EditIcon />} />
      </div>
      <div class={styles['list']}>
        <ExampleList />
      </div>
    </div>
  );
};
